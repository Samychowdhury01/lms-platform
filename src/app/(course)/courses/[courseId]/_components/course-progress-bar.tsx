"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface CourseProgressBarProps {
  value: number;
  variant?: "default" | "success";
  size?: "default"| "sm"  ;
}


const colorByVariant = {
    default : "text-sky-700",
    success: "text-emerald-700"
}

const sizeByVariant = {
    default : "text-sm",
    sm: "text-xs"
}


const CourseProgressBar = ({
  size,
  value,
  variant,
}: CourseProgressBarProps) => {
    console.log(value)
  return <div>
    <Progress
    className="h-2"
    value={value}
    variant={variant}
    />
    <p className={cn(
     "font-medium mt-2 text-sky-700",
     colorByVariant[variant || "default"],   
     sizeByVariant[size || "default"],   
    )}>{Math.round(value)}% Complete</p>
  </div>;
};

export default CourseProgressBar;
