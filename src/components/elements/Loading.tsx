
const Loading = () => {
    return (
    <div className="min-h-screen rounded-2xl border border-blue-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* spinner */}
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-900 dark:border-gray-100"></div>
      </div>
    </div>
  );
}

export default Loading