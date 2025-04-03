// /components/ui/Navbar/Navbar.tsx

import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import { ModeToggle } from "../ui/theme-toggle";

const Header = () => {
  return (
    <header className="py-4 px-6 bg-gray-900 text-white flex justify-between items-center shadow-md">
      <span className="text-xl font-semibold">Logo</span>
      <nav>
        <ul className="flex space-x-4">
          <li><a href="#" className="hover:text-gray-300">Home</a></li>
          <li><a href="#" className="hover:text-gray-300">Posts</a></li>
          <li><a href="#" className="hover:text-gray-300">Contact</a></li>
        </ul>
      </nav>
      <ModeToggle /> 
    </header>
  );
};

export default Header;
