"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { collection, doc, getDoc } from "firebase/firestore";
import { firestore } from "../../util/firebase";
import { FaPaperPlane, FaThumbsUp, FaUser } from "react-icons/fa6";
import { Button, Card, Input } from "@nextui-org/react";
interface Comment {
  text: string;
}
interface VideoData {
  videoURL: string;
  videoName: string;
  videoDescription: string;
  likesCount: number;
  uploaderName: string;
  comments: Comment[];
}
export default function VideoPage() {
  const params = useParams<{ "video.id": string }>();
  const videoId = params["video.id"];
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const videoDocRef = doc(
          collection(firestore, "UploadedVideos"),
          videoId
        );
        const videoDocSnap = await getDoc(videoDocRef);
        if (videoDocSnap.exists()) {
          const videoData = videoDocSnap.data() as VideoData;
          setVideoData(videoData);
          setComments(videoData.comments || []);
        } else {
          setError("Video document not found in Firestore");
        }
      } catch (error) {
        setError("Error fetching video details: " + (error as string));
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideoDetails();
    }
  }, [videoId]);

  const handleLike = () => {};

  const handlePostComment = () => {
    if (newComment.trim() !== "") {
      const updatedComments = [...comments, { text: newComment }];
      setComments(updatedComments);
      setNewComment("");
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div>
      <div className="mb-4">
        <ReactPlayer
          width="100%"
          height="100%"
          className="react-player"
          url={videoData?.videoURL}
          controls={true}
        />
      </div>
      <div className="flex justify-between">
        <p className=" text-xl font-semibold">{videoData?.videoName}</p>
        <Button onClick={handleLike}>
          <FaThumbsUp />
          {videoData?.likesCount}
        </Button>
      </div>
      <p className="flex gap-2 items-center">
        <FaUser />
        {videoData?.uploaderName}
      </p>
      <Card className="p-4 my-4">
        <span className=" font-bold">Description:</span>{" "}
        {videoData?.videoDescription}
      </Card>
      <h2 className=" text-lg font-semibold">Comments</h2>
      <ul>
        {comments.map((comment, index) => (
          <li key={index}>{comment.text}</li>
        ))}
      </ul>
      <div className="flex gap-2 my-2 items-center">
        <Input
          radius="full"
          size="sm"
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <Button radius="full" onClick={handlePostComment}>
          <FaPaperPlane />
        </Button>
      </div>
    </div>
  );
}
