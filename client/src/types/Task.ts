import {TaskPriority, TaskStatus} from "./TaskEnums";

export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
    updatedAt: string;
}