export const isTeacher = (userId: string | null | undefined) => {
  console.log(userId === process.env.NEXT_PUBLIC_TEACHER_ID, "from teacher", userId, process.env.NEXT_PUBLIC_TEACHER_ID);
  return userId === process.env.NEXT_PUBLIC_TEACHER_ID;
};
