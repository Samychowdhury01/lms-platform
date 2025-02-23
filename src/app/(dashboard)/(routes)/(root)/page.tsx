import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CourseList from "../search/_components/course-list";
import { CheckCircle, Clock } from "lucide-react";
import InfoCard from "./_components/info-card";

const DashBoardPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(
    userId
  );
  return (
    <main className="p-6 space-y-4 ">
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label={"In Progress"}
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label={"Completed"}
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </section>
      <CourseList items={[...coursesInProgress, ...completedCourses]} />
    </main>
  );
};

export default DashBoardPage;
