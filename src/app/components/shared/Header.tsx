"use client";
import { ModeToggle } from "../ui/theme-toggle";
import Search from "./Search";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

  const handleSelect = (postId: string) => {
    router.push(`/blog/${postId}`);
  };

  return (
    <header className="py-2 px-6 bg-gray-900 text-white flex justify-between items-center shadow-md">
      
      <a href="https://github.com/Vivek-Anand727" target="_blank" rel="noopener noreferrer">
      <span className="text-2xl font-bold">
        <img src="/V.jpg" alt="Logo" className="h-10 w-auto" />
      </span>
      </a>

      <nav>
        <ul className="flex space-x-6 text-lg">
          <li>
            <a href="/" className="hover:text-gray-400 transition-colors">
              Home
            </a>
          </li>
          <li>
            <a
              href="/profile"
              className="hover:text-gray-400 transition-colors"
            >
              My Profile
            </a>
          </li>
          <li>
            <a
              href="/dashboard"
              className="hover:text-gray-400 transition-colors"
            >
              Dashboard
            </a>
          </li>
        </ul>
      </nav>

      <div className="relative flex items-center bg-gray-800 px-3 py-1 rounded-lg">
        <Search onSelect={handleSelect} />
      </div>

      <ModeToggle />
    </header>
  );
};

export default Header;
