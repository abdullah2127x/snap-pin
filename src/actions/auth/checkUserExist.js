"use server";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/auth/User";

const checkUserExist = async ({ email, provider }) => {
  await connectDB();
  const userExist = await User.findOne({ email, provider });

  if (userExist) {
    return {
      success: true,
      error: false,
      message: "User already exist!",
    };
  } else {
    return {
      success: false,
      error: true,
      message: "User not found!",
    };
  }
};
export { checkUserExist };
