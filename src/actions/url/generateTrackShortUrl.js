// what i will do here:
// check the user in the db with provider and email
// if there is email and provider same means exist so update the urls of that user
// and if there is no user with email and provider so generate a new user with the  email and provider
// then update the user with that email and provider

"use server";
import { v4 as uuidv4 } from "uuid";
import connectDB from "@/lib/db/mongodb";
import GuestUser from "@/models/url/GuestUser";
import TrackUser from "@/models/url/TrackUser";

// requirement to save the teack user url
// email , longUrl, shortUrl,
const generateTrackShortUrl = async ({
  email,
  provider,
  longUrl,
  userShortCode,
}) => {
  // email,provider,  longUrl, userShortCode
  try {
    await connectDB();
    const generateShortCode = () => {
      return uuidv4().replace(/-/g, "").slice(0, 6);
    };

    let shortCode;
    if (userShortCode) {
      shortCode = userShortCode;
    } else {
      shortCode = generateShortCode();
    }
    let shortUrl = `${process.env.NEXT_PUBLIC_HOSTNAME}/${shortCode}`;

    // // Check for an existing URL in guest and track user and regenerate if needed
    while (
      (await GuestUser.findOne({ shortUrl })) &&
      (await TrackUser.urls.findOne({ "urls.shortUrl": shortUrl }))
    ) {
      shortCode = generateShortCode();
      shortUrl = `http://${process.env.NEXT_PUBLIC_HOSTNAME}/${shortCode}`;
    }
    
    const result = await TrackUser.findOneAndUpdate(
      { email, provider }, // Find criteria: user with matching email and provider

      {
        $setOnInsert: { email, provider }, // If creating a new user, set email and provider
        $push: {
          urls: {
            longUrl,
            shortUrl,
            clickAt: [], // Initialize clickAt as empty
            createdAt: new Date(),
          },
        },
      },
      {
        new: true, // Return the updated document
        upsert: true, // Create a new document if none exists
      }
    );
    if (result) {
      return {
        success: true,
        error: false,
        shortUrl,
        message: "Success",
      };
    }
  } catch (err) {
    console.log("Error saving url:", err.message);
    return {
      success: false,
      error: true,
      message: err.message,
    };
  }
};

export { generateTrackShortUrl };
