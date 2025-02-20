// "use client";
// import dynamic from "next/dynamic";
// import { useMemo } from "react";
// import "react-quill/dist/quill.snow.css";

// interface EditorProps {
//   value: string | undefined;
//   onChange: (value: string) => void;
// }
// const Editor = ({ value="", onChange }: EditorProps) => {
//   const ReactQuill = useMemo(
//     () => dynamic(() => import("react-quill"), { ssr: false }),
//     []
//   );
//   return (
//     <div className="bg-white">
//       <ReactQuill theme="snow" value={value} onChange={onChange} />
//     </div>
//   );
// };

// export default Editor;

"use client";
import { Loader } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "react-quill-new/dist/quill.snow.css";

interface EditorProps {
  value?: string;
  onChange: (value: string) => void;
}

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const Editor = ({ value = "", onChange }: EditorProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Loader className="size-5 animate-spin" />;
  }

  return (
    <div className="bg-white">
      <ReactQuill theme="snow" value={value} onChange={onChange} />
    </div>
  );
};

export default Editor;
