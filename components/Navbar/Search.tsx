'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "../ui/input"
import { useEffect, useState } from "react";
import { useDebouncedCallback } from 'use-debounce'

const Search = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState(searchParams.get('search')?.toString() || '')
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = (value: string) => {
    try {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set('search', value);
      } else {
        params.delete('search');
      }
      router.push(`/?${params.toString()}`);
    } catch (error) {
      console.error('Error updating search params:', error);
    }
  };

  const handleSearch = useDebouncedCallback((value: string) => {
    console.log('Searching for:', value);
    performSearch(value);
  }, 300);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with:', search);
    performSearch(search);
  };

  useEffect(() => {
    if (!searchParams.get('search')) {
      setSearch('');
    }
  }, [searchParams]);

  return (
    <form onSubmit={handleSubmit} className="w-full flex justify-center">
      <Input
        type="text"
        placeholder="Search Location..."
        className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mx-auto"
        onChange={(e) => {
          const value = e.target.value;
          setSearch(value);
          handleSearch(value);
          console.log('Input value:', value);
        }}
        value={search}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(search);
          }
        }}
      />
    </form>
  );
};

export default Search;