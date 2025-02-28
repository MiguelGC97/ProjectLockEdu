import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import { vi } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { fetchBoxesByLocker, fetchFormIncident, fetchLockers } from '@/services/fetch';
import { ReportForm } from './ReportForm';

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('@/hooks/AuthProvider', () => ({
  useAuth: () => ({
    user: { id: '1' },
  }),
}));

// Mock de servicios fetch
vi.mock('@/services/fetch', () => ({
  fetchLockers: vi.fn(() => Promise.resolve([{ id: 1, description: 'Armario 01' }])),
  fetchBoxesByLocker: vi.fn(() =>
    Promise.resolve([{ id: 1, description: 'Casilla del armario 01' }])
  ),
  fetchFormIncident: vi.fn(() => Promise.resolve({})),
}));

const renderWithMantine = (component) => {
  return render(<Flex>{component}</Flex>);
};

describe('ReportForm', () => {
  it('renders correctly', async () => {
    renderWithMantine(<ReportForm />);

    await waitFor(() => {
      expect(screen.getByTestId('reportForm')).toBeInTheDocument();
      expect(screen.getByTestId('locker-select')).toBeInTheDocument();
      expect(screen.getByTestId('box-select')).toBeInTheDocument();
      expect(screen.getByTestId('description-textarea')).toBeInTheDocument();
      expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    });
  });

  it('submits the form correctly', async () => {
    fetchLockers.mockResolvedValue([{ id: 1, description: 'Armario 01' }]);
    fetchBoxesByLocker.mockResolvedValue([{ id: 1, description: 'Casilla del armario 01' }]);

    renderWithMantine(<ReportForm />);

    await waitFor(() => {
      expect(screen.getByTestId('locker-select')).toBeInTheDocument();
    });

    const lockerSelect = screen.getByTestId('locker-select');
    fireEvent.mouseDown(lockerSelect);
    fireEvent.change(lockerSelect, { target: { value: '1' } });

    await waitFor(() => {
      const boxSelect = screen.getByTestId('box-select');
      expect(boxSelect).not.toBeDisabled();
    });

    const boxSelect = screen.getByTestId('box-select');
    fireEvent.mouseDown(boxSelect);
    fireEvent.change(boxSelect, { target: { value: '1' } });

    const descriptionTextarea = screen.getByTestId('description-textarea');
    fireEvent.change(descriptionTextarea, {
      target: { value: 'Test description' },
    });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetchFormIncident).toHaveBeenCalledWith({
        content: 'Test description',
        isSolved: false,
        userId: 1,
        boxId: 1,
      });
    });
  });

  it('shows a toast error if the form is incomplete', async () => {
    renderWithMantine(<ReportForm />);

    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Por favor, complete todos los campos.');
    });
  });

  it('shows a toast error if no locker is selected', async () => {
    renderWithMantine(<ReportForm />);

    const boxSelect = screen.getByTestId('box-select');
    fireEvent.mouseDown(boxSelect);
    fireEvent.change(boxSelect, { target: { value: '1' } });

    const descriptionTextarea = screen.getByTestId('description-textarea');
    fireEvent.change(descriptionTextarea, {
      target: { value: 'Test description' },
    });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Por favor, complete todos los campos.');
    });
  });

  it('shows a toast error if no box is selected', async () => {
    renderWithMantine(<ReportForm />);

    const lockerSelect = screen.getByTestId('locker-select');
    fireEvent.mouseDown(lockerSelect);
    fireEvent.change(lockerSelect, { target: { value: '1' } });

    const descriptionTextarea = screen.getByTestId('description-textarea');
    fireEvent.change(descriptionTextarea, {
      target: { value: 'Test description' },
    });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Por favor, complete todos los campos.');
    });
  });

  it('shows a toast error if no description is provided', async () => {
    renderWithMantine(<ReportForm />);

    const lockerSelect = screen.getByTestId('locker-select');
    fireEvent.mouseDown(lockerSelect);
    fireEvent.change(lockerSelect, { target: { value: '1' } });

    const boxSelect = screen.getByTestId('box-select');
    fireEvent.mouseDown(boxSelect);
    fireEvent.change(boxSelect, { target: { value: '1' } });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Por favor, complete todos los campos.');
    });
  });

  it('handles error when fetching lockers', async () => {
    fetchLockers.mockRejectedValue(new Error('Error fetching lockers'));

    renderWithMantine(<ReportForm />);

    await waitFor(() => {
      expect(screen.getByTestId('locker-select')).toBeInTheDocument();
    });

    const boxSelect = screen.getByTestId('box-select');
    expect(boxSelect).toBeDisabled();
  });
});
