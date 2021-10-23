import { render } from "@raycast/api";
import { useFetch } from "./api";
import { Task } from "./types";

import TaskList from "./components/TaskList";

function Tomorrow() {
  const path = "/tasks/tomorrow?overdue=true";
  const { data: tasks, isLoading: isLoadingTasks } = useFetch<Task[]>(path);

  const sections = [{ name: "Tomorrow", tasks: tasks || [] }];

  return <TaskList path={path} sections={sections} isLoading={isLoadingTasks} />;
}

render(<Tomorrow />);
