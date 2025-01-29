"use server";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/auth/User";

const checkCode = async ({ email, code , provider}) => {
  if (!email || !code) {
    return { success: false, error: true, message: "Invalid user data" };
  }

  try {
    await connectDB();
    const userExist = await User.findOne({ email, provider });
    const { updatedAt } = userExist;
    const currentTime = new Date();
    const timeDifference = (currentTime - updatedAt) / 1000 / 60; // Difference in minutes
    if (userExist) {
      if (userExist.code === code) {
        if (timeDifference > 10) {
          return {
            success: false,
            error: true,
            message: "Code Expired Reaquest new Code!",
          };
        } else {
          return {
            // data:userExist,
            isUpdated: userExist.isUpdated,
            success: true,
            error: false,
            message: "User verified successfully",
          };
        }
      } else {
        return {
          success: false,
          error: true,
          message: "Invalid code",
        };
      }
    } else {
      return {
        success: false,
        error: true,
        message: "User not found",
      };
    }
  } catch (error) {
    console.log("Error checking verifocation code: ", error.message);
  }
};
export { checkCode };
