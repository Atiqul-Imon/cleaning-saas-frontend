'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconButton } from '@/components/ui';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = 'Search...' }: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query);
      // You can add global search routing here
      // router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleBlur = () => {
    if (!query) {
      setIsExpanded(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      {isExpanded ? (
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={handleBlur}
              placeholder={placeholder}
              autoFocus
              className="w-64 px-4 py-2 pl-10 pr-10 rounded-lg border-2 border-[var(--gray-300)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-[var(--primary-600)] text-sm transition-all"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--gray-400)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--gray-400)] hover:text-[var(--gray-600)]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      ) : (
        <IconButton
          type="button"
          variant="ghost"
          size="md"
          onClick={() => setIsExpanded(true)}
          aria-label="Search"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </IconButton>
      )}
    </form>
  );
}


