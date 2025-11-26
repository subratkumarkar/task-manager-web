import { render, screen, fireEvent } from "@testing-library/react";
import TaskDashboard from "@/pages/TaskDashboard";
import { vi } from "vitest";

const mockPost = vi.fn().mockResolvedValue({
    data: { items: [], totalCount: 0 }
});

vi.mock("@/api/http", () => ({
    api: {
        post: (...args: any[]) => mockPost(...args),
        delete: vi.fn()
    },
}));

test("filter title box accepts input", () => {
    render(<TaskDashboard />);
    const input = screen.getByPlaceholderText("Title contains...");
    fireEvent.change(input, { target: { value: "test" } });
    expect(input).toHaveValue("test");
});

test("clicking Apply triggers API search", () => {
    render(<TaskDashboard />);
    fireEvent.click(screen.getByText("Apply"));
    expect(mockPost).toHaveBeenCalled();
});
