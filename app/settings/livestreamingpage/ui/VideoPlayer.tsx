"use client";
import React, { useEffect, useRef } from "react";

export const VideoPlayer = ({ user }) => {
  const ref = useRef();

  useEffect(() => {
    user.videoTrack.play(ref.current);
  }, []);

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
