import AddNewTaskButton from "./AddNewTaskButton";
import AddNewTimeButton from "./AddNewTimeButton";
import ClearScheduleButton from "./ClearScheduleButton";
import ThemeTogglerButton from "./ThemeTogglerButton";

export default function Toolbar() {
  return (
    <span className="bg-primary/15 sticky top-10 z-[9999999] flex space-x-2 rounded-full px-1.5 py-1">
      <AddNewTimeButton />
      <AddNewTaskButton />
      <ThemeTogglerButton className="rounded-full" />
      <ClearScheduleButton className="rounded-full" variant="destructive" />
    </span>
  );
}
