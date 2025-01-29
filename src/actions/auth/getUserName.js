"use server";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/auth/User";

const getUserName = async ({ email, provider }) => {
  await connectDB();
  const user = await User.findOne({ email, provider });

  if (user) {
    return {
      success: true,
      error: false,
      name: user.name,
      message: "User already exist!",
    };
  }
  return;
};
export { getUserName };
