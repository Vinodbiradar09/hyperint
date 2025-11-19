'use client';

import { useEffect, useState } from 'react';
import ReviewCard from '@/components/ReviewCard';
import { QrCode, MessageSquare } from 'lucide-react';
import Image from 'next/image';
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
  const [showQR, setShowQR] = useState(false);

  const TWILIO_NUMBER = '+14155238886';
  const JOIN_CODE = 'join pile-lose'; 

  const whatsappLink = `https://wa.me/${TWILIO_NUMBER.replace(/\+/g, '')}?text=${encodeURIComponent(JOIN_CODE)}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(whatsappLink)}`;

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
    if (!confirm('Are you sure you want to delete this review?')) return;
    
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
        <h1 className="text-4xl font-bold text-center mb-6 text-white">
          Product Reviews
        </h1>
        <p className="text-center text-white mb-8">
          Reviews collected via WhatsApp
        </p>

        <div className="bg-linear-to-r from-black to-grey-500 rounded-2xl p-8 mb-8 text-center">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-white" />
          <h2 className="text-2xl font-bold mb-2">Submit Your Review via WhatsApp!</h2>
          <p className="text-white/90 mb-6">
            Scan the QR code or send a message to get started
          </p>
          
          <button
            onClick={() => setShowQR(!showQR)}
            className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            <QrCode size={20} />
            {showQR ? 'Hide QR Code' : 'Show QR Code'}
          </button>
        </div>

        {showQR && (
          <div className="bg-black rounded-2xl p-8 mb-8 border border-gray-950">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-center">
                <Image 
                width={300}
                height={300}
                  src={qrCodeUrl} 
                  alt="WhatsApp QR Code"
                  className="mx-auto rounded-lg shadow-lg bg-white p-4"
                />
                <p className="text-sm text-gray-400 mt-4">
                  Scan with your phone camera
                </p>
              </div>
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white">How to Submit a Review:</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-semibold">Scan QR Code</p>
                      <p className="text-sm text-gray-400">Or click the button below to open WhatsApp</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-semibold">Send the Join Code</p>
                      <code className="text-black bg-white px-2 py-1 rounded text-sm">
                        {JOIN_CODE}
                      </code>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-semibold">Start Chatting</p>
                      <p className="text-sm text-gray-400">Follow the bot questions to submit your review</p>
                    </div>
                  </div>
                </div>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-green-600 transition-colors text-center"
                >
                  Open WhatsApp
                </a>

                <p className="text-xs text-gray-500 text-center">
                  WhatsApp Number: {TWILIO_NUMBER}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className='flex items-center justify-center mb-10'>
          <p>Make sure not to bombard messages i have applied aggresively rate limit to this</p>
        </div>

        <div className="flex justify-center mb-8">
          <button
            className="px-6 py-2 bg-white text-black font-semibold rounded hover:bg-pink-200 disabled:opacity-50 transition-colors"
            onClick={fetchReviews}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Reviews'}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}
        {reviews.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map(review => (
                <ReviewCard key={review.id} review={review} onDelete={handleDelete} />
              ))}
            </div>
            <p className="text-center text-gray-500 mt-8">
              Showing {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </p>
          </>
        ) : (
          !loading && (
            <div className="text-center py-20 bg-gray-900 rounded-2xl">
              <MessageSquare className="w-20 h-20 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg mb-2">No reviews yet</p>
              <p className="text-gray-600 text-sm">
                Be the first to submit a review via WhatsApp!
              </p>
            </div>
          )
        )}
      </div>
    </main>
  );
}