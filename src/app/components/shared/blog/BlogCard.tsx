import Link from "next/link";

interface BlogCardProps {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  id,
  title,
  description,
  author,
  date,
}) => {
  return (
    <div className="bg-gray-800 text-white p-6 rounded-2xl shadow-lg transition-transform hover:scale-105 max-w-md w-full">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-300 mb-4">{description}</p>
      <div className="text-sm text-gray-400 mb-4">
        <span>By {author}</span> | <span>{date}</span>
      </div>
      <Link href={`/blog/${id}`} className="inline-block">
        <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg transition-all hover:bg-blue-600">
          Read More
        </button>
      </Link>
    </div>
  );
};

export default BlogCard;
