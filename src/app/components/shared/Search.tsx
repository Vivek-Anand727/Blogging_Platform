"use client";

import { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";

interface Post {
  _id: string;
  title: string;
  content: string;
}

export default function Search({ onSelect }: { onSelect: (postId: string) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Post[]>([]);
  const [showDropdown, setShowDropDown] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?query=${query}`);
        const data = await res.json();
        setResults(data.searchResults || []);
      } catch (error) {
        console.error("Search error:", error);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="relative w-64">
      {/* Search Bar */}
      <div className="flex items-center bg-gray-800 px-3 py-2 rounded-lg border border-gray-700">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropDown(true)}
          onBlur={() => setTimeout(() => setShowDropDown(false), 300)}
          placeholder="Search..."
          className="w-full bg-transparent text-white outline-none"
        />
        <SearchIcon className="w-5 h-5 text-gray-400" />
      </div>

      {/* Search Dropdown */}
      {showDropdown && results.length > 0 && (
        <ul className="absolute left-0 w-full mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
          {results.map((post) => (
            <li
            key={post._id}
            onClick={() => {
              onSelect(post._id);
            }}
            className="px-4 py-2 hover:bg-gray-800 cursor-pointer"
          >
            {post.title}
          </li>
          
          ))}
        </ul>
      )}
    </div>
  );
}
