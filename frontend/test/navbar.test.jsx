import { describe, it } from 'vitest';  
import '@testing-library/jest-dom';              
import { render, screen } from '@testing-library/react';
import Navigation from '../path/to/Navigation';

describe('Navigation Component', () => {
  it('renders the logo link', () => {
    render(<Navigation />);
    const logoLink = screen.getByRole('link', { name: /explore/i });
    expect(logoLink).toBeInTheDocument();
  });
});
