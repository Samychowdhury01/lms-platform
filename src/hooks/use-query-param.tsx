"use client";
import { useEffect, useState } from "react";

export function useQueryParam(param: string) {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setValue(searchParams.get(param));
  }, [param]);

  return value;
}
