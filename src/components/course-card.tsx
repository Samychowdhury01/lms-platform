import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IconBadge } from "./ui/icon-badge";
import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";

type TCourseCardProps = {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress: number | null;
  category: string;
};

const CourseCard = ({
  category,
  chaptersLength,
  id,
  imageUrl,
  price,
  progress,
  title,
}: TCourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        {/* image container */}
        <div className="relative w-full aspect-video rounded-md overflow-hidden border">
          <Image fill className="object-cover" alt={title} src={imageUrl} />
        </div>
        {/* text container */}
        <div className="flex flex-col pt-2">
          <p className="text-lg  font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </p>
          <p className="text-xs text-muted-foreground">{category}</p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
          </div>
          {progress !== null ? (
            <div>TODO: add progress bar</div>
          ) : (
            <p className="md:text-sm font-medium text-slate-700">{formatPrice(price)}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
