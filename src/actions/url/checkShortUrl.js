"use server";
import connectDB from "@/lib/db/mongodb";
import GuestUser from "@/models/url/GuestUser";
import TrackUser from "@/models/url/TrackUser";
const checkShortUrl = async (shortUrl) => {
  await connectDB();
  // Check if the url is already exist in guest user if it exists return its saved shorl url
  const shortUrlExist =
    (await GuestUser.findOne({ shortUrl })) ||
    (await TrackUser.findOne({ "urls.shortUrl": shortUrl }));
  if (shortUrlExist) {
    return {
      success: true,
      error: false,
      longUrl: shortUrlExist.longUrl,
      message: "This user is available in database",
    };
  } else {
    return {
      success: false,
      error: true,
      message: "User not found in database",
    };
  }
};
export { checkShortUrl };
