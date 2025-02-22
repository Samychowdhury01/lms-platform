import { prisma } from "@/lib/prisma";
import React from "react";

const SearchPage = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return <section className="h-full p-6">hi</section>;
};

export default SearchPage;
