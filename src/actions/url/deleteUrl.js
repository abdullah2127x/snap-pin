"use server";
import connectDB from "@/lib/db/mongodb";
import TrackUser from "@/models/url/TrackUser";
import mongoose from "mongoose";

const deleteUrl = async ({ email, provider, urlId }) => {
  await connectDB();
  try {
    const deletedUser = await TrackUser.updateOne(
      { email, provider },
      { $pull: { urls: { _id: urlId } } }
    );

    if (deletedUser.modifiedCount > 0) {
      return {
        success: true,
        error: false,
        message: "Url deleted successfully",
      };
    } else {
      return { success: false, error: true, message: "Error deleting url" };
    }
  } catch (error) {
    console.log("Error deleting url", error.message);
    return { success: false, error: true, message: "Server error" };
  }
};

export { deleteUrl };
