import { useState } from "react";

export default function ShowMoreText({ text, maxChars = 100 }) {
    const [expanded, setExpanded] = useState(false);

    if (!text) return null;

    const isLong = text.length > maxChars;
    const displayText = expanded ? text : text.substring(0, maxChars);

    return (
        <div className="show-more-container">
            <span>{displayText}</span>
            {isLong && (
                <span
                    className="show-more-toggle"
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? " Show less" : " ...Show more"}
                </span>
            )}
        </div>
    );
}
