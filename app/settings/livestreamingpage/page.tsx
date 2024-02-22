"use client";
import { Button, Input, Textarea } from "@nextui-org/react";
import React, { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

const LiveStreamingPage = () => {
  const videoRef = useRef(null);
  const [streamId, setStreamId] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const startStreaming = async () => {
    if (!title || !description) {
      alert("Please enter title and description");
      return;
    }

    // Generate a unique stream ID using UUID
    const newStreamId = uuidv4();
    setStreamId(newStreamId);

    // Set up local video stream using getUserMedia
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true, // Enable audio if needed
      });
      setLocalStream(mediaStream);
      videoRef.current.srcObject = mediaStream;
      setIsLive(true);
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const stopStreaming = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
      setIsLive(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Live Streaming Page</h1>
      <Input
        placeholder="Video Title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        placeholder="Video Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div>
        <video ref={videoRef} autoPlay muted style={{ width: "100%" }}></video>
        {isLive && <p>Stream ID: {streamId}</p>}
      </div>
      <div className="flex justify-end">
        {isLive ? (
          <Button color="primary" onClick={stopStreaming}>
            Stop Streaming
          </Button>
        ) : (
          <Button color="primary" onClick={startStreaming}>
            Start Streaming
          </Button>
        )}
      </div>
    </div>
  );
};

export default LiveStreamingPage;
