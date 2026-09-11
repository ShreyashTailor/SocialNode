import { SignUp } from "@clerk/nextjs";

export const metadata = {
  title: "Sign Up",
  description: "Sign up for SocialNode",
};

export default function Page() {
  return <SignUp />;
}
