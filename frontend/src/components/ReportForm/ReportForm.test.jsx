import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { vi } from "vitest";
import { MantineProvider } from "@mantine/core";
import { theme } from "../../theme";
import { ReportForm } from "./ReportForm";


vi.mock("@/services/fetch");
vi.mock("../../hooks/AuthProvider", () => ({
  useAuth: vi.fn(),
}));

describe("ReportForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ user: { id: "1" } });
  });

  test("renders correctly with initial state", async () => {
    fetchLockers.mockResolvedValue([]);
    render(
      <MantineProvider theme={theme}>
        <Router>
          <ReportForm />
        </Router>
      </MantineProvider>
    );
    expect(screen.getByText("Formulario de Incidencias")).toBeInTheDocument();
    await waitFor(() => expect(fetchLockers).toHaveBeenCalled());
  });

  test("loads lockers on mount", async () => {
    fetchLockers.mockResolvedValue([{ id: 1, description: "Locker 1" }]);
    render(
      <MantineProvider theme={theme}>
        <Router>
          <ReportForm />
        </Router>
      </MantineProvider>
    );
    await waitFor(() => {
      expect(fetchLockers).toHaveBeenCalled();
      expect(screen.getByText("Locker 1")).toBeInTheDocument();
    });
  });

  test("updates boxes when selecting a locker", async () => {
    fetchLockers.mockResolvedValue([{ id: 1, description: "Locker 1" }]);
    fetchBoxesByLocker.mockResolvedValue([{ id: 101, description: "Box 101" }]);
    
    render(
      <MantineProvider theme={theme}>
        <Router>
          <ReportForm />
        </Router>
      </MantineProvider>
    );
    await waitFor(() => expect(fetchLockers).toHaveBeenCalled());

    fireEvent.change(screen.getByLabelText("Armario"), { target: { value: "1" } });
    await waitFor(() => expect(fetchBoxesByLocker).toHaveBeenCalledWith("1"));
    expect(screen.getByText("Box 101")).toBeInTheDocument();
  });

  test("disables Casilla select if no locker is selected", () => {
    render(
      <MantineProvider theme={theme}>
        <Router>
          <ReportForm />
        </Router>
      </MantineProvider>
    );
    expect(screen.getByLabelText("Casilla")).toBeDisabled();
  });

  test("submits the form with valid data", async () => {
    fetchLockers.mockResolvedValue([{ id: 1, description: "Locker 1" }]);
    fetchBoxesByLocker.mockResolvedValue([{ id: 101, description: "Box 101" }]);
    fetchFormIncident.mockResolvedValue({});

    render(
      <MantineProvider theme={theme}>
        <Router>
          <ReportForm />
        </Router>
      </MantineProvider>
    );
    await waitFor(() => expect(fetchLockers).toHaveBeenCalled());
    fireEvent.change(screen.getByLabelText("Armario"), { target: { value: "1" } });
    await waitFor(() => expect(fetchBoxesByLocker).toHaveBeenCalled());
    fireEvent.change(screen.getByLabelText("Casilla"), { target: { value: "101" } });
    fireEvent.change(screen.getByLabelText("Descripción"), { target: { value: "Test description" } });
    
    fireEvent.click(screen.getByText("Enviar"));
    await waitFor(() => expect(fetchFormIncident).toHaveBeenCalledWith({
      content: "Test description",
      isSolved: false,
      userId: "1",
      boxId: "101",
    }));
  });

  test("shows an alert if required fields are missing", () => {
    vi.spyOn(window, "alert").mockImplementation(() => {});
    render(
      <MantineProvider theme={theme}>
        <Router>
          <ReportForm />
        </Router>
      </MantineProvider>
    );
    fireEvent.click(screen.getByText("Enviar"));
    expect(window.alert).toHaveBeenCalledWith("Por favor, complete todos los campos.");
  });
});
