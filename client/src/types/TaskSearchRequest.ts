import {TaskPriority, TaskStatus} from "./TaskEnums";

export interface TaskSearchRequest {
    title?: string;
    description?: string;
    status?: TaskStatus | null;
    priority?: TaskPriority | null;

    fromDueDate?: string | null;
    toDueDate?: string | null;

    limit: number;
    startIndex: number;

    sortBy: string;
    sortDirection: "ASC" | "DESC";
}