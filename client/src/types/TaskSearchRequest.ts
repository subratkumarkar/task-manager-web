import {TaskPriority, TaskStatus} from "./TaskEnums";

export interface TaskSearchRequest {
    title?: string;
    description?: string;
    status?: TaskStatus | null;
    priority?: TaskPriority | null;

    fromUpdatedAt?: string | null;
    toUpdatedAt?: string | null;

    limit: number;
    startIndex: number;

    sortBy: string;
    sortDirection: "ASC" | "DESC";
}