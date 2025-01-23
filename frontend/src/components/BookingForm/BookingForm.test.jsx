import { expect, test, vi, afterEach, describe } from "vitest";
import { faker } from '@faker-js/faker';
import { render, screen, fireEvent } from '@testing-library/react';
import { theme } from '../../theme';
import { MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { BookingForm } from './BookingForm';
import { locker } from "../../../../backend/models";

//Required properties mocks
const mockProps = {
    locker: { 
        id: faker.number.int({ min: 1, max: 1000 }).toString(), 
        description: faker.lorem.words(6), 
    }
}

describe("BookingForm component", () => {
    it('shows an error if trying to ')
});