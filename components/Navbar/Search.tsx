'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "../ui/input"
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { Search as SearchIcon } from "lucide-react";
import { toast } from "sonner";

interface SearchAnalysis {
  category: string;
  keywords: string[];
  suggestions: string[];
  district: string;
  isValid: boolean;
  reason: string;
}

const Search = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { userId } = useAuth();
  const [search, setSearch] = useState(searchParams.get('search')?.toString() || '')
  const [isSearching, setIsSearching] = useState(false);
  const [analysis, setAnalysis] = useState<SearchAnalysis | null>(null);

  const analyzeSearch = async (query: string) => {
    try {
      const response = await fetch('/api/search/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze search');
      }

      const data = await response.json();
      setAnalysis(data);

      // ถ้าไม่ใช่คำค้นหาที่เกี่ยวข้องกับบุรีรัมย์
      if (!data.isValid) {
        toast.warning('คำค้นหานี้อาจไม่เกี่ยวข้องกับบุรีรัมย์', {
          description: data.reason,
        });
      }

      // ถ้ามีคำแนะนำ
      if (data.suggestions && data.suggestions.length > 0) {
        toast.info('คำค้นหาที่แนะนำ', {
          description: data.suggestions.join(', '),
        });
      }

      return data;
    } catch (error) {
      console.error('Error analyzing search:', error);
      return null;
    }
  };

  const saveSearchHistory = async (query: string) => {
    if (!userId || !query.trim()) return;
    
    try {
      await fetch('/api/search/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const performSearch = async (value: string) => {
    try {
      setIsSearching(true);
      
      // วิเคราะห์คำค้นหา
      const analysis = await analyzeSearch(value);
      
      // ถ้าไม่ใช่คำค้นหาที่เกี่ยวข้องกับบุรีรัมย์ และมีคำแนะนำ
      if (analysis && !analysis.isValid && analysis.suggestions.length > 0) {
        // ใช้คำแนะนำแรกในการค้นหา
        value = analysis.suggestions[0];
      }

      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set('search', value);
        // Save search history when performing a search
        saveSearchHistory(value);
      } else {
        params.delete('search');
      }
      router.push(`/?${params.toString()}`);
    } catch (error) {
      console.error('Error updating search params:', error);
      toast.error('เกิดข้อผิดพลาดในการค้นหา');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with:', search);
    performSearch(search);
  };

  useEffect(() => {
    if (!searchParams.get('search')) {
      setSearch('');
      setAnalysis(null);
    }
  }, [searchParams]);

  return (
    <form onSubmit={handleSubmit} className="w-full flex justify-center gap-2">
      <Input
        type="text"
        placeholder="Search Location..."
        className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl"
        onChange={(e) => {
          const value = e.target.value;
          setSearch(value);
        }}
        value={search}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(search);
          }
        }}
      />
      <Button type="submit" size="icon" className="shrink-0" disabled={isSearching}>
        <SearchIcon className={`h-4 w-4 ${isSearching ? 'animate-spin' : ''}`} />
      </Button>
    </form>
  );
};

export default Search;