import { render, screen, fireEvent } from "@testing-library/react";
import TaskDashboard from "@/pages/TaskDashboard";
import { vi } from "vitest";

const mockPost = vi.fn().mockResolvedValue({ data: { items: [], totalCount: 0 } });

vi.mock("@/api/http", () => ({
    api: {
        post: (...args: any[]) => mockPost(...args),
        delete: vi.fn()
    }
}));

test("shows validation error for empty title", () => {
    render(<TaskDashboard />);
    fireEvent.click(screen.getAllByText("Create")[0]);
    expect(screen.getByText("Title is required.")).toBeInTheDocument();
});

test("typing works in title input", () => {
    render(<TaskDashboard />);
    const input = screen.getByPlaceholderText("Task title");
    fireEvent.change(input, { target: { value: "Hello" } });
    expect(input).toHaveValue("Hello");
});

test("submits create task with valid data", () => {
    render(<TaskDashboard />);

    fireEvent.change(screen.getByPlaceholderText("Task title"), {
        target: { value: "My Task" },
    });

    fireEvent.click(screen.getAllByText("Create")[0]);

    expect(mockPost).toHaveBeenCalled();
});
