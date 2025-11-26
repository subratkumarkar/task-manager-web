import { render, screen, fireEvent } from "@testing-library/react";
import TaskDashboard from "@/pages/TaskDashboard";
import { vi } from "vitest";

vi.mock("@/api/http", () => ({
    api: {
        post: vi.fn().mockResolvedValue({
            data: {
                items: [
                    {
                        id: 1,
                        title: "Test Task",
                        description: "Sample",
                        priority: "MEDIUM",
                        status: "PENDING",
                        dueDate: null,
                        updatedAt: null,
                    },
                ],
                totalCount: 1,
            },
        }),
        delete: vi.fn().mockResolvedValue({}),
    },
}));

describe("TaskDashboard - Delete Task Flow", () => {
    test("opens confirm dialog and deletes a task", async () => {
        render(<TaskDashboard />);

        // Trigger loadTasks() manually by clicking Apply
        const applyBtn = screen.getByText("Apply");
        fireEvent.click(applyBtn);

        // Wait for loaded task
        await screen.findByText((text) => text.includes("Test Task"));

        // Click DELETE in table row
        const deleteBtnRow = screen.getAllByText("Delete")[0];
        fireEvent.click(deleteBtnRow);

        // Confirm dialog delete button
        const confirmDialogBtn = await screen.findByRole("button", {
            name: (_name, element) => element.classList.contains("btn-delete"),
        });

        fireEvent.click(confirmDialogBtn);

        const { api } = await import("@/api/http");
        expect(api.delete).toHaveBeenCalledWith("/tasks/1");
    });
});
