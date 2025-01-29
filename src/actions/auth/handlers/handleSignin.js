"use server";
import { checkUserExist } from "@/actions/auth/checkUserExist";
import { checkPassword } from "@/actions/auth/checkPassword";

const handleSignin = async (formData) => {
  const { email, password, remember, provider } = formData;

  const userExistResult = await checkUserExist({ email, provider });
  // success false in user exist means user is not present in the database so turn success to false
  if (userExistResult && userExistResult.success) {
    const passRes = await checkPassword({ email, password });
    if (passRes) {
      return passRes;
    }
  } else {
    // if user exist
    return userExistResult;
  }
};

export { handleSignin };
