"use client"; // Render the page client-side

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="w-full max-w-4xl p-8">
        
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          RSVP Fast Reader
        </h1>
        
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          This is a reader that implements the Rapid Serial Visual Presentation (RSVP) technique to help you read faster.
        </p>
        
      </main>
    </div>
  );
}
