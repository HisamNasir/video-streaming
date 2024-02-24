"use client";
import React, { useEffect, useRef } from "react";
interface Props {
  user: any; // Adjust the type of user as per your application
}

export const VideoPlayer: React.FC<Props> = ({ user }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && user.videoTrack) {
      user.videoTrack.play(ref.current);
    }
  }, [user.videoTrack]);

  return (
    <div>
      Uid: {user.uid}
      <div
        ref={ref}
        className="h-full w-full"
        style={{ width: "1280px", height: "720px" }}
      ></div>
    </div>
  );
};
