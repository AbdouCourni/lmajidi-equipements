// src/app/test-css/page.tsx
export default function TestCSSPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        CSS Test Page - This should be RED
      </h1>
      
      <div className="bg-blue-500 text-white p-4 rounded-lg mb-4">
        This box should have BLUE background
      </div>
      
      <div className="flex gap-4">
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Green Button
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded">
          Red Button
        </button>
      </div>
      
      <div className="mt-8 p-4 border-2 border-purple-500">
        This should have PURPLE border
      </div>
    </div>
  );
}