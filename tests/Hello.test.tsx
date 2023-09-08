import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// To Test
import Hello from '../frontend/Hello';

// Tests
describe('Renders main page correctly', async () => {
    it('Should render the page correctly', async () => {
        // Setup
        const { getByTestId } = render(<Hello name="Tatu"/>);

        expect(getByTestId('hello-h1').textContent === 'Hello Tatu').toBe(true);

        const h1 = screen.queryByText('Hello Tatu');

        // Expectations
        expect(h1).not.toBeNull();
    });
});
