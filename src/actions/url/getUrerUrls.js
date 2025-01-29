"use server";
import connectDB from "@/lib/db/mongodb";
// import GuestUser from "@/models/url/GuestUser";
import TrackUser from "@/models/url/TrackUser";

const getUserUrls = async ({ email, provider }) => {
  try {
    await connectDB();
    const trackUrlExist = await TrackUser.findOne({ email, provider });
    if (trackUrlExist ) {
      const urls = trackUrlExist.urls;

      // make a custom array with urls
      const sanitizedUrls = urls.map((url) => ({
        longUrl: url.longUrl || "", // Default to empty string
        shortUrl: url.shortUrl || "",
        clickAt: Array.isArray(url.clickAt)
          ? url.clickAt.map((click) => ({
              date: click.date || null, // Default to null if date is missing
              count: click.count || 0, // Default to 0 if count is missing
            }))
          : [], // Default to empty array if clickAt is not an array
        clicks: Array.isArray(url.clickAt)
          ? url.clickAt.reduce((acc, red) => {
              return acc + red.count;
            }, 0)
          : [],
        createdAt: url.createdAt || null, // Default to null if not present
        lastClick: url.lastClick || null, // Default to null if not present
        id: url._id || null, // Default to null if not present
      }));

      // Convert the array to JSON string with proper formatting and dates
      const userUrls = JSON.stringify(
        sanitizedUrls,
        (key, value) => {
          // Check if the key is 'createdAt' and modify it
          if (key === "createdAt") {
            return value ? value.split("T")[0] : null; // Modify to only date (YYYY-MM-DD)
          }
          return value; // Return the original value for all other properties
        },
        2
      );
      return {
        success: true,
        error: false,
        urls: userUrls,
        message: "Got users urls successfully!",
      };
    } else {
      return {
        success: false,
        error: true,
        message: "Use doesn't shorten their url yet!",
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
export { getUserUrls };
