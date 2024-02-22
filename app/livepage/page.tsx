"use client";
import React, { useState, useRef } from "react";

const Live = () => {
  const videoRef = useRef(null);
  const [streamId, setStreamId] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const handleStreamIdChange = (e) => {
    setStreamId(e.target.value);
  };

  const handleWatchStream = async () => {
    // Use the entered stream ID to fetch the live stream
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true, // Enable audio if needed
      });
      videoRef.current.srcObject = mediaStream;
      setIsStreaming(true);
    } catch (error) {
      console.error("Error accessing the live stream:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Watch Live Stream</h1>
      <div className="flex items-center">
        <input
          type="text"
          value={streamId}
          onChange={handleStreamIdChange}
          placeholder="Enter Stream ID"
          className="mr-2 p-2 border rounded"
        />
        <button onClick={handleWatchStream} className="btn-primary">
          Watch Stream
        </button>
      </div>
      <div>
        <video
          ref={videoRef}
          autoPlay
          muted={!isStreaming} // Mute the video if not streaming
          style={{ width: "100%" }}
        ></video>
      </div>
    </div>
  );
};

export default Live;
