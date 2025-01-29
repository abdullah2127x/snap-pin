"use server";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/auth/User";


const checkUserVerified = async ({email, provider}) => {
  await connectDB();
  const userExist = await User.findOne({ email, provider, isVerified: true });

  if (userExist) {
    return {
      success: true,
      error: false,
      message: "User is verified!",
    };
  } else {
    return {
        success: false,
        error: true,
        message: "User not found or not verified!",
    };
  }
};
export { checkUserVerified };
