import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="absolute top-16 text-3xl md:text-4xl font-bold text-gray-800 text-center">
        Hello SMAC Administrators! <br /> What would you like to do today?
      </h1>

      <div className="flex flex-grow items-center justify-center w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => router.push("/past-tests/upload")}
            className="w-64 h-64 bg-blue-600 text-white text-2xl font-semibold rounded-2xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center"
          >
            Upload New Problems
          </button>

          <button
            onClick={() => router.push("/userlist")}
            className="w-64 h-64 bg-green-600 text-white text-2xl font-semibold rounded-2xl shadow-lg hover:bg-green-700 transition-all flex items-center justify-center"
          >
            View User List
          </button>
        </div>
      </div>
    </div>
  );
}
