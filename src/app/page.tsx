import { ScheduleTable } from "@/components/ScheduleTable/ScheduleTable";
import { Toolbar } from "@/components/Toolbar";
import { Button } from "@/components/ui/button";
import { UserDropdownMenu } from "@/components/UserDropdownMenu";
import { getSession } from "@/lib/auth/auth";
import { getTasksWithTimesByUserId } from "@/lib/db/task";
import { getTimesByUserId } from "@/lib/db/time";
import { prisma } from "@/lib/prisma";
import { PrismaTimeModified } from "@/lib/ts/interfaces";
import Link from "next/link";

export default async function Home() {
  const session = await getSession();

  // User not logged in
  if (session == null) {
    return (
      <div className="relative flex min-h-full flex-col items-center justify-center gap-6 py-10 [&>div]:not-first:w-[80%] print:[&>div]:w-full">
        <div className="absolute top-6 right-12 flex items-stretch space-x-4">
          <Button asChild>
            <Link href="/signup">Sign up</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/login">Log in</Link>
          </Button>
        </div>
        <div className="contents print:hidden">
          <Toolbar />
        </div>

        <ScheduleTable isGuestMode={true} />
      </div>
    );
  }

  const userId = session.user.id;
  const initialTasks = (await getTasksWithTimesByUserId(userId)) ?? [];
  let times = (await getTimesByUserId(userId)) ?? [];

  // The second condition make sure to not insert multiple default times if they already exist.
  if (times.length === 0) {
    times = (await prisma.time.createManyAndReturn({
      data: Array.from({ length: 8 }, (_, i) => ({
        hour: i + 8,
        minute: 0,
        userId: userId,
      })),
      // Add this because Github Actions throw duplication error when running playwright tests
      skipDuplicates: true,
    })) as PrismaTimeModified[];
  }

  return (
    <div className="relative flex min-h-full flex-col items-center justify-center gap-6 py-10 [&>div]:not-first:w-[80%] print:[&>div]:w-full">
      <UserDropdownMenu {...session.user} />

      <div className="contents print:hidden">
        <Toolbar />
      </div>

      <ScheduleTable serverTasks={initialTasks} serverTimes={times} />
    </div>
  );
}
