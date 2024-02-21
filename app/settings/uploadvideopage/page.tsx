"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { storage, firestore } from "../../util/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { Button, Card, Input, Textarea } from "@nextui-org/react";
const VideoUpload: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [video, setVideo] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [thumbnailName, setThumbnailName] =
    useState<string>("Select a thumbnail");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type === "video/x-matroska") {
      setErrorMessage(
        "This video format (.MKV) is not supported. Please choose .MP4 video."
      );
      setVideo(null);
    } else {
      setErrorMessage(null);
      setVideo(file ?? null);
    }
  };
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setThumbnailName(file.name);
    }
  };
  const handleUpload = async () => {
    try {
      setUploading(true);
      if (!video || !thumbnail) {
        setErrorMessage("Please select a video and a thumbnail.");
        return;
      }
      const videoRef = ref(storage, `videos/${video.name}`);
      const videoUploadTask = uploadBytesResumable(videoRef, video);
      videoUploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Error uploading video:", error);
          setUploading(false);
        },
        () => {
          getDownloadURL(videoRef).then((videoUrl) => {
            const thumbnailRef = ref(storage, `thumbnails/${thumbnail.name}`);
            uploadBytesResumable(thumbnailRef, thumbnail).then(() => {
              getDownloadURL(thumbnailRef).then((thumbnailUrl) => {
                const user = JSON.parse(sessionStorage.getItem("user") || "{}");
                const uploadedVideosRef = collection(
                  firestore,
                  "UploadedVideos"
                );
                addDoc(uploadedVideosRef, {
                  videoId: "",
                  videoName: title,
                  videoDescription: description,
                  videoURL: videoUrl,
                  thumbnailImageUrl: thumbnailUrl,
                  uploadedDate: new Date().toISOString(),
                  uploaderName: user.name,
                  uploaderEmail: user.email,
                  likesCount: 0,
                  comments: [],
                }).then((newVideoDoc) => {
                  setDoc(
                    doc(uploadedVideosRef, newVideoDoc.id),
                    { videoId: newVideoDoc.id },
                    { merge: true }
                  ).then(() => {
                    setUploading(false);
                    router.push("/");
                  });
                });
              });
            });
          });
        }
      );
    } catch (error) {
      console.error("Error uploading video:", error);
      setUploading(false);
    }
  };
  return (
    <div>
      <Card className="max-w-lg mx-auto p-6 rounded-md ">
        <h1 className="text-2xl font-semibold mb-4">Upload Video</h1>
        <div className="mb-4">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Video Title"
            className=" w-full p-2 rounded-md"
          />
        </div>
        <div className="mb-4">
          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your description"
            className=" w-full p-2 rounded-md"
          />
        </div>
        <Card className="mb-4 p-2">
          <input
            type="file"
            onChange={handleVideoChange}
            className="hidden"
            id="videoInput"
            accept="video/*"
          />
          <label
            htmlFor="videoInput"
            className=" w-full p-2 rounded-md cursor-pointer"
          >
            {video ? video.name : "Select a video"}
          </label>
        </Card>
        <Card className="mb-4 p-2">
          <input
            type="file"
            onChange={handleThumbnailChange}
            className="hidden"
            id="thumbnailInput"
            accept="image/*"
          />
          <label
            htmlFor="thumbnailInput"
            className=" w-full p-2 rounded-md cursor-pointer"
          >
            {thumbnailName}
          </label>
        </Card>
        {uploading && (
          <div className="mb-4">
            <progress
              value={uploadProgress}
              max="100"
              className="w-full"
            ></progress>
            <p className="text-sm rounded-3xl text-gray-500 mt-1">
              Uploading: {uploadProgress.toFixed(2)}%
            </p>
          </div>
        )}
        <Button
          onClick={handleUpload}
          disabled={uploading === true || errorMessage != null}
          color="primary"
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </Card>
    </div>
  );
};

export default VideoUpload;
