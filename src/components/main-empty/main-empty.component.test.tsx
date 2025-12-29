import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MainEmpty from './main-empty.component';

describe('MainEmpty component', () => {
  it('should render correctly with city name', () => {
    const cityName = 'Paris';
    render(<MainEmpty cityName={cityName} />);

    expect(screen.getByText('No places to stay available')).toBeInTheDocument();
    expect(screen.getByText(`We could not find any property available at the moment in ${cityName}`)).toBeInTheDocument();
  });

  it('should render with different city name', () => {
    const cityName = 'Amsterdam';
    render(<MainEmpty cityName={cityName} />);

    expect(screen.getByText(`We could not find any property available at the moment in ${cityName}`)).toBeInTheDocument();
  });
});
