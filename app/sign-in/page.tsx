"use client";
import React, { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "../util/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuth, getIdTokenResult } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Button, Card, Input } from "@nextui-org/react";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const res = await signInWithEmailAndPassword(email, password);
      console.log({ res });

      const userDocRef = doc(firestore, "users", email);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const userType = userData?.type || "Viewer";
        const { name, type, imageUrl } = userData || {};
        sessionStorage.setItem(
          "user",
          JSON.stringify({ email, name, type, imageUrl })
        );
      } else {
        console.error("User document not found in Firestore");
      }

      setEmail("");
      setPassword("");
      router.push("/");
    } catch (e) {
      console.error(e);
      setError("Wrong email or password");
    }
  };

  return (
    <div className="min-h-screen text-sm md:text-base flex items-center justify-center">
      <Card className=" p-5 md:p-10  flex flex-col gap-4 w-96">
        <h1 className=" text-2xl">Sign In</h1>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <Link href={"/sign-up"}>Create Account</Link>
        <Button
          className=" text-white text-lg"
          onClick={handleSignIn}
          color="primary"
        >
          Sign In
        </Button>
      </Card>
    </div>
  );
};

export default SignIn;
