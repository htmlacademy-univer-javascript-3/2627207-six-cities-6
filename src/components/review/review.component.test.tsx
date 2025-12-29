import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReviewComponent from './review.component';

describe('ReviewComponent', () => {
  const mockReview = {
    id: 1,
    offerId: '1',
    user: {
      name: 'John Doe',
      email: 'john@test.com',
      avatarUrl: 'https://example.com/avatar.jpg',
      isPro: true,
      token: 'token',
    },
    comment: 'Great place to stay!',
    date: '2023-10-15T10:00:00.000Z',
    rating: 5,
  };

  it('should render correctly with review data', () => {
    render(<ReviewComponent review={mockReview} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Great place to stay!')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
  });

  it('should render avatar image', () => {
    render(<ReviewComponent review={mockReview} />);

    const avatar = screen.getByAltText('User avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', mockReview.user.avatarUrl);
  });

  it('should render formatted date', () => {
    render(<ReviewComponent review={mockReview} />);

    expect(screen.getByText('October 2023')).toBeInTheDocument();
  });

  it('should not render Pro badge when user is not pro', () => {
    const nonProReview = {
      ...mockReview,
      user: {
        ...mockReview.user,
        isPro: false,
      },
    };

    render(<ReviewComponent review={nonProReview} />);

    expect(screen.queryByText('Pro')).not.toBeInTheDocument();
  });

  it('should render error message when user is not provided', () => {
    const reviewWithoutUser = {
      ...mockReview,
      user: null as never,
    };

    render(<ReviewComponent review={reviewWithoutUser} />);

    expect(screen.getByText('Error loading review')).toBeInTheDocument();
  });

  it('should render rating with correct width', () => {
    render(<ReviewComponent review={mockReview} />);

    const ratingSpan = screen.getByText('Rating').previousElementSibling;
    expect(ratingSpan).toHaveStyle({ width: 'calc(100% / 5 * 5)' });
  });
});
