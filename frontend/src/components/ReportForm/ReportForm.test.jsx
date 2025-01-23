// import { ReportForm } from './ReportForm';
// import { faker } from '@faker-js/faker';    

// function createRandomReport() {
//   return {
//     content: faker.lorem.sentence(),
//     isSolved: faker.random.boolean(),
//     userId: faker.random.number(),
//     boxId: faker.random.number(),
//   };
// }

// const mockReports = [
//   {
//     content,
//     isSolved,
//     userId,
//     boxId,
//   },
// ];

// describe('the first dropdown should be selected so the second activates', () => {
//     const firstDropdown = screen.getByText('Select a box'); 

// });


    import { render, screen, fireEvent, waitFor } from '@testing-library/react';
    import { ReportForm } from './ReportForm';
    import { fetchLockers, fetchBoxesByLocker, fetchFormIncident } from '../../services/fetch';
    import { useAuth } from '../../hooks/AuthProvider';
    import { vi } from 'vitest';

    vi.mock('../../services/fetch');
    vi.mock('../../hooks/AuthProvider');

    describe('ReportForm', () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('renders the form correctly', async () => {
            fetchLockers.mockResolvedValue([]);
            useAuth.mockReturnValue({ user: { id: '1' } });

            render(<ReportForm />);

            expect(screen.getByText('Formulario de Incidencias')).toBeInTheDocument();
            expect(screen.getByLabelText('Armario')).toBeInTheDocument();
            expect(screen.getByLabelText('Casilla')).toBeInTheDocument();
            expect(screen.getByLabelText('Descripción')).toBeInTheDocument();
            expect(screen.getByText('Enviar')).toBeInTheDocument();
        });

        it('fetches and displays lockers on mount', async () => {
            const lockers = [{ id: 1, description: 'Locker 1' }];
            fetchLockers.mockResolvedValue(lockers);
            useAuth.mockReturnValue({ user: { id: '1' } });

            render(<ReportForm />);

            await waitFor(() => expect(fetchLockers).toHaveBeenCalledTimes(1));
            expect(screen.getByText('Locker 1')).toBeInTheDocument();
        });

        it('fetches and displays boxes when a locker is selected', async () => {
            const lockers = [{ id: 1, description: 'Locker 1' }];
            const boxes = [{ id: 1, description: 'Box 1' }];
            fetchLockers.mockResolvedValue(lockers);
            fetchBoxesByLocker.mockResolvedValue(boxes);
            useAuth.mockReturnValue({ user: { id: '1' } });

            render(<ReportForm />);

            fireEvent.change(screen.getByLabelText('Armario'), { target: { value: '1' } });

            await waitFor(() => expect(fetchBoxesByLocker).toHaveBeenCalledWith('1'));
            expect(screen.getByText('Box 1')).toBeInTheDocument();
        });

        it('displays an alert if form is submitted with missing fields', async () => {
            fetchLockers.mockResolvedValue([]);
            useAuth.mockReturnValue({ user: { id: '1' } });

            render(<ReportForm />);

            fireEvent.click(screen.getByText('Enviar'));

            await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Por favor, complete todos los campos.'));
        });

        it('submits the form successfully', async () => {
            const lockers = [{ id: 1, description: 'Locker 1' }];
            const boxes = [{ id: 1, description: 'Box 1' }];
            fetchLockers.mockResolvedValue(lockers);
            fetchBoxesByLocker.mockResolvedValue(boxes);
            fetchFormIncident.mockResolvedValue({});
            useAuth.mockReturnValue({ user: { id: '1' } });

            render(<ReportForm />);

            fireEvent.change(screen.getByLabelText('Armario'), { target: { value: '1' } });
            await waitFor(() => expect(fetchBoxesByLocker).toHaveBeenCalledWith('1'));

            fireEvent.change(screen.getByLabelText('Casilla'), { target: { value: '1' } });
            fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: 'Test description' } });

            fireEvent.click(screen.getByText('Enviar'));

            await waitFor(() => expect(fetchFormIncident).toHaveBeenCalledWith({
                content: 'Test description',
                isSolved: false,
                userId: 1,
                boxId: 1,
            }));
            await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Reporte creado exitosamente'));
        });

        it('clears the form after successful submission', async () => {
            const lockers = [{ id: 1, description: 'Locker 1' }];
            const boxes = [{ id: 1, description: 'Box 1' }];
            fetchLockers.mockResolvedValue(lockers);
            fetchBoxesByLocker.mockResolvedValue(boxes);
            fetchFormIncident.mockResolvedValue({});
            useAuth.mockReturnValue({ user: { id: '1' } });

            render(<ReportForm />);

            fireEvent.change(screen.getByLabelText('Armario'), { target: { value: '1' } });
            await waitFor(() => expect(fetchBoxesByLocker).toHaveBeenCalledWith('1'));

            fireEvent.change(screen.getByLabelText('Casilla'), { target: { value: '1' } });
            fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: 'Test description' } });

            fireEvent.click(screen.getByText('Enviar'));

            await waitFor(() => expect(fetchFormIncident).toHaveBeenCalledWith({
                content: 'Test description',
                isSolved: false,
                userId: 1,
                boxId: 1,
            }));
            await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Reporte creado exitosamente'));

            expect(screen.getByLabelText('Armario').value).toBe('');
            expect(screen.getByLabelText('Casilla').value).toBe('');
            expect(screen.getByLabelText('Descripción').value).toBe('');
        });

        it('displays an error alert if form submission fails', async () => {
            const lockers = [{ id: 1, description: 'Locker 1' }];
            const boxes = [{ id: 1, description: 'Box 1' }];
            fetchLockers.mockResolvedValue(lockers);
            fetchBoxesByLocker.mockResolvedValue(boxes);
            fetchFormIncident.mockRejectedValue(new Error('Submission failed'));
            useAuth.mockReturnValue({ user: { id: '1' } });

            render(<ReportForm />);

            fireEvent.change(screen.getByLabelText('Armario'), { target: { value: '1' } });
            await waitFor(() => expect(fetchBoxesByLocker).toHaveBeenCalledWith('1'));

            fireEvent.change(screen.getByLabelText('Casilla'), { target: { value: '1' } });
            fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: 'Test description' } });

            fireEvent.click(screen.getByText('Enviar'));

            await waitFor(() => expect(fetchFormIncident).toHaveBeenCalledWith({
                content: 'Test description',
                isSolved: false,
                userId: 1,
                boxId: 1,
            }));
            await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Error al crear el reporte'));
        });
});