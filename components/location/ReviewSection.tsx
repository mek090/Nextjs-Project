"use client";

import { useState, useEffect } from "react";
import { Star, Heart, MessageCircle, ThumbsUp, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import Image from 'next/image';
import { createReviewAction, createReplyAction } from '@/actions/actions';
import { useRouter } from 'next/navigation';

interface Review {
  id: string;
  content: string;
  rating: number;
  createdAt: string;
  profile: {
    firstname: string;
    lastname: string;
    username: string;
    profileImage: string | null;
  };
  replies: Reply[];
}

interface Reply {
  id: string;
  contain: string;
  createAt: string;
  reviewId: string;
  profile: {
    firstname: string;
    lastname: string;
    username: string;
    profileImage: string | null;
  };
}

interface ReviewSectionProps {
  locationId: string;
  reviews: Review[];
}

const ReviewSection = ({ locationId, reviews }: ReviewSectionProps) => {
  const { userId } = useAuth();
  const router = useRouter();
  const [hoveredRating, setHoveredRating] = useState(0);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyContent, setReplyContent] = useState<{ [reviewId: string]: string }>({});
  const [isReplying, setIsReplying] = useState<{ [reviewId: string]: boolean }>({});
  const [showReplyForms, setShowReplyForms] = useState<{ [reviewId: string]: boolean }>({});
  const [likes, setLikes] = useState<{ [reviewId: string]: boolean }>({});

  useEffect(() => {
    // Load any previously saved likes from localStorage
    const savedLikes = localStorage.getItem('reviewLikes');
    if (savedLikes) {
      setLikes(JSON.parse(savedLikes));
    }
  }, []);

  const handleLike = (reviewId: string) => {
    setLikes(prev => {
      const updated = { ...prev, [reviewId]: !prev[reviewId] };
      localStorage.setItem('reviewLikes', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !content.trim()) return;

    setIsSubmitting(true);
    
    createReviewAction(locationId, rating, content)
      .then(() => {
        setRating(0);
        setContent("");
        router.refresh();
      })
      .catch((error) => {
        console.error("Error submitting review:", error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleReplySubmit = (e: React.FormEvent, reviewId: string) => {
    e.preventDefault();

    const content = replyContent[reviewId]?.trim();
    if (!content) return;

    setIsReplying(prev => ({ ...prev, [reviewId]: true }));
    
    createReplyAction(reviewId, content)
      .then(() => {
        setReplyContent(prev => ({ ...prev, [reviewId]: "" }));
        setShowReplyForms(prev => ({ ...prev, [reviewId]: false }));
        router.refresh();
      })
      .catch((error) => {
        console.error("Error submitting reply:", error);
      })
      .finally(() => {
        setIsReplying(prev => ({ ...prev, [reviewId]: false }));
      });
  };

  const toggleReplyForm = (reviewId: string) => {
    setShowReplyForms(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  if (!userId) {
    return (
      <div className="mt-6 sm:mt-8 p-4 sm:p-6 md:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white flex items-center">
          <MessageCircle className="mr-2 text-blue-500 w-5 h-5 sm:w-6 sm:h-6" /> รีวิวจากผู้ใช้
        </h2>
        <div className="text-center py-8 sm:py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-gray-200 flex items-center justify-center">
            <MessageCircle className="text-gray-400 w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base md:text-lg">กรุณาเข้าสู่ระบบเพื่อเข้าถึงและเขียนรีวิว</p>
          <SignInButton mode="modal">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2 rounded-full text-sm sm:text-base">
              เข้าสู่ระบบ
            </Button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 sm:mt-10 bg-white dark:bg-gray-800 rounded-xl dark:border-gray-700">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-gray-800 dark:text-white flex items-center">
        <MessageCircle className="mr-2 text-blue-500 w-5 h-5 sm:w-6 sm:h-6" /> แชร์ประสบการณ์ของคุณ
      </h2>

      {/* Review Form */}
      <div className="mb-8 sm:mb-10 bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-xl">
        <div className="mb-4 sm:mb-6">
          <label className="block text-base sm:text-lg font-medium mb-2 sm:mb-3 text-gray-700 dark:text-gray-200">
            ให้คะแนนประสบการณ์
          </label>
          <div className="flex gap-1 sm:gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  size={24}
                  className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 transition-all duration-300 ${
                    star <= (hoveredRating || rating) 
                      ? "fill-yellow-400 text-yellow-400 scale-110" 
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 sm:ml-3 text-gray-600 dark:text-gray-300 self-center text-sm sm:text-base">
              {rating > 0 && (
                rating === 1 ? "แย่" :
                rating === 2 ? "พอใช้" :
                rating === 3 ? "ปานกลาง" :
                rating === 4 ? "ดี" : "ดีเยี่ยม"
              )}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-base sm:text-lg font-medium mb-2 sm:mb-3 text-gray-700 dark:text-gray-200">
            เล่าประสบการณ์ของคุณ
          </label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 dark:border-gray-600 p-3 sm:p-4 rounded-lg text-gray-800 dark:text-white dark:bg-gray-800 text-sm sm:text-base"
            placeholder="แชร์ความประทับใจหรือข้อเสนอแนะเพื่อช่วยผู้อื่นในการตัดสินใจ..."
          />
          <div className="text-right text-xs sm:text-sm text-gray-500 mt-1">
            {content.length} / 500 ตัวอักษร
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!rating || !content.trim() || isSubmitting}
          className={`bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base md:text-lg ${
            !rating || !content.trim() || isSubmitting 
              ? "opacity-50 cursor-not-allowed" 
              : ""
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <RefreshCw className="animate-spin mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              กำลังส่ง...
            </span>
          ) : (
            "ส่งรีวิว"
          )}
        </Button>
      </div>

      {/* Review Statistics */}
      {reviews.length > 0 && (
        <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-800 dark:text-white">รีวิวทั้งหมด</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{reviews.length} รีวิว</p>
            </div>
            <div className="flex items-center">
              <h3 className="text-base sm:text-lg font-medium text-gray-800 dark:text-white">Rating : </h3>
               
              <span className="ml-2 font-medium text-gray-800 dark:text-white text-sm sm:text-base">
                {(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4 sm:space-y-6">
        {reviews.map((review) => (
          <div 
            key={review.id} 
            className="border-2 border-gray-100 dark:border-gray-700 p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
          >
            <div className="flex justify-between">
              <div className="flex items-center gap-3 sm:gap-4 mb-3">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
                  <Image
                    src={review.profile.profileImage || '/default-avatar.png'}
                    alt={review.profile.firstname}
                    fill
                    className="rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                  />
                </div>
                <div>
                  <p className="font-medium text-base sm:text-lg text-gray-800 dark:text-white">
                    {review.profile.firstname} {review.profile.lastname}
                  </p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                    <span className="ml-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mt-3 mb-4 text-sm sm:text-base md:text-lg">{review.content}</p>
            
            <div className="flex items-center justify-between mt-4 border-t pt-3 border-gray-100 dark:border-gray-700">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => toggleReplyForm(review.id)}
                className="text-blue-600 hover:text-blue-700 flex items-center text-xs sm:text-sm"
              >
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {review.replies.length > 0 ? `${review.replies.length} ตอบกลับ` : "ตอบกลับ"}
              </Button>
            </div>

            {/* แสดง Reply ของรีวิวนี้ */}
            {review.replies && review.replies.length > 0 && (
              <div className="ml-8 sm:ml-12 mt-4 space-y-3">
                {review.replies.map(reply => (
                  <div key={reply.id} className="border-l-2 border-blue-100 dark:border-blue-900 pl-3 sm:pl-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-r-lg">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <div className="relative w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
                        <Image
                          src={reply.profile.profileImage || '/default-avatar.png'}
                          alt={reply.profile.firstname}
                          fill
                          className="rounded-full object-cover border border-gray-200 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-white">
                          {reply.profile.firstname} {reply.profile.lastname}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(reply.createAt).toLocaleDateString("th-TH", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <p className="ml-8 sm:ml-11 text-gray-700 dark:text-gray-300 text-xs sm:text-sm">{reply.contain}</p>
                  </div>
                ))}
              </div>
            )}

            {/* ฟอร์มตอบกลับ */}
            {showReplyForms[review.id] && (
              <div className="ml-8 sm:ml-12 mt-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <Textarea
                  rows={2}
                  placeholder="เขียนความคิดเห็นของคุณ..."
                  value={replyContent[review.id] || ""}
                  onChange={(e) =>
                    setReplyContent((prev) => ({
                      ...prev,
                      [review.id]: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-200 dark:border-gray-600 rounded text-gray-800 dark:text-white dark:bg-gray-800 text-xs sm:text-sm"
                />
                <div className="mt-2 flex justify-end">
                  <Button
                    onClick={(e) => handleReplySubmit(e as React.FormEvent, review.id)}
                    size="sm"
                    disabled={!replyContent[review.id]?.trim() || isReplying[review.id]}
                    className={`bg-blue-600 hover:bg-blue-700 text-white rounded-full px-3 sm:px-4 text-xs sm:text-sm ${
                      !replyContent[review.id]?.trim() || isReplying[review.id] 
                        ? "opacity-50 cursor-not-allowed" 
                        : ""
                    }`}
                  >
                    {isReplying[review.id] ? (
                      <span className="flex items-center">
                        <RefreshCw className="animate-spin mr-1 w-3 h-3 sm:w-4 sm:h-4" />
                        กำลังส่ง...
                      </span>
                    ) : (
                      "ส่งความคิดเห็น"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-8 sm:py-12 bg-gray-50 dark:bg-gray-700 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
            <MessageCircle className="mx-auto text-gray-400 w-10 h-10 sm:w-12 sm:h-12 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base md:text-lg">
              ยังไม่มีรีวิว เป็นคนแรกที่แชร์ประสบการณ์ของคุณ!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;