'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  sku?: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  quantity: number;
  minQuantity: number;
  weight?: number;
  weightUnit: string;
  dimensions?: any;
  isActive: boolean;
  isFeatured: boolean;
  isDigital: boolean;
  requiresShipping: boolean;
  trackInventory: boolean;
  allowBackorder: boolean;
  nutritionChart?: string;
  expiryDate?: string;
  shelfLife?: number;
  storageInstructions?: string;
  ingredients?: string;
  allergens?: string;
  certifications: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  brand?: {
    id: string;
    name: string;
    slug: string;
  };
  manufacturer?: {
    id: string;
    name: string;
    slug: string;
  };
  images: Array<{
    id: string;
    url: string;
    alt?: string;
    isPrimary: boolean;
    order: number;
  }>;
  variants: Array<{
    id: string;
    name: string;
    value: string;
    price: number;
    sku?: string;
    quantity: number;
    isActive: boolean;
  }>;
  tags: Array<{
    id: string;
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  discounts: Array<{
    id: string;
    name: string;
    discountType: string;
    discountValue: number;
    discountPercentage: number;
    startDate?: string;
    endDate?: string;
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
      id: string;
      name?: string;
    };
  }>;
  averageRating: number;
  totalSales: number;
  reviewCount: number;
  cartCount: number;
}

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function AdminProductDetail({ params }: ProductPageProps) {
  const { status } = useSession();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productId, setProductId] = useState<string>('');

  useEffect(() => {
    const getParams = async () => {
      const { id } = await params;
      setProductId(id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin');
      return;
    }

    if (status === 'authenticated' && productId) {
      fetchProduct();
    }
  }, [status, router, productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/products/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data.product);
      } else if (response.status === 404) {
        setError('Product not found');
      } else {
        setError('Failed to fetch product');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async () => {
    if (!product) return;

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !product.isActive
        }),
      });

      if (response.ok) {
        setProduct({
          ...product,
          isActive: !product.isActive
        });
      }
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  const toggleFeatured = async () => {
    if (!product) return;

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isFeatured: !product.isFeatured
        }),
      });

      if (response.ok) {
        setProduct({
          ...product,
          isFeatured: !product.isFeatured
        });
      }
    } catch (error) {
      console.error('Error updating product featured status:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/admin/products"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <Link
            href="/admin/products"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/admin/products"
                className="text-gray-600 hover:text-gray-900 mb-2 inline-flex items-center"
              >
                ← Back to Products
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-gray-600 mt-1">Product Details & Management</p>
            </div>
            <div className="flex space-x-3">
              <Link
                href={`/products/${product.slug}`}
                target="_blank"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Public Page
              </Link>
              <Link
                href={`/admin/products/${productId}/edit`}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Edit Product
              </Link>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className={`text-lg font-semibold ${product.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
              <button
                onClick={toggleStatus}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.isActive 
                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
              >
                Toggle
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Featured</p>
                <p className={`text-lg font-semibold ${product.isFeatured ? 'text-amber-600' : 'text-gray-600'}`}>
                  {product.isFeatured ? 'Yes' : 'No'}
                </p>
              </div>
              <button
                onClick={toggleFeatured}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.isFeatured 
                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Toggle
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm font-medium text-gray-600">Stock</p>
            <p className={`text-lg font-semibold ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.quantity} units
            </p>
            {product.quantity <= product.minQuantity && product.quantity > 0 && (
              <p className="text-xs text-amber-600 mt-1">Low stock warning</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm font-medium text-gray-600">Sales</p>
            <p className="text-lg font-semibold text-gray-900">{product.totalSales}</p>
            <p className="text-xs text-gray-500 mt-1">Total orders</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Product Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <p className="text-gray-900">{product.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <p className="text-gray-600 font-mono text-sm">{product.slug}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <p className="text-gray-900">{product.sku || 'Not set'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <p className="text-gray-900">{product.category.name}</p>
                </div>
                {product.brand && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <p className="text-gray-900">{product.brand.name}</p>
                  </div>
                )}
                {product.manufacturer && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                    <p className="text-gray-900">{product.manufacturer.name}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing & Inventory</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <p className="text-lg font-semibold text-gray-900">₹{product.price}</p>
                </div>
                {product.comparePrice && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Compare Price</label>
                    <p className="text-gray-600">₹{product.comparePrice}</p>
                  </div>
                )}
                {product.costPrice && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price</label>
                    <p className="text-gray-600">₹{product.costPrice}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <p className="text-gray-900">{product.quantity} units</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Quantity</label>
                  <p className="text-gray-600">{product.minQuantity}</p>
                </div>
                {product.weight && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                    <p className="text-gray-900">{product.weight} {product.weightUnit.toLowerCase()}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Descriptions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Descriptions</h2>
              {product.shortDescription && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                  <p className="text-gray-900">{product.shortDescription}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-900 whitespace-pre-line">{product.description}</p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            {(product.ingredients || product.allergens || product.storageInstructions) && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Details</h2>
                <div className="space-y-4">
                  {product.ingredients && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>
                      <p className="text-gray-900">{product.ingredients}</p>
                    </div>
                  )}
                  {product.allergens && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Allergens</label>
                      <p className="text-gray-900">{product.allergens}</p>
                    </div>
                  )}
                  {product.storageInstructions && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Storage Instructions</label>
                      <p className="text-gray-900">{product.storageInstructions}</p>
                    </div>
                  )}
                  {product.shelfLife && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Shelf Life</label>
                      <p className="text-gray-900">{product.shelfLife} days</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SEO */}
            {(product.seoTitle || product.seoDescription || product.seoKeywords) && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">SEO Information</h2>
                <div className="space-y-4">
                  {product.seoTitle && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SEO Title</label>
                      <p className="text-gray-900">{product.seoTitle}</p>
                    </div>
                  )}
                  {product.seoDescription && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SEO Description</label>
                      <p className="text-gray-900">{product.seoDescription}</p>
                    </div>
                  )}
                  {product.seoKeywords && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SEO Keywords</label>
                      <p className="text-gray-900">{product.seoKeywords}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Images, Reviews, etc. */}
          <div className="space-y-6">
            {/* Product Images */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Images</h2>
              {product.images.length > 0 ? (
                <div className="space-y-4">
                  {primaryImage && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Primary Image</p>
                      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={primaryImage.url}
                          alt={primaryImage.alt || product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                  {product.images.filter(img => !img.isPrimary).length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Additional Images</p>
                      <div className="grid grid-cols-2 gap-2">
                        {product.images.filter(img => !img.isPrimary).map((image) => (
                          <div key={image.id} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src={image.url}
                              alt={image.alt || product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No images uploaded</p>
              )}
            </div>

            {/* Tags & Certifications */}
            {(product.tags.length > 0 || product.certifications.length > 0) && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Tags & Certifications</h2>
                {product.tags.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tagRelation) => (
                        <span
                          key={tagRelation.id}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                        >
                          {tagRelation.tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {product.certifications.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Certifications</p>
                    <div className="flex flex-wrap gap-2">
                      {product.certifications.map((cert, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews Summary</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Rating</span>
                  <div className="flex items-center">
                    <span className="text-lg font-semibold text-gray-900 mr-2">
                      {product.averageRating.toFixed(1)}
                    </span>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Reviews</span>
                  <span className="text-gray-900 font-medium">{product.reviewCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">In Carts</span>
                  <span className="text-gray-900 font-medium">{product.cartCount}</span>
                </div>
              </div>
            </div>

            {/* Product Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Settings</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Digital Product</span>
                  <span className={`px-2 py-1 rounded text-xs ${product.isDigital ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {product.isDigital ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Requires Shipping</span>
                  <span className={`px-2 py-1 rounded text-xs ${product.requiresShipping ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {product.requiresShipping ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Track Inventory</span>
                  <span className={`px-2 py-1 rounded text-xs ${product.trackInventory ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {product.trackInventory ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Allow Backorder</span>
                  <span className={`px-2 py-1 rounded text-xs ${product.allowBackorder ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                    {product.allowBackorder ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Timestamps</h2>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Created:</span>
                  <p className="text-sm text-gray-900">{new Date(product.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Last Updated:</span>
                  <p className="text-sm text-gray-900">{new Date(product.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
