"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin");
    }
  }, [status, router]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/admin");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-lg dark:text-white">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 dark:text-gray-300">Welcome, Admin</span>
              <Link
                href="/admin/profile"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">1</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Products</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">0</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">0</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Blog Posts</h3>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">0</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Users Management */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Users</h3>
            <div className="space-y-3">
              <Link
                href="/admin/users"
                className="block w-full text-left px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                Manage Users
              </Link>
              <Link
                href="/admin/users/create"
                className="block w-full text-left px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                Add New User
              </Link>
            </div>
          </div>

          {/* Products Management */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Products</h3>
            <div className="space-y-3">
              <Link
                href="/admin/products"
                className="block w-full text-left px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                Manage Products
              </Link>
              <Link
                href="/admin/products/create"
                className="block w-full text-left px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                Add New Product
              </Link>
              <Link
                href="/admin/categories"
                className="block w-full text-left px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                Manage Categories
              </Link>
            </div>
          </div>

          {/* Orders Management */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Orders</h3>
            <div className="space-y-3">
              <Link
                href="/admin/orders"
                className="block w-full text-left px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                View Orders
              </Link>
              <Link
                href="/admin/orders/pending"
                className="block w-full text-left px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-md hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
              >
                Pending Orders
              </Link>
            </div>
          </div>

          {/* Blog Management */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Blog</h3>
            <div className="space-y-3">
              <Link
                href="/admin/blog"
                className="block w-full text-left px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                Manage Posts
              </Link>
              <Link
                href="/admin/blog/create"
                className="block w-full text-left px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                Create Post
              </Link>
              <Link
                href="/admin/blog/categories"
                className="block w-full text-left px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                Blog Categories
              </Link>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Settings</h3>
            <div className="space-y-3">
              <Link
                href="/admin/settings/general"
                className="block w-full text-left px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                General Settings
              </Link>
              <Link
                href="/admin/settings/payment"
                className="block w-full text-left px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                Payment Methods
              </Link>
              <Link
                href="/admin/settings/shipping"
                className="block w-full text-left px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                Shipping Settings
              </Link>
            </div>
          </div>

          {/* Database Tools */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tools</h3>
            <div className="space-y-3">
              <Link
                href="http://localhost:5555"
                target="_blank"
                className="block w-full text-left px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                Prisma Studio
              </Link>
              <Link
                href="/admin/backup"
                className="block w-full text-left px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-md hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
              >
                Database Backup
              </Link>
              <Link
                href="/admin/logs"
                className="block w-full text-left px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
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
