"use client";
import React, { useEffect, useState } from "react";
import AgoraRTC, { IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import { VideoPlayer } from "./VideoPlayer";

const APP_ID = "541313c8238a4403b8e2cab4d6f877e9";
const TOKEN =
  "007eJxTYPj1RUDnnan/y7LKxwmzQuvc1xx98CXOvORKzJ13/I97IlgVGExNDI0NjZMtjIwtEk1MDIyTLFKNkhOTTFLM0izMzVMtF7DfTG0IZGSYd/0YEyMDBIL4PAzBJUWpibmZeemOBQUMDAALQCTU";
const CHANNEL = "StreamingApp";

const client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});

export const VideoRoom = () => {
  const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [localTracks, setLocalTracks] = useState<any[]>([]);
  const [joined, setJoined] = useState(false);
  const [isStreamer, setIsStreamer] = useState(false);

  useEffect(() => {
    let cleanupFunction: (() => void) | undefined;

    if (!joined) {
      client.on("user-published", handleUserJoined);
      client.on("user-left", handleUserLeft);

      client
        .join(APP_ID, CHANNEL, TOKEN, null)
        .then((uid) =>
          Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(), uid])
        )
        .then(([tracks, uid]) => {
          const [audioTrack, videoTrack] = tracks;
          setLocalTracks(tracks);
          setUsers((previousUsers) => [
            ...previousUsers,
            {
              uid,
              videoTrack,
              audioTrack,
            },
          ]);
          client.publish(tracks);
          setIsStreamer(true);
          setJoined(true);
        })
        .catch((error) => {
          console.error("Error joining channel:", error);
          if (cleanupFunction) {
            cleanupFunction();
          }
        });
    }

    return () => {
      if (!joined) {
        if (cleanupFunction) {
          cleanupFunction();
        }
        return;
      }

      for (let localTrack of localTracks) {
        localTrack.stop();
        localTrack.close();
      }
      client.off("user-published", handleUserJoined);
      client.off("user-left", handleUserLeft);

      client
        .unpublish(localTracks)
        .then(() => client.leave())
        .catch((error) => {
          console.error("Error leaving channel:", error);
        });
    };
  }, [joined]);

  const handleUserJoined = async (
    user: IAgoraRTCRemoteUser,
    mediaType: string
  ) => {
    await client.subscribe(user, mediaType);

    if (mediaType === "video") {
      setUsers((previousUsers) => [...previousUsers, user]);
    }

    if (mediaType === "audio") {
      // user.audioTrack.play()
    }
  };

  const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
    setUsers((previousUsers) =>
      previousUsers.filter((u) => u.uid !== user.uid)
    );
  };

  return (
    <div>
      <div className="grid grid-cols-1">
        <p className=" fixed bottom-4 right-4 z-10  ">
          Viewers: {users.length}
        </p>
        {users.map((user, index) => (
          <VideoPlayer key={user.uid} user={user} />
        ))}
      </div>
    </div>
  );
};
