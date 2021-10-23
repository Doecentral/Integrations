import { preferences, showToast, ToastStyle } from "@raycast/api";
import axios, { AxiosError } from "axios";
import useSWR from "swr";
import { TaskPayload } from "./types";

export const axiosInstance = axios.create({
  baseURL: "https://api.xn--dcentral-ktb.com",
  timeout: 2220,
  headers: { Authorization: `Bearer ${preferences.token.value}` },
});

export async function completeTask(id: number): Promise<void> {
  try {
    await axiosInstance.post(`/tasks/${id}/close`);
    showToast(ToastStyle.Success, "Task completed");
  } catch {
    showToast(ToastStyle.Failure, "Could not complete task");
  }
}

export async function updateTask(id: number, body: TaskPayload): Promise<void> {
  try {
    await axiosInstance.post(`tasks/${id}`, body);
    showToast(ToastStyle.Success, "Task updated");
  } catch {
    showToast(ToastStyle.Failure, "Could not update task");
  }
}

export async function deleteTask(id: number): Promise<void> {
  try {
    await axiosInstance.delete(`/tasks/${id}`);
    showToast(ToastStyle.Success, "Task deleted");
  } catch {
    showToast(ToastStyle.Failure, "Could not delete task");
  }
}

interface FetchResult<T> {
  data: T | undefined;
  isLoading: boolean;
}

const fetcher = (path: string) => axiosInstance.get(path).then((res) => res.data.data);

export function useFetch<T>(path: string): FetchResult<T> {
  const { data, error } = useSWR<T, AxiosError>(path, fetcher);

  return { data, isLoading: !error && !data };
}
