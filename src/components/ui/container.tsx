import React from "react";

const Container = ({ children }: { children: React.ReactNode }) => {
  return <section className="container mx-auto x-3 py-10 h-full">{children}</section>;
};

export default Container;
