"use client";
import React, { useState, useRef } from "react";
import { Button, Card, Input, Textarea } from "@nextui-org/react";
import {
  addDoc,
  collection,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { storage, firestore } from "../../util/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const LiveStreamingPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [videoDocId, setVideoDocId] = useState<string>("");
  const [recorder, setRecorder] = useState<any>(null);
  const [recordedChunks, setRecordedChunks] = useState<any[]>([]);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const startStreaming = async () => {
    if (!title || !description) {
      alert("Please enter title and description");
      return;
    }
    const userData = JSON.parse(sessionStorage.getItem("user") ?? "{}");
    if (!userData || !userData.name || !userData.email) {
      alert("User data not found. Please log in again.");
      return;
    }
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      setIsLive(true);

      const uploadedVideosRef = collection(firestore, "UploadedVideos");
      const newVideoDocRef = await addDoc(uploadedVideosRef, {
        videoName: title,
        videoDescription: description,
        uploaderName: userData.name,
        uploaderEmail: userData.email,
        videoURL: "",
        thumbnailImageUrl: "",
        uploadedDate: serverTimestamp(),
        likesCount: 0,
        comments: [],
      });
      console.log("Document written with ID: ", newVideoDocRef.id);
      setVideoDocId(newVideoDocRef.id);
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };
  const stopStreaming = async () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsLive(false);

      try {
        await deleteDoc(
          doc(collection(firestore, "UploadedVideos"), videoDocId)
        );
        console.log("Document deleted successfully");
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Live Streaming Page</h1>
      {!isLive && (
        <>
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
        </>
      )}
      <Card className="p-4">
        <video
          ref={videoRef}
          autoPlay
          muted
          style={{ width: "auto", height: "70%" }}
        ></video>
        {isLive && (
          <>
            <p className="text-lg font-bold mt-2"> {title}</p>
            <p className="text-lg mt-2"> {description}</p>
          </>
        )}
      </Card>
      <div className="flex justify-end">
        {isLive ? (
          <Button
            color="primary"
            className="animate-pulse"
            onClick={stopStreaming}
          >
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
