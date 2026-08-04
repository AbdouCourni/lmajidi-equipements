// src/app/europmat/admin/dashboard/page.tsx

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">
            Products
          </h2>
          <p className="text-gray-500">
            Manage your products
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">
            Categories
          </h2>
          <p className="text-gray-500">
            Manage your categories
          </p>
        </div>

      </div>

    </div>
  );
}