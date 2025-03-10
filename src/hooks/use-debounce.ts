"use client"
import React, { useEffect } from "react";

const useDebounce = <T>(value: T, delay?: number) => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay || 500);

    return ()=>{
        clearTimeout(timer);
    }
  }, [value, delay]);
  return debouncedValue;
};

export default useDebounce;
