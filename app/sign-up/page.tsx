"use client";
import React, { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { app, auth, firestore } from "../util/firebase";
import Link from "next/link";
import { setDoc, doc } from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
} from "firebase/storage";
import { Button, Card, Input } from "@nextui-org/react";
const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);
  const storage = getStorage(app);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onload = function (e) {
        const target = e.target as FileReader;
        const img = document.getElementById("profile-img") as HTMLImageElement;
        img.src = target.result as string;
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSignUp = async () => {
    try {
      const res = await createUserWithEmailAndPassword(email, password);
      let imageUrl = "";
      if (profilePicture) {
        const storageRef = ref(storage, `users/profilepictures/${email}`);
        await uploadBytesResumable(storageRef, profilePicture);
        imageUrl = await getDownloadURL(storageRef);
      }
      await setDoc(doc(firestore, "users", email), {
        name: name,
        email: email,
        type: "viewer",
        imageUrl: imageUrl,
      });
      sessionStorage.setItem("user", JSON.stringify({ email, name }));
      setName("");
      setEmail("");
      setPassword("");
      setProfilePicture(null);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="min-h-screen text-sm md:text-base flex items-center justify-center">
      <Card className=" p-5 md:p-10 rounded-lg shadow-xl w-96">
        <h1 className=" text-2xl mb-5">Sign Up</h1>
        <div className="relative mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 w-full h-full"
          />
          <button className="w-full h-full rounded outline-none">
            <img
              id="profile-img"
              src="/profilepic.jpg"
              alt="Profile"
              className="w-full dark:invert h-full aspect-square object-cover rounded"
            />
          </button>
        </div>
        <div className="flex flex-col gap-4 mb-5">
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
        </div>
        <Link href={"/sign-in"} className="w-full mb-4">
          Sign In
        </Link>
        <Button
          className=" text-white text-lg"
          color="primary"
          onClick={handleSignUp}
        >
          Sign Up
        </Button>
      </Card>
    </div>
  );
};

export default SignUp;
