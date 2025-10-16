import { render, screen } from '@testing-library/react';
import ImageResultList from '@/app/components/ImageResultList';

describe('ImageResultList', () => {
  it('renders an empty state when no results exist', () => {
    render(<ImageResultList results={[]} />);

    expect(
      screen.getByText(/no results yet\. try searching for something\./i)
    ).toBeInTheDocument();
  });

  it('renders a card for each result', () => {
    const mockResults = [
      { id: '1', alt: 'First image', src: 'https://example.com/1.jpg', relevance: 1 },
      { id: '2', alt: 'Second image', src: 'https://example.com/2.jpg', relevance: 0.9 }
    ];

    render(<ImageResultList results={mockResults} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(mockResults.length);
    expect(screen.getByText(/first image/i)).toBeInTheDocument();
    expect(screen.getByText(/second image/i)).toBeInTheDocument();
  });
});
