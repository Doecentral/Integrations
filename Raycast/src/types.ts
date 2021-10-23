import { ComponentElement } from "react";

export enum ViewMode {
  project,
  date,
}

export interface SectionWithTasks {
  name: string;
  order?: number;
  tasks: Task[];
}

export interface Project {
  favorite: boolean;
  inbox_project?: boolean;
  id: number;
  name: string;
  url: string;
}

export interface Section {
  id: number;
  name: string;
  order: number;
  project_id: number;
}

export interface Ids {
  task_id: number;
  parent_id: number;
  project_id: number;
}

export interface Dates {
  created_datetime?: string;
  update_datetime?: string;
  done_datetime?: string;
  due_datetime: string;
  recurring?: boolean;
}

export interface Content {
  title: string;
  description: string;
}

export interface Task {
  ids: Ids;
  dates: Dates;
  section_id?: number;
  content: Content;
  done: boolean;
  prio: number;
  url: string;
  eapp: string;
  order: 1;
}

export type TaskPayload = Partial<{
  title: string;
  description: string;
  project_id: number;
  prio: number;
  due_date: string;
}>;
