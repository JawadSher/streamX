"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function SignInPage() {
  const { data: session, status } = useSession();

  console.log("SignInPage Status:", status, "Session:", session);

  if (session) {
    return (
      <div>
        Signed in as {session?.user?.email} <br />
        <button onClick={() => signOut({ callbackUrl: "/" })}>Sign out</button>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gray-800 flex flex-col justify-center items-center">
      <p>Not signed in (Status: {status})</p>
      <button
        onClick={async () => {
          const result = await signIn("credentials", {
            email: "john@gmail.com", 
            password: "Passwd@123", 
            redirect: false,
          });
          console.log("Credentials SignIn Result:", result);
        }}

        className="border-1 bg-blue-800 p-1 rounded-xl hover:bg-blue-500 cursor-pointer"
      >
        Sign in with Email/Password
      </button>
      <button
        onClick={async () => {
          const result = await signIn("google", { redirect: false });
          console.log("Google SignIn Result:", result);
        }}
        className="mt-5 border-1 bg-purple-800 p-1 rounded-xl hover:bg-purple-500 cursor-pointer"
      >
        Sign in with Google
      </button>
    </div>
  );
}
