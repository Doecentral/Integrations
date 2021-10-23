import { List } from "@raycast/api";

import { SectionWithTasks, ViewMode } from "../types";

import TaskListItem from "./TaskListItem";
import { TodoistProvider } from "../TodoistProvider";

interface TaskListProps {
  sections: SectionWithTasks[];
  isLoading: boolean;
  mode?: ViewMode;
  path: string;
}

function TaskList({ isLoading, sections, path, mode = ViewMode.date }: TaskListProps): JSX.Element {
  sections.forEach((section) => {
    section.tasks.sort((a, b) => a.order - b.order);
  });

  const placeholder = `Filter tasks by name or priority (e.g p1)`;

  return (
    <TodoistProvider path={path}>
      <List searchBarPlaceholder={placeholder} isLoading={isLoading}>
        {sections.map((section, index) => (
          <List.Section title={section.name} subtitle={`${section.tasks.length} tasks`} key={index}>
            {section.tasks.map((task) => (
              <TaskListItem key={task.ids.task_id} task={task} mode={mode} />
            ))}
          </List.Section>
        ))}
      </List>
    </TodoistProvider>
  );
}

export default TaskList;
