import { useEffect, useState } from "react";
import { api } from "../api/http";
import { useNavigate } from "react-router-dom";
import { ActivityRecord } from "../types/ActivityRecord";
import ShowMoreText from "../components/ShowMoreText";

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
                                <td>
                                    <ShowMoreText text={formatDate(act.activityTime)} maxChars={40} />
                                </td>
                                <td>{act.eventType}</td>
                                <td>
                                    <ShowMoreText text={act.title} maxChars={50} />
                                </td>
                                <td>
                                    <ShowMoreText text={act.description} maxChars={50} />
                                </td>
                                <td>{act.priority}</td>
                                <td>{act.status}</td>
                                <td>
                                    <ShowMoreText text={formatDate(act.dueDate)} maxChars={40} />
                                </td>
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

        </div>
    );
}
