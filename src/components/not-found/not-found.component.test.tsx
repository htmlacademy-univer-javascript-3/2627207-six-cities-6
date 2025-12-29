import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageNotFound } from './not-found.component';
import { BrowserRouter } from 'react-router-dom';

describe('PageNotFound component', () => {
  it('should render correctly', () => {
    render(
      <BrowserRouter>
        <PageNotFound />
      </BrowserRouter>
    );

    expect(screen.getByText('404 Not Found')).toBeInTheDocument();
    expect(screen.getByText('Эта страница не найдена')).toBeInTheDocument();
    expect(screen.getByText('Вернуться на главную')).toBeInTheDocument();
  });

  it('should render link to main page', () => {
    render(
      <BrowserRouter>
        <PageNotFound />
      </BrowserRouter>
    );

    const link = screen.getByRole('link', { name: /вернуться на главную/i });
    expect(link).toHaveAttribute('href', '/');
  });
});
