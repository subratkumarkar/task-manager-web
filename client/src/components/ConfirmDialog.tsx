import "../ConfirmDialog.css";

export default function ConfirmDialog({ open, message, onCancel, onConfirm }) {
    if (!open) return null;

    return (
        <div className="confirm-backdrop">
            <div className="confirm-dialog">
                <p className="confirm-message">{message}</p>

                <div className="confirm-actions">
                    <button className="btn-cancel" onClick={onCancel}>
                        Cancel
                    </button>

                    <button className="btn-delete" onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
