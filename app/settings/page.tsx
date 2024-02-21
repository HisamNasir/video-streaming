"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { FaFileUpload, FaSignOutAlt, FaSpinner } from "react-icons/fa";
import UploderBtn from "./ui/UploderBtn";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../util/firebase";

interface User {
  name: string;
  email: string;
  imageUrl?: string;
}

interface Video {
  id: string;
  videoName: string;
  videoDescription: string;
  thumbnailImageUrl: string;
  uploaderName: string;
}

const Settings: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [uploadedVideos, setUploadedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignOut = () => {
    sessionStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (user) {
      const fetchUploadedVideos = async () => {
        setLoading(true);
        const q = query(
          collection(firestore, "UploadedVideos"),
          where("uploaderEmail", "==", user.email)
        );

        try {
          const querySnapshot = await getDocs(q);
          const videos = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Video[];
          setUploadedVideos(videos);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching uploaded videos:", error);
          setError("Error fetching uploaded videos");
          setLoading(false);
        }
      };

      fetchUploadedVideos();
    }
  }, [user]);

  const truncateDescription = (text: string) => {
    const words = text.trim().split(/\s+/);
    if (words.length <= 40) {
      return text;
    }
    return words.slice(0, 40).join(" ") + "...";
  };

  return (
    <div className="h-full">
      {user ? (
        <div className="flex flex-col gap-4">
          <div className="flex max-sm:flex-col gap-4 sm:justify-between items-center">
            <div className="flex items-center gap-4 c">
              <Image
                width={100}
                height={100}
                src={user.imageUrl || "/profilepice.jpg"}
                alt="Profile"
                className="w-20 h-20 object-cover rounded-full"
              />
              <div>
                <div className=" font-semibold text-lg">{user.name}</div>
                <div className=" text-sm">{user.email}</div>
              </div>
            </div>
            <div>
              <Button
                color="primary"
                className="flex items-center"
                onClick={handleSignOut}
              >
                Sign Out <FaSignOutAlt />
              </Button>
            </div>
          </div>

          <div className="p-2 sm:p-4">
            <UploderBtn />
            <div className="space-y-2">
              <h1 className="text-xl font-semibold">Uploaded Videos</h1>
              <div className=" border border-opacity-20 border-white rounded-xl p-2 sm:p-4">
                <div className="space-y-2">
                  {loading ? (
                    <p className="flex text-center justify-center my-4 items-center gap-2">
                      <span className="flex items-center animate-spin">
                        <FaSpinner />
                      </span>{" "}
                      Please wait...
                    </p>
                  ) : error ? (
                    <div>Error: {error}</div>
                  ) : uploadedVideos.length > 0 ? (
                    <ul className="space-y-4">
                      {uploadedVideos.map((video) => (
                        <li key={video.id}>
                          <Link href={`/videos/${video.id}/`}>
                            <Card>
                              <div className="flex p-4">
                                <div className="h-[129px] w-[129px]  aspect-square object-cover">
                                  <Image
                                    src={video.thumbnailImageUrl}
                                    alt={video.videoName}
                                    width={200}
                                    height={200}
                                    className="h-full w-full object-cover rounded-lg"
                                  />
                                </div>
                                <div className="ml-3">
                                  <h2 className="text-xl font-semibold">
                                    {video.videoName}
                                  </h2>
                                  <p className="text-gray-500 mb-1">
                                    Description:{" "}
                                    {truncateDescription(
                                      video.videoDescription
                                    )}
                                  </p>
                                  <p className=" mb-1 text-lg">
                                    {video.uploaderName}
                                  </p>
                                </div>
                              </div>
                            </Card>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No uploaded videos found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full flex justify-center items-center">
          <Card className="  text-center max-w-80 p-4">
            <p className="text-slate-500">
              Login to access upload and other settings
            </p>
            <Link
              className=" bg-[#FF0000] tracking-wide text-xl p-4 m-2 rounded-2xl font-bold text-white"
              href={"/sign-in"}
            >
              Click Here to login
            </Link>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Settings;
