import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingScreen } from './spinner.component';

describe('LoadingScreen component', () => {
  it('should render correctly', () => {
    render(<LoadingScreen />);

    expect(screen.getByText('Loading ...')).toBeInTheDocument();
  });
});
