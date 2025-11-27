import { useEffect, useState } from "react";
import { api } from "../api/http";
import "../styles.css";
import "../ConfirmDialog.css";
import { TaskStatus, TaskPriority } from "../types/TaskEnums";
import { TaskSearchRequest } from "../types/TaskSearchRequest";
import { Task } from "../types/Task";
import ShowMoreText from "../components/ShowMoreText";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../components/Toast";
import { PRIORITY_LABELS, STATUS_LABELS } from "../types/constants";


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
    const [filterPriority, setFilterPriority] = useState<TaskPriority | null>(null);
    const [filterFromDueDate, setFilterFromDueDate] = useState("");
    const [filterToDueDate, setFilterToDueDate] = useState("");
    const [filterReset, setFilterReset] = useState(0);


    // ----- Edit task -----
    const [editTask, setEditTask] = useState<Task | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDesc, setEditDesc] = useState("");
    const [editPriority, setEditPriority] =
        useState<TaskPriority>("MEDIUM");
    const [editStatus, setEditStatus] = useState<TaskStatus>("PENDING");
    const [editDueDate, setEditDueDate] = useState("");

    const hasNext = startIndex + limit < totalCount;
    const [createError, setCreateError] = useState("");

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const [editError, setEditError] = useState("");
    const [toastMsg, setToastMsg] = useState("");
    const [toastType, setToastType] = useState<"success" | "error">("success");


    function askDelete(task: Task) {
        setTaskToDelete(task);
        setConfirmOpen(true);
    }

    async function handleConfirmDelete() {
        if (!taskToDelete) return;

        try {
            await api.delete(`/tasks/${taskToDelete.id}`);
            setConfirmOpen(false);
            setTaskToDelete(null);
            showToast("Task deleted!", "success");
            loadTasks();
        } catch (err) {
            showToast(err.response?.data?.error || "Failed to delete task.", "error");
        }
    }

    function showToast(msg: string, type: "success" | "error" = "success") {
        setToastMsg(msg);
        setToastType(type);

        // Auto hide after 3 seconds
        setTimeout(() => setToastMsg(""), 3000);
    }

    function clearFilters() {
        setFilterTitle("");
        setFilterDesc("");
        setFilterPriority(null);
        setFilterStatus(null);
        setFilterFromDueDate("");
        setFilterToDueDate("");
        setStartIndex(0);
        setFilterReset(v => v + 1);
    }

    async function loadTasks() {
        setLoading(true);

        const request: TaskSearchRequest = {
            title: filterTitle || undefined,
            description: filterDesc || undefined,
            status: filterStatus || null,
            priority: filterPriority || null,
            fromDueDate: filterFromDueDate || null,
            toDueDate: filterToDueDate || null,
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
            showToast("Failed to load tasks.", "error");
        }
        setLoading(false);
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        loadTasks();
    }, [startIndex, sortBy, sortDirection, filterReset]);

    function handleSort(column: string) {
        if (sortBy === column) {
            setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
        } else {
            setSortBy(column);
            setSortDirection("ASC");
        }
    }

    function formatDate(dateString: string | null) {
        if (!dateString) return "";

        const date = new Date(dateString);

        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    }

    async function createTask() {
        setCreateError(""); // clear old errors

        if (!newTitle.trim()) {
            setCreateError("Title is required.");
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
            showToast("Task created successfully!");
            // reset form
            setNewTitle("");
            setNewDesc("");
            setNewPriority("MEDIUM");
            setNewStatus("PENDING");
            setNewDueDate("");
            setCreateError("");

            loadTasks();
        } catch (err) {
            showToast(err.response?.data?.error || "Failed to create task.", "error");
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
        setEditError("");
    }

    async function saveEdit() {
        if (!editTask) return;

        setEditError(""); // clear old errors

        // --- VALIDATION ---
        if (!editTitle.trim()) {
            setEditError("Title is required.");
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
            showToast("Task updated!", "success");
            loadTasks();
        } catch (err) {
            showToast(err.response?.data?.error || "Failed to update task.", "error");
        }
    }



    // ---- Helpers ----
    function isOverdue(task: Task): boolean {
        if (!task.dueDate) return false;
        try {
            const due = new Date(task.dueDate);
            const now = new Date();
            return due < now && task.status !== "COMPLETE";
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

        return <span className={cls}>{PRIORITY_LABELS[priority] || priority}</span>;
    }
    return (
        <div className="page-container full-width-page">
            <Toast message={toastMsg} type={toastType} />
            <h1>Tasks</h1>

            {/* --------------- Create Task Card --------------- */}
            <h3 style={{ marginTop: "28px", marginBottom: "12px" }}>Create Task</h3>
            <div className="create-task-container">
                {/* Row 1: title, priority, status, due date */}
                <div className="create-task-row two-row-grid">
                    <div className="field">
                        <label>Title</label>
                        <input
                            value={newTitle}
                            className="create-input"
                            placeholder="Task title"
                            maxLength={255}
                            onChange={(e) => setNewTitle(e.target.value)} />
                    </div>

                    <div className="field small-field">
                        <label>Priority</label>
                        <select className="create-select"
                            value={newPriority}
                            onChange={(e) =>
                                setNewPriority(e.target.value as TaskPriority)}>
                            {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="field small-field">
                        <label>Status</label>
                        <select className="create-select"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value as TaskStatus)}>
                            {Object.entries(STATUS_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
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
                {createError && (
                    <p style={{ color: "red", marginBottom: "6px", fontSize: "14px" }}>
                        {createError}
                    </p>
                )}
                {/* Row 2: description textarea + create button on the right */}
                <div className="create-task-row second-row">
                    <div className="field flex-grow">
                        <label>Description</label>
                        <textarea
                            value={newDesc}
                            maxLength={2000}
                            onChange={(e) => setNewDesc(e.target.value)}
                            placeholder="Describe the task..."
                            rows={2}
                            style={{ resize: "vertical" }}
                        />
                    </div>
                    <div className="field button-column">
                        <button onClick={createTask}>Create</button>
                    </div>
                </div>
            </div>

            {/* ---------- View Tasks ---------- */}
            <h3 style={{ marginTop: "28px", marginBottom: "12px" }}>Search Tasks</h3>
            {/* --------------- Filter --------------- */}
            <div className="filters-container">
                    <div className="filter-group">
                        <label>Title</label>
                        <input
                            type="text"
                            className="filter-input"
                            maxLength={255}
                            placeholder="Title contains..."
                            value={filterTitle}
                            onChange={(e) => setFilterTitle(e.target.value)}/>
                    </div>
                    <div className="filter-group">
                        <label>Description</label>
                        <input
                            type="text"
                            className="filter-input"
                            maxLength={2000}
                            placeholder="Description contains..."
                            value={filterDesc}
                            onChange={(e) => setFilterDesc(e.target.value)}/>
                    </div>
                    <div className="filter-group">
                        <label>Priority</label>
                        <select
                            className="filter-select"
                            value={filterPriority ?? ""}
                            onChange={(e) =>
                                setFilterPriority(
                                    e.target.value ? (e.target.value as TaskPriority) : null
                                )
                            }>
                            <option value="">All</option>
                            {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Status</label>
                        <select
                            className="filter-select"
                            value={filterStatus ?? ""}
                            onChange={(e) =>
                                setFilterStatus(
                                    e.target.value ? (e.target.value as TaskStatus) : null
                                )
                            }>
                            <option value="">All</option>
                            {Object.entries(STATUS_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Start Due Date</label>
                        <input
                            type="datetime-local"
                            className="filter-input filter-date"
                            value={filterFromDueDate}
                            onChange={(e) => setFilterFromDueDate(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <label>End Due Date</label>
                        <input
                            type="datetime-local"
                            className="filter-input filter-date"
                            value={filterToDueDate}
                            onChange={(e) => setFilterToDueDate(e.target.value)}
                        />
                    </div>
                    <div className="filter-group-buttons">
                        <div>
                             <button className="apply-button-column" onClick={() => loadTasks()}>Apply</button>
                        </div>

                        <div>
                        <button className="apply-button-column clear-filters-button" onClick={clearFilters}>
                            Clear Filters
                        </button>
                        </div>

                    </div>

                </div>
            {/* ---------------Existing Tasks --------------- */}
            {/* ---------- View Tasks ---------- */}
            <h3 style={{ marginTop: "28px", marginBottom: "12px" }}>Your Tasks</h3>
            <div className="table-scroll-container">
                <table className="task-table">
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
                            <th key={col.key} className="sortable-header" onClick={() => handleSort(col.key)}>
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
                                <td>
                                    <ShowMoreText text={task.title} maxChars={40} />
                                </td>
                                <td>{renderPriorityTag(task.priority)}</td>
                                <td>{STATUS_LABELS[task.status] || task.status}</td>
                                <td>
                                    <ShowMoreText text={task.description} maxChars={40} />
                                </td>
                                <td>{formatDate(task.dueDate)}</td>
                                <td>{formatDate(task.updatedAt)}</td>
                                <td>
                                    <div className="actions-wrapper">
                                        <button onClick={() => openEditModal(task)}>
                                            Edit
                                        </button>
                                        <button className="btn-danger" onClick={() => askDelete(task)}>
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
            <div className="pagination-links">
                <span
                    className={startIndex === 0 ? "disabled" : ""}
                    onClick={() => {
                        if (startIndex !== 0) {
                            setStartIndex(Math.max(startIndex - limit, 0));
                        }
                    }}
                >
                    ← Previous
                </span>

                    <span
                        className={!hasNext ? "disabled" : ""}
                        onClick={() => {
                            if (hasNext) {
                                setStartIndex(startIndex + limit);
                            }
                        }}
                    >
                    Next →
               </span>
            </div>
            <ConfirmDialog
                open={confirmOpen}
                message={`Are you sure you want to delete "${taskToDelete?.title}"?`}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
            />
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
                                    onChange={(e) => setEditTitle(e.target.value)}
                                />
                            </div>

                            <div className="field">
                                <label>Description</label>
                                <textarea
                                    rows={4}
                                    value={editDesc}
                                    onChange={(e) => setEditDesc(e.target.value)}
                                />
                            </div>

                            {/* ⭐ PRIORITY + STATUS in one row (reuses Create Task layout) */}
                            <div className="create-task-row two-row-grid">
                                <div className="field small-field">
                                    <label>Priority</label>
                                    <select
                                        className="create-select"
                                        value={editPriority}
                                        onChange={(e) =>
                                            setEditPriority(e.target.value as TaskPriority)
                                        }
                                    >
                                        {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="field small-field">
                                    <label>Status</label>
                                    <select
                                        className="create-select"
                                        value={editStatus}
                                        onChange={(e) =>
                                            setEditStatus(e.target.value as TaskStatus)
                                        }
                                    >
                                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* ⭐ Due date moved BELOW, consistent with Create Task */}
                            <div className="field small-field">
                                <label>Due Date</label>
                                <input
                                    type="datetime-local"
                                    value={editDueDate}
                                    onChange={(e) => setEditDueDate(e.target.value)}
                                />
                            </div>
                        </div>
                        {editError && (
                            <p className="error-text">{editError}</p>
                        )}
                        <div className="modal-footer" style={{ justifyContent: "center" }}>
                            <button className="btn-cancel" onClick={closeEditModal}>Cancel</button>
                            <button className="btn-primary" onClick={saveEdit}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
