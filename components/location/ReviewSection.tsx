"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import Image from 'next/image'
import { createReviewAction, createReplyAction } from '@/actions/actions'
import { useRouter } from 'next/navigation'

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
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyContent, setReplyContent] = useState<{ [reviewId: string]: string }>({});
  const [isReplying, setIsReplying] = useState<{ [reviewId: string]: boolean }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await createReviewAction(locationId, rating, content);
      setRating(0);
      setContent("");
      router.refresh();
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent, reviewId: string) => {
    e.preventDefault();

    const content = replyContent[reviewId]?.trim();
    if (!content) return;

    setIsReplying(prev => ({ ...prev, [reviewId]: true }));
    try {
      await createReplyAction(reviewId, content);
      setReplyContent(prev => ({ ...prev, [reviewId]: "" }));
      router.refresh();
    } catch (error) {
      console.error("Error submitting reply:", error);
    } finally {
      setIsReplying(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  if (!userId) {
    return (
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">รีวิว</h2>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">กรุณาเข้าสู่ระบบเพื่อเข้าถึงรีวิว</p>
          <SignInButton mode="modal">
            <Button>เข้าสู่ระบบ</Button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">รีวิว</h2>

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium  mb-2">
            ให้คะแนน
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-6 h-6 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium  mb-2">
            รีวิว
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full border p-2 rounded"
            placeholder="เขียนรีวิวของคุณที่นี่..."
          />
        </div>

        <button
          type="submit"
          disabled={!rating || !content.trim() || isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isSubmitting ? "กำลังส่ง..." : "ส่งรีวิว"}
        </button>
      </form>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-2 p-4 rounded-lg shadow">
            <div className="flex items-center gap-4 mb-2">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={review.profile.profileImage || '/default-avatar.png'}
                  alt={review.profile.firstname}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium">
                  {review.profile.firstname} {review.profile.lastname}
                </p>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p>{review.content}</p>
            <p className="text-sm mt-2">
              {new Date(review.createdAt).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            {/* แสดง Reply ของรีวิวนี้ */}
            {review.replies && review.replies.length > 0 && (
              <div className="ml-12 mt-2">
                {review.replies.map(reply => (
                  <div key={reply.id} className="border-l-2 pl-4 mb-2">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="relative w-8 h-8 flex-shrink-0">
                        <Image
                          src={reply.profile.profileImage || '/default-avatar.png'}
                          alt={reply.profile.firstname}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {reply.profile.firstname} {reply.profile.lastname}
                        </p>
                      </div>
                    </div>
                    <p className="ml-11">{reply.contain}</p>
                    <p className="text-xs text-gray-500 ml-11">
                      {new Date(reply.createAt).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* ฟอร์มตอบกลับ */}
            <form onSubmit={(e) => handleReplySubmit(e, review.id)} className="ml-12 mt-3">
              <Textarea
                rows={2}
                placeholder="ตอบกลับรีวิวนี้..."
                value={replyContent[review.id] || ""}
                onChange={(e) =>
                  setReplyContent((prev) => ({
                    ...prev,
                    [review.id]: e.target.value,
                  }))
                }
              />
              <div className="mt-1">
                <Button
                  type="submit"
                  size="sm"
                  disabled={!replyContent[review.id]?.trim() || isReplying[review.id]}
                >
                  {isReplying[review.id] ? "กำลังส่ง..." : "ส่งตอบกลับ"}
                </Button>
              </div>
            </form>
          </div>
        ))}

        {reviews.length === 0 && (
          <p className="text-center py-4">
            ยังไม่มีรีวิว
          </p>
        )}
      </div>
    </div>
  );
};

export default ReviewSection; 