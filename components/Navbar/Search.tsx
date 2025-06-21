'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "../ui/input"
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { Search as SearchIcon } from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from 'use-debounce';

const Search = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { userId } = useAuth();
  const [search, setSearch] = useState(searchParams.get('search')?.toString() || '')
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedValue] = useDebounce(search, 500);

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
      
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set('search', value);
        // Save search history when performing a search
        try {
          await saveSearchHistory(value);
        } catch (error) {
          console.error('Error saving search history:', error);
        }
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

  useEffect(() => {
    performSearch(debouncedValue);
  }, [debouncedValue]);

  useEffect(() => {
    if (!searchParams.get('search')) {
      setSearch('');
    }
  }, [searchParams]);

  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full flex justify-center gap-2">
      <Input
        type="text"
        placeholder="ค้นหาสถานที่..."
        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl h-9 sm:h-10 text-sm sm:text-base"
        onChange={(e) => {
          const value = e.target.value;
          setSearch(value);
        }}
        value={search}
      />
      <Button type="submit" size="icon" className="shrink-0 h-9 sm:h-10 w-9 sm:w-10" disabled={isSearching}>
        <SearchIcon className={`h-4 w-4 ${isSearching ? 'animate-spin' : ''}`} />
      </Button>
    </form>
  );
};

export default Search;