const Blog = () => {
  return (
    <div className="max-w-5xl mx-auto py-16 px-8">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-white">
        Latest Blog Posts
      </h1>

      {/* Blog Post List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="p-6 bg-gray-900 border border-gray-700 rounded-xl shadow-md transition-all duration-300 hover:scale-105 hover:border-purple-500">
          <h2 className="text-2xl font-semibold text-white">Post Title</h2>
          <p className="text-gray-400 mt-3">
            Short description of the post...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Blog;
