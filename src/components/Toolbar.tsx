import AddNewTaskButton from "./AddNewTaskButton";
import AddNewTimeButton from "./AddNewTimeButton";
import ThemeTogglerButton from "./ThemeTogglerButton";

export default function Toolbar() {
  return (
    <span className="bg-primary/15 flex space-x-1 rounded-full px-1.5 py-1">
      <AddNewTimeButton />
      <AddNewTaskButton />
      <ThemeTogglerButton className="rounded-full" />
    </span>
  );
}
