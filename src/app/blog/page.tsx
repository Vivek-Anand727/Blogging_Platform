const posts = [
    { id: 1, title: "Understanding Next.js", description: "Learn the basics of Next.js and why it's powerful." },
    { id: 2, title: "Optimizing Performance", description: "Tips on improving performance in a Next.js app." },
    { id: 3, title: "Server vs. Client Components", description: "Understand the difference between server & client components." },
  ];
  
  const Blog = () => {
    return (
      <div className="max-w-5xl mx-auto py-16 px-8">
        <h1 className="text-4xl font-extrabold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Latest Blog Posts
        </h1>
  
        {/* Blog Post Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-6 bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-2xl transition-transform transform hover:scale-105 hover:shadow-2xl"
            >
              <h2 className="text-2xl font-semibold text-white">{post.title}</h2>
              <p className="text-gray-300 mt-3">{post.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Blog;
  
  