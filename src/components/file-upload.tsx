"use client"
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import React from "react";
import toast from "react-hot-toast";

type TFilUploadProps = {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
};

const FileUpload = ({ onChange, endpoint }: TFilUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
        console.log(res?.[0], "res");
      }}
     onUploadError={(error: Error) => {
       console.log(error, 111111)
        toast.error(`Upload failed: ${error.message}`)
      }}
    />
  );
};

export default FileUpload;
