import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import AddToCartButton from '@/components/AddToCartButton';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: true,
      brand: true,
      images: { orderBy: { order: 'asc' } }
    }
  });

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.'
    };
  }

  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];

  return {
    title: product.seoTitle || `${product.name} | Ecom`,
    description: product.seoDescription || product.shortDescription || product.description,
    keywords: product.seoKeywords,
    openGraph: {
      title: product.name,
      description: product.shortDescription || product.description,
      images: primaryImage ? [primaryImage.url] : [],
      type: 'website',
      url: `https://www.ecom.com/products/${product.slug}`,
      siteName: 'Ecom',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.shortDescription || product.description,
      images: primaryImage ? [primaryImage.url] : [],
    }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // Fetch product with all related data
  const product = await prisma.product.findUnique({
    where: { 
      slug,
      isActive: true 
    },
    include: {
      category: true,
      brand: true,
      manufacturer: true,
      images: {
        orderBy: { order: 'asc' }
      },
      variants: {
        where: { isActive: true },
        orderBy: { createdAt: 'asc' }
      },
      tags: {
        include: {
          tag: true
        }
      },
      discounts: {
        where: {
          isActive: true,
          OR: [
            { startDate: null },
            { startDate: { lte: new Date() } }
          ],
          AND: [
            {
              OR: [
                { endDate: null },
                { endDate: { gte: new Date() } }
              ]
            }
          ]
        }
      },
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      },
      _count: {
        select: {
          reviews: true,
          orderItems: true
        }
      }
    }
  });

  if (!product) {
    notFound();
  }

  // Calculate metrics
  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0;

  const activeDiscount = product.discounts[0];
  const discountedPrice = activeDiscount 
    ? activeDiscount.type === 'PERCENTAGE'
      ? Number(product.price) * (1 - Number(activeDiscount.value) / 100)
      : Number(product.price) - Number(activeDiscount.value)
    : null;

  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  const otherImages = product.images.filter(img => !img.isPrimary);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/20">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <nav className="flex text-sm text-gray-600">
            <Link href="/" className="interactive-hover transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="interactive-hover transition-colors">
              Products
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/category/${product.category.slug}`} className="interactive-hover transition-colors">
              {product.category.name}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl shadow-lg overflow-hidden group">
              {primaryImage ? (
                <Image
                  src={primaryImage.url}
                  alt={primaryImage.alt || product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
              
              {/* Discount Badge */}
              {activeDiscount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {activeDiscount.type === 'PERCENTAGE' ? `-${activeDiscount.value}% OFF` : `₹${activeDiscount.value} OFF`}
                </div>
              )}
              
              {/* Featured Badge */}
              {product.isFeatured && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Featured
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {otherImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {otherImages.slice(0, 4).map((image, index) => (
                  <div key={image.id} className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                    <Image
                      src={image.url}
                      alt={image.alt || `${product.name} ${index + 2}`}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Brand */}
            {product.brand && (
              <div className="inline-block">
                <span 
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: 'var(--color-primary-50, rgba(112, 132, 61, 0.1))',
                    color: 'var(--ui-interactive-hover, #70843d)'
                  }}
                >
                  {product.brand.name}
                </span>
              </div>
            )}

            {/* Product Name */}
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-xl text-gray-600 leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            {/* Reviews */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {averageRating.toFixed(1)} ({product._count.reviews} reviews)
                </span>
              </div>
              
              {product._count.orderItems > 0 && (
                <span 
                  className="text-sm font-medium"
                  style={{ color: 'var(--ui-interactive-hover, #70843d)' }}
                >
                  {product._count.orderItems} sold
                </span>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{discountedPrice ? discountedPrice.toFixed(2) : product.price.toString()}
                </span>
                {discountedPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product.price.toString()}
                  </span>
                )}
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="text-sm text-gray-500">
                    Compare at ₹{product.comparePrice.toString()}
                  </span>
                )}
              </div>
              
              {activeDiscount && (
                <p className="text-sm text-red-600 font-medium">
                  You save ₹{(Number(product.price) - (discountedPrice || Number(product.price))).toFixed(2)}!
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {product.quantity > 0 ? (
                <>
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: 'var(--ui-status-inStock, #22c55e)' }}
                  ></div>
                  <span 
                    className="font-medium status-in-stock"
                  >
                    In Stock ({product.quantity} available)
                  </span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-700 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Product Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tagRelation) => (
                  <span
                    key={tagRelation.tag.id}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tagRelation.tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Add to Cart Section */}
            <div className="pt-6 border-t">
              <AddToCartButton
                productId={product.id}
                productName={product.name}
                maxQuantity={product.quantity}
                disabled={product.quantity === 0}
              />
            </div>

            {/* Product Info */}
            <div className="space-y-3 pt-6 border-t">
              {product.sku && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">SKU:</span>
                  <span className="text-gray-900 font-medium">{product.sku}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Category:</span>
                <Link href={`/category/${product.category.slug}`} className="interactive-hover font-medium">
                  {product.category.name}
                </Link>
              </div>
              
              {product.weight && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Weight:</span>
                  <span className="text-gray-900 font-medium">
                    {product.weight.toString()} {product.weightUnit.toLowerCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Description & Details */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Description</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Additional Information */}
            {(product.ingredients || product.allergens || product.storageInstructions) && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Information</h2>
                <div className="space-y-4">
                  {product.ingredients && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Ingredients</h3>
                      <p className="text-gray-700">{product.ingredients}</p>
                    </div>
                  )}
                  
                  {product.allergens && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Allergens</h3>
                      <p className="text-gray-700">{product.allergens}</p>
                    </div>
                  )}
                  
                  {product.storageInstructions && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Storage Instructions</h3>
                      <p className="text-gray-700">{product.storageInstructions}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reviews */}
            {product.reviews.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
                <div className="space-y-6">
                  {product.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span 
                            className="font-semibold"
                            style={{ color: 'var(--ui-interactive-hover, #70843d)' }}
                          >
                            {review.user.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{review.user.name || 'Anonymous'}</h4>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Certifications */}
            {product.certifications.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Certifications</h3>
                <div className="space-y-2">
                  {product.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping Info */}
            <div 
              className="rounded-2xl p-6"
              style={{
                background: 'linear-gradient(135deg, rgba(112, 132, 61, 0.05) 0%, rgba(123, 214, 60, 0.1) 100%)'
              }}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Shipping & Returns</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ui-interactive-hover, #70843d)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span>Free shipping on orders over ₹500</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ui-interactive-hover, #70843d)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>30-day return policy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--ui-interactive-hover, #70843d)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Same-day delivery available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
