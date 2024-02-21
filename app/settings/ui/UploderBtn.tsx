import { Button, ButtonGroup } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { FaFileUpload } from "react-icons/fa";
import { FaCamera } from "react-icons/fa6";

export default function UploderBtn() {
  return (
    <div className="my-8 flex items-center gap-4 justify-center ">
      <Link
        href={"/settings/uploadvideopage"}
        className=" p-4 rounded-2xl flex gap-2 items-center sm:text-xl bg-[#008000]  text-white shadow-lg"
      >
        <FaFileUpload />
        Upload
      </Link>
      <Link
        href={"/settings/livestreamingpage"}
        className=" p-4 rounded-2xl flex gap-2 items-center sm:text-xl bg-[#FF0000]  text-white shadow-lg"
      >
        Go Live <FaCamera />
      </Link>
    </div>
  );
}
