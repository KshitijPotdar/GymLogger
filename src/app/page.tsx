export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-6">GymLogger</h1>
        <p className="text-xl text-blue-100 mb-8">Track your workouts, achieve your goals</p>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a
            href="/login"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Login
          </a>
          <a
            href="/dashboard"
            className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
          >
            View Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
