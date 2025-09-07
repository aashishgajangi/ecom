"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear any authentication tokens or session data
    // For now, just redirect to login page
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, Admin</span>
              <Link
                href="/admin/profile"
                className="text-blue-600 hover:text-blue-800"
              >
                Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">1</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Products</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-yellow-600">0</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Blog Posts</h3>
            <p className="text-3xl font-bold text-purple-600">0</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Users Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Users</h3>
            <div className="space-y-3">
              <Link
                href="/admin/users"
                className="block w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
              >
                Manage Users
              </Link>
              <Link
                href="/admin/users/create"
                className="block w-full text-left px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
              >
                Add New User
              </Link>
            </div>
          </div>

          {/* Products Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Products</h3>
            <div className="space-y-3">
              <Link
                href="/admin/products"
                className="block w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
              >
                Manage Products
              </Link>
              <Link
                href="/admin/products/create"
                className="block w-full text-left px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
              >
                Add New Product
              </Link>
              <Link
                href="/admin/categories"
                className="block w-full text-left px-4 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              >
                Manage Categories
              </Link>
            </div>
          </div>

          {/* Orders Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders</h3>
            <div className="space-y-3">
              <Link
                href="/admin/orders"
                className="block w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
              >
                View Orders
              </Link>
              <Link
                href="/admin/orders/pending"
                className="block w-full text-left px-4 py-2 bg-yellow-50 text-yellow-700 rounded-md hover:bg-yellow-100 transition-colors"
              >
                Pending Orders
              </Link>
            </div>
          </div>

          {/* Blog Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Blog</h3>
            <div className="space-y-3">
              <Link
                href="/admin/blog"
                className="block w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
              >
                Manage Posts
              </Link>
              <Link
                href="/admin/blog/create"
                className="block w-full text-left px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
              >
                Create Post
              </Link>
              <Link
                href="/admin/blog/categories"
                className="block w-full text-left px-4 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              >
                Blog Categories
              </Link>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
            <div className="space-y-3">
              <Link
                href="/admin/settings/general"
                className="block w-full text-left px-4 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              >
                General Settings
              </Link>
              <Link
                href="/admin/settings/payment"
                className="block w-full text-left px-4 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              >
                Payment Methods
              </Link>
              <Link
                href="/admin/settings/shipping"
                className="block w-full text-left px-4 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              >
                Shipping Settings
              </Link>
            </div>
          </div>

          {/* Database Tools */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tools</h3>
            <div className="space-y-3">
              <Link
                href="http://localhost:5555"
                target="_blank"
                className="block w-full text-left px-4 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors"
              >
                Prisma Studio
              </Link>
              <Link
                href="/admin/backup"
                className="block w-full text-left px-4 py-2 bg-orange-50 text-orange-700 rounded-md hover:bg-orange-100 transition-colors"
              >
                Database Backup
              </Link>
              <Link
                href="/admin/logs"
                className="block w-full text-left px-4 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              >
                System Logs
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
