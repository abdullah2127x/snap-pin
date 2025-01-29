"use server";
import { v4 as uuidv4 } from "uuid";
import connectDB from "@/lib/db/mongodb";
import GuestUser from "@/models/url/GuestUser";
import TrackUser from "@/models/url/TrackUser";

const generateGuestShortUrl = async (longUrl) => {
  try {
    await connectDB();
    //check if the url is already exist in guest user if it exists return its saved shorl url
    const longUrlExist = await GuestUser.findOne({ longUrl });

    if (longUrlExist) {
      return {
        success: true,
        error: false,
        shortCode: longUrlExist.shortCode,
        shortUrl: longUrlExist.shortUrl,
        message: "URl create successfully!", // Thsi user is also in db so updating it
      };
    }
    // Generate a random short code
    const generateShortCode = () => {
      return uuidv4().replace(/-/g, "").slice(0, 6);
    };

    let shortCode = generateShortCode();
    let shortUrl = `${process.env.NEXT_PUBLIC_HOSTNAME}/${shortCode}`;

    
    // Check for an existing URL in guest and track user and regenerate if needed
    while (await GuestUser.findOne({ shortUrl })  && await TrackUser.findOne({ shortUrl }) ) {
      shortCode = generateShortCode();
      shortUrl = `http://${process.env.NEXT_PUBLIC_HOSTNAME}/${shortCode}`;
    }

    // Save the new URL to the database
    const newUrl = new GuestUser({ longUrl, shortUrl });
    await newUrl.save();

    console.log("New URL saved to the database");
    return {
      success: true,
      error: false,
      shortCode,
      shortUrl,
      message: "URl create successfully!", 
    };
  } catch (err) {
    console.log("Error saving url:", err.message);
    return {
      success: false,
      error: true,
      message: "Internal Server Error"
    };
  }
};

export { generateGuestShortUrl };
