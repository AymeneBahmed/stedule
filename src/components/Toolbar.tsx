import AddNewTaskButton from "./AddNewTaskButton";
import AddNewTimeButton from "./AddNewTimeButton";
import ThemeTogglerButton from "./ThemeTogglerButton";

export default function Toolbar() {
  return (
    <span className="bg-primary/50 space-x-1 rounded-full">
      <AddNewTimeButton />
      <AddNewTaskButton />
      <ThemeTogglerButton className="rounded-full" />
    </span>
  );
}
