import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReportsBox } from './ReportsBox';
import { MantineProvider } from '@mantine/core';
import { fetchIncidencesByUserId, updateIncidenceContent } from '@/services/fetch';
import { toast } from 'react-toastify';
import { vi } from 'vitest';


vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));


vi.mock('@/hooks/AuthProvider', () => ({
  useAuth: () => ({
    user: { id: '1' },
  }),
}));


vi.mock('@/services/fetch', () => ({
  fetchIncidencesByUserId: vi.fn(() =>
    Promise.resolve([
      {
        id: 1,
        boxId: 101,
        content: 'Incidencia de prueba',
        isSolved: false,
        createdAt: '2023-10-01T12:00:00Z',
        user: { id: 1, name: 'Usuario', avatar: 'avatar-url' },
      },
    ])
  ),
  updateIncidenceContent: vi.fn(() => Promise.resolve({})),
}));

const renderWithMantine = (component) => {
  return render(<MantineProvider>{component}</MantineProvider>);
};

describe('ReportsBox', () => {
  it('renders correctly and shows incidences', async () => {
    renderWithMantine(<ReportsBox />);


    expect(screen.getByText('Incidencias')).toBeInTheDocument();


    await waitFor(() => {
      expect(screen.getByText('Casilla 101')).toBeInTheDocument();
      expect(screen.getByText('Incidencia de prueba')).toBeInTheDocument();
    });
  });

  it('opens the modal when an incidence is clicked', async () => {
    renderWithMantine(<ReportsBox />);


    await waitFor(() => {
      expect(screen.getByText('Casilla 101')).toBeInTheDocument();
    });

   
    const incidencePanel = screen.getByText('Incidencia de prueba').closest('div');
    if (incidencePanel) {
      fireEvent.click(incidencePanel);
    }


    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText('Contenido de la incidencia')).toBeInTheDocument();
  });

  it('updates the incidence content and shows a success toast', async () => {
    renderWithMantine(<ReportsBox />);


    await waitFor(() => {
      expect(screen.getByText('Casilla 101')).toBeInTheDocument();
    });

    const incidencePanel = screen.getByText('Incidencia de prueba').closest('div');
    if (incidencePanel) {
      fireEvent.click(incidencePanel);
    }


    const textarea = screen.getByLabelText('Contenido de la incidencia');
    fireEvent.change(textarea, { target: { value: 'Nuevo contenido' } });


    fireEvent.click(screen.getByText('Guardar'));


    await waitFor(() => {
      expect(updateIncidenceContent).toHaveBeenCalledWith(1, 'Nuevo contenido');
    });

    expect(toast.success).toHaveBeenCalledWith('Incidencia actualizada con éxito');
  });

  it('shows an error toast when updating fails', async () => {

    updateIncidenceContent.mockRejectedValueOnce(new Error('Error de red'));

    renderWithMantine(<ReportsBox />);


    await waitFor(() => {
      expect(screen.getByText('Casilla 101')).toBeInTheDocument();
    });


    const incidencePanel = screen.getByText('Incidencia de prueba').closest('div');
    if (incidencePanel) {
      fireEvent.click(incidencePanel);
    }

  
    const textarea = screen.getByLabelText('Contenido de la incidencia');
    fireEvent.change(textarea, { target: { value: 'Nuevo contenido' } });


    fireEvent.click(screen.getByText('Guardar'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error: Error de red');
    });
  });

  it('shows a warning toast when the update time exceeds 10 minutes', async () => {

    updateIncidenceContent.mockRejectedValueOnce({
      response: { status: 400, data: { message: 'excedido el tiempo' } },
    });

    renderWithMantine(<ReportsBox />);

    await waitFor(() => {
      expect(screen.getByText('Casilla 101')).toBeInTheDocument();
    });

    const incidencePanel = screen.getByText('Incidencia de prueba').closest('div');
    if (incidencePanel) {
      fireEvent.click(incidencePanel);
    }

    const textarea = screen.getByLabelText('Contenido de la incidencia');
    fireEvent.change(textarea, { target: { value: 'Nuevo contenido' } });

    fireEvent.click(screen.getByText('Guardar'));

    await waitFor(() => {
      expect(toast.warning).toHaveBeenCalledWith(
        'Han pasado más de 10 minutos no se puede actualizar la incidencia'
      );
    });
  });

  it('closes the modal when the save button is clicked', async () => {
    renderWithMantine(<ReportsBox />);


    await waitFor(() => {
      expect(screen.getByText('Casilla 101')).toBeInTheDocument();
    });


    const incidencePanel = screen.getByText('Incidencia de prueba').closest('div');
    if (incidencePanel) {
      fireEvent.click(incidencePanel);
    }


    fireEvent.click(screen.getByText('Guardar'));

  
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});