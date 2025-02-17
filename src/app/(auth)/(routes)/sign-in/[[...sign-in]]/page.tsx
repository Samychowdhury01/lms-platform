import Container from "@/components/ui/container";
import { SignIn } from "@clerk/nextjs";
import React from "react";

const SignInPage = () => {
  return (
    <main>
      <SignIn />
    </main>
  );
};

export default SignInPage;
