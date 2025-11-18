import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';

interface Review {
  id: string;
  contact_number: string;
  user_name: string;
  product_name: string;
  product_review: string;
  created_at: string;
  color?: string; 
}

interface ReviewCardProps {
  review: Review;
  onDelete?: (id: string) => void;
}

export default function ReviewCard({ review, onDelete }: ReviewCardProps) {
  return (
    <div
      className={`${review.color ?? 'bg-gray-200'} rounded-lg shadow-md p-6 relative hover:shadow-xl transition-shadow`}
    >
   
      {onDelete && (
        <button
          className="absolute top-2 right-2 text-gray-700 hover:text-red-600"
          onClick={() => onDelete(review.id)}
          title="Delete review"
        >
          <Trash2 size={18} />
        </button>
      )}

    
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{review.product_name}</h3>
          <p className="text-sm text-gray-700">by {review.user_name}</p>
        </div>
        <span className="text-xs text-gray-600">
          {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
        </span>
      </div>

     
      <p className="text-gray-800 leading-relaxed">{review.product_review}</p>

    
      <div className="mt-4 pt-4 border-t border-gray-300">
        <p className="text-xs text-gray-600">Contact: {review.contact_number}</p>
      </div>
    </div>
  );
}

