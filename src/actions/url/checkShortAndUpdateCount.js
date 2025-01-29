"use server";
import connectDB from "@/lib/db/mongodb";
import GuestUser from "@/models/url/GuestUser";
import TrackUser from "@/models/url/TrackUser";

const checkShortAndUpdateCount = async (shortUrl) => {
  try {
    await connectDB();

    // Check if the URL exists in the database
    const guestUrlExist = await GuestUser.findOne({ shortUrl });
    const trackUrlExist = await TrackUser.findOne({
      "urls.shortUrl": shortUrl,
    });

    if (trackUrlExist) {
      // Generate 'today' in local time (YYYY-MM-DD format)
      const today = new Date().toLocaleDateString("en-CA"); // 'en-CA' ensures format 'YYYY-MM-DD'

      const urlData = trackUrlExist.urls.find(
        (url) => url.shortUrl === shortUrl
      );
      const clickAt = urlData.clickAt; // Array of click records (dates stored as strings)
      const lastEntry = clickAt.at(-1); // Get the last entry

      if (lastEntry) {
        const lastDate = new Date(lastEntry.date); // Convert string to Date object
        const currentDate = new Date(today); // Convert today's date to Date object

        const missingDays = [];
        let nextDate = new Date(lastDate);
        nextDate.setDate(nextDate.getDate() + 1); // Move to the day after lastEntry

        // Fill all missing days with count: 0
        while (nextDate < currentDate) {
          missingDays.push({
            date: nextDate.toLocaleDateString("en-CA"), // Convert to 'YYYY-MM-DD' string
            count: 0,
          });
          nextDate.setDate(nextDate.getDate() + 1); // Increment day
        }

        // If there are missing days, update them in the database
        if (missingDays.length > 0) {
          await TrackUser.updateOne(
            { "urls.shortUrl": shortUrl },
            {
              $push: {
                "urls.$.clickAt": { $each: missingDays }, // Add missing days
              },
            }
          );
        }
      }

      // Ensure today's entry exists
      const todayEntry = urlData.clickAt.find((entry) => entry.date === today);
      if (!todayEntry) {
        await TrackUser.updateOne(
          { "urls.shortUrl": shortUrl },
          {
            $push: {
              "urls.$.clickAt": { date: today, count: 0 },
            },
          }
        );
      }

      // Increment today's count if it exists
      await TrackUser.updateOne(
        {
          "urls.shortUrl": shortUrl,
        },
        {
          $inc: { "urls.$.clickAt.$[elem].count": 1 },
          $set: { "urls.$.lastClick": new Date() },//updaed last visit
        },
        { arrayFilters: [{ "elem.date": today }] }
      );

      return {
        success: true,
        error: false,
        longUrl: urlData.longUrl,
        message: "Tracked user URL updated successfully",
      };
    } else if (guestUrlExist) {
      // If the URL exists for a guest user

      return {
        success: true,
        error: false,
        longUrl: guestUrlExist.longUrl,
        message: "Guest user URL found in the database",
      };
    } else {
      return {
        success: false,
        error: true,
        message: "Short URL not found in the database",
      };
    }
  } catch (error) {
    console.error("Error in checkShortAndUpdateCount:", error);
    return {
      success: false,
      error: true,
      message: "An error occurred while processing the request",
    };
  }
};

export { checkShortAndUpdateCount };
