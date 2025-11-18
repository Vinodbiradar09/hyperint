'use client';

import { useEffect, useState } from 'react';
import ReviewCard from '@/components/ReviewCard';

interface Review {
  id: string;
  contact_number: string;
  user_name: string;
  product_name: string;
  product_review: string;
  created_at: string;
  color?: string;
}

const pastelColors = [
  'bg-pink-200',
  'bg-purple-200',
  'bg-teal-200',
  'bg-yellow-200',
  'bg-indigo-200',
  'bg-green-200',
];

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reviews', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch');
      const data: Review[] = await res.json();

      const coloredData = data.map(r => ({
        ...r,
        color: pastelColors[Math.floor(Math.random() * pastelColors.length)],
      }));

      setReviews(coloredData);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete review');
    }
  };

  useEffect(() => {
    fetchReviews();
    const interval = setInterval(fetchReviews, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <div className="max-w-6xl mx-auto">
       
        <h1 className="text-4xl font-bold text-center mb-6 text-pink-400">
          Product Reviews
        </h1>
        <p className="text-center text-gray-400 mb-6">
          Reviews collected via WhatsApp
        </p>

        <div className="flex justify-center mb-8">
          <button
            className="px-6 py-2 bg-pink-400 text-black font-semibold rounded hover:bg-pink-500 disabled:opacity-50 transition-colors"
            onClick={fetchReviews}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Reviews'}
          </button>
        </div>

        {error && <p className="text-red-500 text-center mb-6">{error}</p>}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map(review => (
            <ReviewCard key={review.id} review={review} onDelete={handleDelete} />
          ))}
        </div>

        {reviews.length === 0 && !loading && (
          <p className="text-gray-500 text-center mt-12">No reviews yet.</p>
        )}
      </div>
    </main>
  );
}
