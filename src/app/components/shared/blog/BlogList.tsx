import BlogCard from "./BlogCard";

const BlogList = () => {
  const blogs = [
    {
      id: "1",
      title: "Understanding Next.js",
      description: "A deep dive into the world of Next.js...",
      author: "John Doe",
      date: "April 2, 2025",
    },
    {
      id: "2",
      title: "The Power of React Hooks",
      description: "Learn how to use React hooks effectively...",
      author: "Jane Smith",
      date: "March 28, 2025",
    },
    {
      id: "3",
      title: "Mastering Tailwind CSS",
      description: "Build modern UIs with Tailwind CSS...",
      author: "Alice Johnson",
      date: "March 20, 2025",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {blogs.map((blog) => (
        <BlogCard
          key={blog.id}
          id={blog.id}
          title={blog.title}
          description={blog.description}
          author={blog.author}
          date={blog.date}
        />
      ))}
    </div>
  );
};

export default BlogList;
