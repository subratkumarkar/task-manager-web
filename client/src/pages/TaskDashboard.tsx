import { useEffect, useState } from "react";
import { api } from "../api/http";
import "../styles.css";
import { TaskStatus, TaskPriority } from "../types/TaskEnums";
import { TaskSearchRequest } from "../types/TaskSearchRequest";
import { Task } from "../types/Task";


export default function TaskDashboard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    // Pagination
    const [limit] = useState(10);
    const [startIndex, setStartIndex] = useState(0);

    // Sorting
    const [sortBy, setSortBy] = useState("updatedAt");
    const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");

    // ----- Create Task -----
    const [newTitle, setNewTitle] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [newPriority, setNewPriority] = useState<TaskPriority>("MEDIUM");
    const [newStatus, setNewStatus] = useState<TaskStatus>("PENDING");
    const [newDueDate, setNewDueDate] = useState("");

    // ----- Search Task Filters -----
    const [filterTitle, setFilterTitle] = useState("");
    const [filterDesc, setFilterDesc] = useState("");
    const [filterStatus, setFilterStatus] = useState<TaskStatus | null>(null);
    const [filterPriority, setFilterPriority] =
        useState<TaskPriority | null>(null);
    const [fromUpdatedAt, setFromUpdatedAt] = useState("");
    const [toUpdatedAt, setToUpdatedAt] = useState("");

    // ----- Edit task -----
    const [editTask, setEditTask] = useState<Task | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDesc, setEditDesc] = useState("");
    const [editPriority, setEditPriority] =
        useState<TaskPriority>("MEDIUM");
    const [editStatus, setEditStatus] = useState<TaskStatus>("PENDING");
    const [editDueDate, setEditDueDate] = useState("");

    const hasNext = startIndex + limit < totalCount;

    async function loadTasks() {
        setLoading(true);

        const request: TaskSearchRequest = {
            title: filterTitle || undefined,
            description: filterDesc || undefined,
            status: filterStatus || null,
            priority: filterPriority || null,
            fromUpdatedAt: fromUpdatedAt || null,
            toUpdatedAt: toUpdatedAt || null,
            limit,
            startIndex,
            sortBy,
            sortDirection,
        };

        try {
            const res = await api.post("/tasks/search", request);
            setTasks(res.data.items || []);
            setTotalCount(res.data.totalCount ?? 0);
        } catch (err) {
            console.error("Error fetching tasks", err);
        }
        setLoading(false);
    }

    useEffect(() => {
        loadTasks();
    }, [startIndex, sortBy, sortDirection]);

    function handleSort(column: string) {
        if (sortBy === column) {
            setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
        } else {
            setSortBy(column);
            setSortDirection("ASC");
        }
    }

    async function createTask() {
        if (!newTitle.trim()) {
            alert("Title required");
            return;
        }

        try {
            await api.post("/tasks", {
                title: newTitle,
                description: newDesc,
                priority: newPriority,
                status: newStatus,
                dueDate: newDueDate ? newDueDate + ":00" : null,
            });
            setNewTitle("");
            setNewDesc("");
            setNewPriority("MEDIUM");
            setNewStatus("PENDING");
            setNewDueDate("");

            loadTasks();
        } catch (err) {
            alert("Failed to create task");
        }
    }

    // ---- Delete with confirm dialog ----
    async function handleDelete(task: Task) {
        const ok = window.confirm(
            `Are you sure you want to delete task "${task.title}"?`
        );
        if (!ok) return;

        try {
            await api.delete(`/tasks/${task.id}`);
            await loadTasks();
        } catch (err) {
            alert("Failed to delete task");
        }
    }

    // ---- Edit modal helpers ----
    function openEditModal(task: Task) {
        setEditTask(task);
        setEditTitle(task.title);
        setEditDesc(task.description || "");
        setEditPriority(task.priority);
        setEditStatus(task.status);
        // convert "2025-11-22T13:43:00" to "2025-11-22T13:43"
        if (task.dueDate) {
            const trimmed = task.dueDate.slice(0, 16);
            setEditDueDate(trimmed);
        } else {
            setEditDueDate("");
        }
    }

    function closeEditModal() {
        setEditTask(null);
    }

    async function saveEdit() {
        if (!editTask) {
            return;
        }
        try {
            await api.put("/tasks", {
                id: editTask.id,
                title: editTitle,
                description: editDesc,
                priority: editPriority,
                status: editStatus,
                dueDate: editDueDate ? editDueDate + ":00" : null,
            });
            closeEditModal();
            loadTasks();
        } catch (err) {
            alert("Failed to update task");
        }
    }

    // ---- Helpers ----
    function isOverdue(task: Task): boolean {
        if (!task.dueDate) return false;
        try {
            const due = new Date(task.dueDate);
            const now = new Date();
            return due < now && task.status !== "DONE";
        } catch {
            return false;
        }
    }

    function renderPriorityTag(priority: TaskPriority) {
        const cls =
            priority === "HIGH"
                ? "priority-tag priority-high"
                : priority === "MEDIUM"
                    ? "priority-tag priority-medium"
                    : "priority-tag priority-low";

        return <span className={cls}>{priority}</span>;
    }

    function shortDescription(desc: string) {
        if (!desc) return "";
        if (desc.length <= 60) return desc;
        return desc.slice(0, 60) + "…";
    }

    return (
        <div className="page-container full-width-page">
            <h1>Tasks</h1>

            {/* --------------- Create Task Card --------------- */}
            <div className="create-task-container">
                <h3>Create Task</h3>
                {/* Row 1: title, priority, status, due date */}
                <div className="create-task-row two-row-grid">
                    <div className="field">
                        <label>Title</label>
                        <input
                            value={newTitle}
                            placeholder="Task title"
                            onChange={(e) => setNewTitle(e.target.value)} />
                    </div>

                    <div className="field small-field">
                        <label>Priority</label>
                        <select
                            value={newPriority}
                            onChange={(e) =>
                                setNewPriority(e.target.value as TaskPriority)}>
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>

                    <div className="field small-field">
                        <label>Status</label>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value as TaskStatus)}>
                            <option value="PENDING">Pending</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="DONE">Done</option>
                        </select>
                    </div>

                    <div className="field small-field">
                        <label>Due Date</label>
                        <input
                            type="datetime-local"
                            value={newDueDate}
                            onChange={(e) => setNewDueDate(e.target.value)}/>
                    </div>
                </div>

                {/* Row 2: description textarea + create button on the right */}
                <div className="create-task-row second-row">
                    <div className="field flex-grow">
                        <label>Description</label>
                        <textarea
                            rows={3}
                            value={newDesc}
                            placeholder="Describe the task..."
                            onChange={(e) => setNewDesc(e.target.value)} />
                    </div>

                    <div className="field button-column">
                        <button onClick={createTask}>Create</button>
                    </div>
                </div>
            </div>

            {/* ---------- View Tasks ---------- */}
            <h3 style={{ marginTop: "28px", marginBottom: "12px" }}>View Tasks</h3>

            {/* --------------- Filter --------------- */}
            <div className="create-task-container">
                <h3>Filters</h3>

                <div className="create-task-row">
                    <input
                        placeholder="Title contains..."
                        value={filterTitle}
                        onChange={(e) => setFilterTitle(e.target.value)}/>

                    <input
                        placeholder="Description contains..."
                        value={filterDesc}
                        onChange={(e) => setFilterDesc(e.target.value)}/>

                    <select
                        value={filterPriority ?? ""}
                        onChange={(e) =>
                            setFilterPriority(
                                e.target.value ? (e.target.value as TaskPriority) : null
                            )
                        }>
                        <option value="">Priority (All)</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                    </select>

                    <select
                        value={filterStatus ?? ""}
                        onChange={(e) =>
                            setFilterStatus(
                                e.target.value ? (e.target.value as TaskStatus) : null
                            )
                        }>
                        <option value="">Status (All)</option>
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                    </select>

                    <input
                        type="datetime-local"
                        value={fromUpdatedAt}
                        onChange={(e) => setFromUpdatedAt(e.target.value)}/>
                    <input
                        type="datetime-local"
                        value={toUpdatedAt}
                        onChange={(e) => setToUpdatedAt(e.target.value)}/>
                    <button onClick={() => loadTasks()}>Apply</button>
                </div>
            </div>

            {/* ---------------Existing Tasks --------------- */}
            <div className="table-scroll-container">
                <table>
                    <thead>
                    <tr>
                        {[
                            { key: "title", label: "Title" },
                            { key: "priority", label: "Priority" },
                            { key: "status", label: "Status" },
                            { key: "description", label: "Description" },
                            { key: "dueDate", label: "Due Date" },
                            { key: "updatedAt", label: "Updated" },
                        ].map((col) => (
                            <th key={col.key} onClick={() => handleSort(col.key)}>
                                {col.label}{" "}
                                {sortBy === col.key &&
                                    (sortDirection === "ASC" ? "▲" : "▼")}
                            </th>
                        ))}
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {!loading &&
                        tasks.map((task) => (
                            <tr
                                key={task.id}
                                className={isOverdue(task) ? "row-overdue" : ""}>
                                <td>{task.title}</td>
                                <td>{renderPriorityTag(task.priority)}</td>
                                <td>{task.status}</td>
                                <td title={task.description}>{shortDescription(task.description)}</td>
                                <td>{task.dueDate}</td>
                                <td>{task.updatedAt}</td>
                                <td>
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        <button onClick={() => openEditModal(task)}>
                                            Edit
                                        </button>
                                        <button
                                            className="btn-danger"
                                            onClick={() => handleDelete(task)}>
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --------------- Pagination --------------- */}
            <div className="pagination">
                <button
                    disabled={startIndex === 0}
                    onClick={() => setStartIndex(Math.max(startIndex - limit, 0))}>
                    Previous
                </button>

                <button
                    disabled={!hasNext}
                    onClick={() => setStartIndex(startIndex + limit)}>
                    Next
                </button>
            </div>

            {/* --------------- Edit Task Modal --------------- */}
            {editTask && (
                <div className="modal-backdrop">
                    <div className="modal-card">
                        <h3>Edit Task</h3>

                        <div className="modal-body">
                            <div className="field">
                                <label>Title</label>
                                <input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}/>
                            </div>

                            <div className="field">
                                <label>Description</label>
                                <textarea
                                    rows={4}
                                    value={editDesc}
                                    onChange={(e) => setEditDesc(e.target.value)}/>
                            </div>

                            <div className="modal-row">
                                <div className="field">
                                    <label>Priority</label>
                                    <select
                                        value={editPriority}
                                        onChange={(e) =>
                                            setEditPriority(e.target.value as TaskPriority)}>
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                    </select>
                                </div>

                                <div className="field">
                                    <label>Status</label>
                                    <select
                                        value={editStatus}
                                        onChange={(e) =>
                                            setEditStatus(e.target.value as TaskStatus)}>
                                        <option value="PENDING">Pending</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="DONE">Done</option>
                                    </select>
                                </div>

                                <div className="field">
                                    <label>Due Date</label>
                                    <input
                                        type="datetime-local"
                                        value={editDueDate}
                                        onChange={(e) => setEditDueDate(e.target.value)}/>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button onClick={closeEditModal}>Cancel</button>
                            <button className="btn-primary" onClick={saveEdit}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
