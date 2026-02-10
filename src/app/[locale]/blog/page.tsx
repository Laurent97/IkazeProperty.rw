import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rwanda Property Blog - Real Estate Tips & Market Insights | IkazeProperty.rw',
  description: 'Expert insights on Rwanda real estate market, property investment tips, Kigali neighborhood guides, and legal advice for buying and selling property in Rwanda.',
  keywords: 'Rwanda real estate blog, Kigali property tips, Rwanda property investment, land buying Rwanda, Kigali neighborhoods, Rwanda construction, real estate laws Rwanda',
  openGraph: {
    title: 'Rwanda Property Blog - Expert Real Estate Insights',
    description: 'Stay updated with Rwanda real estate market trends, investment opportunities, and expert property advice.',
    type: 'website',
  },
}

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: 'Complete Guide to Buying Property in Kigali 2024',
      excerpt: 'Everything you need to know about purchasing real estate in Rwanda\'s capital city, from legal requirements to best neighborhoods.',
      category: 'Buying Guide',
      readTime: '8 min read',
      date: '2024-01-15',
      image: '/blog/kigali-property-guide.jpg',
      slug: 'complete-guide-buying-property-kigali-2024'
    },
    {
      id: 2,
      title: 'Top 10 Investment Opportunities in Rwandan Real Estate',
      excerpt: 'Discover the most profitable real estate investment opportunities across Rwanda, from Kigali apartments to agricultural land.',
      category: 'Investment',
      readTime: '6 min read',
      date: '2024-01-10',
      image: '/blog/rwanda-investment-opportunities.jpg',
      slug: 'top-10-investment-opportunities-rwanda-real-estate'
    },
    {
      id: 3,
      title: 'Understanding Rwanda Land Laws and Property Rights',
      excerpt: 'A comprehensive overview of land ownership laws, property rights, and regulations for foreign investors in Rwanda.',
      category: 'Legal',
      readTime: '10 min read',
      date: '2024-01-05',
      image: '/blog/rwanda-land-laws.jpg',
      slug: 'understanding-rwanda-land-laws-property-rights'
    },
    {
      id: 4,
      title: 'Best Neighborhoods to Live in Kigali 2024',
      excerpt: 'Explore Kigali\'s most desirable neighborhoods, from upscale Kiyovu to emerging areas like Nyarutarama and Gacuriro.',
      category: 'Neighborhoods',
      readTime: '7 min read',
      date: '2023-12-28',
      image: '/blog/kigali-neighborhoods.jpg',
      slug: 'best-neighborhoods-kigali-2024'
    },
    {
      id: 5,
      title: 'How to Finance Property Purchase in Rwanda',
      excerpt: 'Complete guide to mortgage options, bank financing, and payment plans for buying property in Rwanda.',
      category: 'Financing',
      readTime: '9 min read',
      date: '2023-12-20',
      image: '/blog/property-financing-rwanda.jpg',
      slug: 'finance-property-purchase-rwanda'
    },
    {
      id: 6,
      title: 'Rwanda Construction Boom: What It Means for Property Investors',
      excerpt: 'Analysis of Rwanda\'s rapid construction growth and its impact on property values and investment returns.',
      category: 'Market Analysis',
      readTime: '5 min read',
      date: '2023-12-15',
      image: '/blog/construction-boom-rwanda.jpg',
      slug: 'rwanda-construction-boom-property-investors'
    }
  ]

  const categories = ['All', 'Buying Guide', 'Investment', 'Legal', 'Neighborhoods', 'Financing', 'Market Analysis']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Rwanda Property Blog
            </h1>
            <p className="text-xl text-red-100 max-w-3xl mx-auto">
              Expert insights, market analysis, and practical guides for navigating Rwanda\'s real estate landscape
            </p>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category}>
                      <button
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          category === 'All'
                            ? 'bg-red-100 text-red-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Kigali', 'Investment', 'Land Laws', 'Mortgage', 'Neighborhoods'].map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-red-100 hover:text-red-700 cursor-pointer transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Blog Posts */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {blogPosts.map((post) => (
                  <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                          {post.category}
                        </span>
                        <span className="text-xs text-gray-500">{post.readTime}</span>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-3 hover:text-red-600 cursor-pointer">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{post.date}</span>
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                          Read More →
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-12">
                <button className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors">
                  Load More Articles
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
