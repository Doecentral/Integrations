import { ActionPanel, Icon, List, ListItemProps, OpenInBrowserAction } from "@raycast/api";
import { addDays } from "date-fns";

import { Project, Task, ViewMode } from "../types";
import { useFetch } from "../api";
import { isRecurring, displayDueDate, getAPIDate } from "../utils";
import { priorities } from "../constants";

import { useTodoist } from "../TodoistProvider";

const schedules = [
  { name: "Today", amount: 0 },
  { name: "Tomorrow", amount: 1 },
];
interface TaskListItemProps {
  task: Task;
  mode: ViewMode;
}

export default function TaskListItem({ task, mode }: TaskListItemProps): JSX.Element {
  const { completeTask, deleteTask, updateTask } = useTodoist();
  const { data: projects } = useFetch<Project[]>("/projects");
  const additionalListItemProps: Partial<ListItemProps> & { keywords: string[] } = { keywords: [] };

  switch (mode) {
    case ViewMode.project:
      if (task.dates?.due_datetime) {
        additionalListItemProps.accessoryTitle = displayDueDate(task.dates.due_datetime);
      }
      break;
    case ViewMode.date:
      if (projects && projects.length > 0) {
        const project = projects.find((project) => project.id === task.ids.project_id);

        if (project) {
          additionalListItemProps.accessoryTitle = project.name;
          additionalListItemProps.keywords.push(project.name);
        }
      }
  }

  if (isRecurring(task)) {
    additionalListItemProps.accessoryIcon = Icon.ArrowClockwise;
  }

  const priority = priorities.find((p) => p.value === task.prio);

  if (priority) {
    //const icon = priority.value === 1 ? Icon.Circle : { source: Icon.Circle, tintColor: priority.color };
    additionalListItemProps.keywords.push(priority.searchKeyword);
    additionalListItemProps.keywords.push(task.eapp);
    //additionalListItemProps.icon = icon;
    additionalListItemProps.icon = "https://www.xn--dcentral-ktb.com/img/icons/" + task.eapp + ".png";
  }

  return (
    <List.Item
      id={String(task.ids.task_id)}
      title={task.content.title}
      subtitle={task.content.description}
      {...additionalListItemProps}
      actions={
        <ActionPanel>
          <OpenInBrowserAction url={task.url} />

          <ActionPanel.Item
            id="completeTask"
            title="Complete Task"
            icon={Icon.Checkmark}
            shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
            onAction={() => completeTask(task)}
          />

          <ActionPanel.Submenu
            icon={Icon.Calendar}
            title="Schedule..."
            shortcut={{ modifiers: ["cmd", "shift"], key: "s" }}
          >
            {schedules.map(({ name, amount }) => (
              <ActionPanel.Item
                key={name}
                id={name}
                title={name}
                shortcut={{ modifiers: ["cmd", "shift"], key: "s" }}
                onAction={() => updateTask(task, { due_date: getAPIDate(addDays(new Date(), amount)) })}
              />
            ))}
          </ActionPanel.Submenu>

          <ActionPanel.Item
            id="deleteTask"
            title="Delete Task"
            icon={Icon.Trash}
            shortcut={{ modifiers: ["cmd", "shift"], key: "x" }}
            onAction={() => deleteTask(task)}
          />
        </ActionPanel>
      }
    />
  );
}
