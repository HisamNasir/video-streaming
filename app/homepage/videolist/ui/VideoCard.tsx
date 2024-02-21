"use client";
import { Card } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
interface Video {
  id: string;
  thumbnailImageUrl: string;
  videoName: string;
  uploaderName: string;
}
interface VideoCardProps {
  video: Video;
}
const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const [imageLoading, setImageLoading] = useState(true);
  return (
    <Link href={`/videos/${video.id}`}>
      <Card className=" p-2 rounded-md shadow-md">
        <Image
          width={300}
          height={300}
          src={video.thumbnailImageUrl}
          alt={video.videoName}
          className="w-full aspect-square  object-cover mb-4 rounded-md "
          onLoad={() => setImageLoading(false)}
        />
        <h2 className="text-xl font-semibold">{video.videoName}</h2>
        <p className="text-gray-500">Uploaded by: {video.uploaderName}</p>
      </Card>
    </Link>
  );
};

export default VideoCard;
