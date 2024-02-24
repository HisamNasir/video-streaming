"use client";
import { useState } from "react";
import { VideoRoom } from "./ui/VideoRoom"; // Ensure this path is correct
import { Button } from "@nextui-org/react";
import { FaCamera } from "react-icons/fa6";

export default function Home() {
  const [joined, setJoined] = useState(false);
  return (
    <div>
      {!joined && (
        <div>
          <Button
            size="lg"
            className="flex flex-col gap-4 h-auto p-4"
            onClick={() => setJoined(true)}
          >
            <FaCamera className=" text-red-500 text-2xl" />
            Join Room
          </Button>
        </div>
      )}
      {joined && <VideoRoom />}
    </div>
  );
}
