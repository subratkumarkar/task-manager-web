import { useEffect, useState } from "react";
import { api } from "../api/http";
import { useNavigate } from "react-router-dom";
import { ActivityRecord } from "../types/ActivityRecord";

interface ActivitySearchResponse {
    items: ActivityRecord[];
    totalCount: number;
}

export default function UserActivityPage() {
    const navigate = useNavigate();
    const [activities, setActivities] = useState<ActivityRecord[]>([]);
    const [startIndex, setStartIndex] = useState(0);
    const [limit] = useState(10);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const hasNext = startIndex + limit < totalCount;

    //Show User Activities
    async function loadActivities() {
        setLoading(true);

        try {
            const response = await api.get<ActivitySearchResponse>(
                `/users/activities`,
                {
                    params: {
                        limit,
                        startIndex,
                    },
                }
            );
            setActivities(response.data.items || []);
            setTotalCount(response.data.totalCount || 0);
        } catch (err) {
            console.error("Failed to load activity log", err);
        }
        setLoading(false);
    }

    useEffect(() => {
        loadActivities();
    }, [startIndex]);

    return (
        <div className="page-container full-width-page">
            <h1>User Activity Log</h1>
            <button
                className="back-btn"
                onClick={() => navigate("/tasks")}
                style={{ marginBottom: "15px" }}>
                ← Back to Tasks
            </button>

            {/* -------------------- Activity Details -------------------- */}
            <div className="table-scroll-container" style={{ marginTop: "18px" }}>
                <table>
                    <thead>
                    <tr>
                        <th>Time</th>
                        <th>Task ID</th>
                        <th>Event</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Due Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {!loading &&
                        activities.map((act, idx) => (
                            <tr key={idx}>
                                <td>{act.activityTime}</td>
                                <td>{act.taskId}</td>
                                <td>{act.eventType}</td>
                                <td>{act.title}</td>
                                <td title={act.description}>
                                    {act.description?.length > 60
                                        ? act.description.slice(0, 60) + "…"
                                        : act.description}
                                </td>
                                <td>{act.priority}</td>
                                <td>{act.status}</td>
                                <td>{act.dueDate}</td>
                            </tr>
                        ))}

                    {loading && (
                        <tr>
                            <td colSpan={8} style={{ textAlign: "center" }}>
                                Loading...
                            </td>
                        </tr>
                    )}

                    {!loading && activities.length === 0 && (
                        <tr>
                            <td colSpan={8} style={{ textAlign: "center", padding: "20px" }}>
                                No activity found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* -------------------- Pagination -------------------- */}
            <div className="pagination">
                <button
                    disabled={startIndex === 0}
                    onClick={() => setStartIndex(Math.max(0, startIndex - limit))}>
                    Previous
                </button>
                <button
                    disabled={!hasNext}
                    onClick={() => setStartIndex(startIndex + limit)}>
                    Next
                </button>
            </div>
        </div>
    );
}
