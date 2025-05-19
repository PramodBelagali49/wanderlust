import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Navigation from "../src/components/common/Navbar.jsx"

describe('Navigation component', () => {
  it('renders the logo with text Explore', () => {
    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );
    const logo = screen.getByRole('link', { name: /explore/i });
    expect(logo).toBeInTheDocument();
  });
});
