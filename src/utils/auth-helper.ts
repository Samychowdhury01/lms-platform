// utils/auth-helper.ts
import { auth } from "@clerk/nextjs/server";

export const getUserAuth = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("User is not authenticated");
  return { userId };
};
