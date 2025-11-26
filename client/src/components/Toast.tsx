export default function Toast({message, type,
                              }: {message: string; type: "success" | "error";
}) {
    if (!message) return null;
    return (
        <div className={`toast ${type}`}>
            {message}
        </div>
    );
}
