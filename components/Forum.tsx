import React, { useState, useContext, useMemo } from 'react';
// FIX: Imported newly defined types to resolve errors.
import { Review, UserProficiency } from '../types';
import { UserContext } from '../App';
import { UserIcon, SendIcon, StarIcon } from './icons';

interface ForumProps {
  reviews: Review[];
  recipeId: string;
  onAddReview: (recipeId: string, review: Omit<Review, 'id' | 'createdAt' | 'authorName' | 'authorProficiency'>) => void;
}

const timeSince = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "年前";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "ヶ月前";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "日前";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "時間前";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "分前";
    return "たった今";
};

const StarRatingInput: React.FC<{ rating: number; setRating: (rating: number) => void; disabled?: boolean; }> = ({ rating, setRating, disabled = false }) => (
    <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
            <button
                type="button"
                key={star}
                onClick={() => !disabled && setRating(star)}
                className={`text-4xl transition-transform transform hover:scale-125 focus:outline-none disabled:cursor-not-allowed disabled:transform-none ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                aria-label={`${star} stars`}
                disabled={disabled}
            >
                ★
            </button>
        ))}
    </div>
);


const proficiencyLabels: { [key in UserProficiency]: string } = {
    1: '見習い',
    2: '駆け出し',
    3: '一人前',
    4: '副料理長',
    5: 'マスターシェフ',
};


const Forum: React.FC<ForumProps> = ({ reviews, recipeId, onAddReview }) => {
  const { user } = useContext(UserContext);
  const [newReview, setNewReview] = useState({ rating: 0, title: '', comment: ''});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // FIX: Accessing property now available on User type.
  const [activeFilter, setActiveFilter] = useState<'all' | UserProficiency>(user?.proficiency || 'all');
  const [errors, setErrors] = useState<{ rating?: string }>({});

  const validate = () => {
    const newErrors: { rating?: string } = {};
    if (newReview.rating === 0) {
        newErrors.rating = '星評価を選択してください。';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // FIX: Accessing property now available on User type.
    if (!user || !user.proficiency) {
        alert("レビューを投稿するにはレベル設定が必要です。マイページから設定してください。");
        return;
    }

    if (!validate()) {
        return;
    }
    
    setIsSubmitting(true);
    
    // The previous implementation had a logic issue where the component might not re-render before the alert.
    // This timeout ensures the submitting state is rendered, and then the logic proceeds, providing a better user experience.
    setTimeout(() => {
        try {
            // FIX: The onAddReview prop expects a review object that includes the recipeId property.
            // The newReview state object did not include it, so it is added here to satisfy the type definition.
            onAddReview(recipeId, { ...newReview, recipeId });
            setNewReview({ rating: 0, title: '', comment: '' });
            setErrors({});
            alert('レビューが投稿されました！');
        } catch (error) {
            console.error("レビューの投稿に失敗しました: ", error);
            alert("エラーが発生しました。もう一度お試しください。");
        } finally {
            setIsSubmitting(false);
        }
    }, 50);
  };
  
  const ratingDistribution = useMemo(() => {
    const counts: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => { counts[r.rating] = (counts[r.rating] || 0) + 1 });
    return counts;
  }, [reviews]);
  
  const totalReviews = reviews.length;
  
  const filteredReviews = useMemo(() => {
      if (activeFilter === 'all') return reviews;
      return reviews.filter(r => r.authorProficiency === activeFilter);
  }, [reviews, activeFilter]);


  const filterTabs: {key: 'all' | UserProficiency, label: string}[] = [
      { key: 'all', label: 'すべて' },
      { key: 1, label: proficiencyLabels[1] },
      { key: 2, label: proficiencyLabels[2] },
      { key: 3, label: proficiencyLabels[3] },
      { key: 4, label: proficiencyLabels[4] },
      { key: 5, label: proficiencyLabels[5] },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="space-y-6">
        {/* Rating Summary */}
        <div className="border-b pb-6">
          <h4 className="text-xl font-bold mb-4">レビュー概要</h4>
            {totalReviews > 0 ? (
                 <div className="w-full space-y-2">
                    {[5,4,3,2,1].map(star => (
                        <div key={star} className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-600">{star} ★</span>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-yellow-400 h-2.5 rounded-full" style={{width: `${(ratingDistribution[star] / totalReviews) * 100}%`}}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-600 w-10 text-right">{ratingDistribution[star]}</span>
                        </div>
                    ))}
                 </div>
            ) : <div className="w-full"><p className="text-gray-500">まだレビューはありません。</p></div> }
        </div>

        {/* Add Review Form */}
        <form onSubmit={handleSubmit} className="flex items-start gap-4 border-b pb-6">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-gray-500" />
            </div>
            <div className="flex-grow">
                <div className="mb-2">
                    <div className="flex items-center gap-4">
                        <label className="font-bold text-gray-700 flex-shrink-0">評価 *</label>
                        <StarRatingInput 
                            rating={newReview.rating} 
                            setRating={(r) => setNewReview(p => ({...p, rating: r}))}
                            disabled={isSubmitting}
                        />
                    </div>
                    {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
                </div>
                 <div className="mb-2">
                    <label htmlFor="review-title" className="font-bold text-gray-700">タイトル</label>
                    <input
                        id="review-title"
                        type="text"
                        value={newReview.title}
                        onChange={(e) => setNewReview(p => ({...p, title: e.target.value}))}
                        placeholder="レビューのタイトル（任意）"
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        disabled={isSubmitting}
                    />
                </div>
                <div>
                    <label htmlFor="review-comment" className="font-bold text-gray-700">コメント</label>
                    <textarea
                        id="review-comment"
                        value={newReview.comment}
                        onChange={(e) => setNewReview(p => ({...p, comment: e.target.value}))}
                        placeholder="あなたの体験談を具体的に共有してください...（任意）"
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        rows={3}
                        disabled={isSubmitting}
                    />
                </div>
                <button type="submit" disabled={isSubmitting} className="mt-2 flex items-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400">
                    <SendIcon className="w-5 h-5"/>
                    <span>{isSubmitting ? '投稿中...' : 'レビューを投稿'}</span>
                </button>
            </div>
        </form>

        {/* Filter and Review List */}
        <div>
            <div className="mb-4 border-b border-gray-200">
                <nav className="flex space-x-4 -mb-px overflow-x-auto custom-scrollbar">
                    {filterTabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveFilter(tab.key)}
                            className={`py-3 px-2 whitespace-nowrap font-semibold border-b-2 ${activeFilter === tab.key ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="space-y-6">
                {filteredReviews.length > 0 ? (
                    filteredReviews.map(review => (
                        <div key={review.id} className="flex items-start gap-4 border-t border-gray-100 pt-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex-shrink-0 items-center justify-center flex">
                                <UserIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-grow">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-baseline gap-2">
                                        <p className="font-bold text-gray-800">{review.authorName}</p>
                                        <p className="text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{ proficiencyLabels[review.authorProficiency] }</p>
                                    </div>
                                    <p className="text-xs text-gray-500">{timeSince(review.createdAt)}</p>
                                </div>
                                <div className="flex items-center my-1">
                                    {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />)}
                                </div>
                                <h5 className="font-bold mt-1">{review.title}</h5>
                                <p className="text-gray-700 mt-1 whitespace-pre-wrap">{review.comment}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8"><p className="text-gray-500">このレベルのレビューはまだありません。</p></div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Forum;