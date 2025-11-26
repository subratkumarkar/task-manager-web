import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TaskDashboard from "@/pages/TaskDashboard";
import { vi } from "vitest";

// ---- API MOCK ----
vi.mock("@/api/http", () => {
    return {
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
    };
});

describe("TaskDashboard - Delete Task Flow", () => {
    test("opens confirm dialog and deletes a task", async () => {
        render(<TaskDashboard />);

        // Wait for mocked task to load
        await waitFor(() => {
            expect(screen.getByText("Test Task")).toBeInTheDocument();
        });

        // Click DELETE in table row
        const deleteBtnRow = screen.getAllByText("Delete")[0]; // <-- selects row button
        fireEvent.click(deleteBtnRow);

        // Select ONLY the modal delete button by class
        const confirmDialogBtn = await screen.findByRole("button", {
            name: (_name, element) => element.classList.contains("btn-delete"),
        });

        expect(confirmDialogBtn).toBeInTheDocument();

        // Click confirm
        fireEvent.click(confirmDialogBtn);

        // Verify API call
        const { api } = await import("@/api/http");
        expect(api.delete).toHaveBeenCalledWith("/tasks/1");
    });
});
