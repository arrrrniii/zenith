// /pages/search.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Search, MapPin, Calendar, Book, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@apollo/client';

import {
  GET_FILTERED_TOURS,
  GET_FILTERED_PLACES,
  GET_FILTERED_BLOGS
} from '../graphql/queries';

const SearchPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('discover');

  // read `q` and `tab` from query
  useEffect(() => {
    const { q, tab } = router.query;
    if (q) setSearchQuery(q);
    if (tab) setActiveTab(tab);
  }, [router.query]);

  // 1) GET_FILTERED_TOURS
  const {
    data: toursData,
    loading: toursLoading,
    error: toursError,
  } = useQuery(GET_FILTERED_TOURS, {
    variables: {
      where: {
        _or: [
          { title: { _ilike: `%${searchQuery.toLowerCase()}%` } },
          { description: { _ilike: `%${searchQuery.toLowerCase()}%` } },
        ],
        status: { _eq: 'active' },
      },
      limit: 20,
    },
    skip: activeTab !== 'tours' && activeTab !== 'discover',
  });

  // 2) GET_FILTERED_PLACES
  const {
    data: placesData,
    loading: placesLoading,
    error: placesError,
  } = useQuery(GET_FILTERED_PLACES, {
    variables: {
      where: {
        _or: [
          { name: { _ilike: `%${searchQuery}%` } },
          { description: { _ilike: `%${searchQuery}%` } },
        ],
        status: { _eq: 'open' },
      },
      limit: 20,
    },
    skip: activeTab !== 'places' && activeTab !== 'discover',
  });

  // 3) GET_FILTERED_BLOGS
  const {
    data: blogsData,
    loading: blogsLoading,
    error: blogsError,
  } = useQuery(GET_FILTERED_BLOGS, {
    variables: {
      where: {
        _or: [
          { title: { _ilike: `%${searchQuery}%` } },
          { description: { _ilike: `%${searchQuery}%` } },
        ],
        status: { _eq: 'PUBLISHED' },
      },
      limit: 20,
    },
    skip: activeTab !== 'discover', // only show on the 'all' tab
  });

  // combined loading
  const loading = toursLoading || placesLoading || blogsLoading;

  // if we have data
  const tours = toursData?.tours || [];
  const places = placesData?.attractions || [];
  const blogs = blogsData?.blogs || [];

  // If "discover", show tours, places, blogs
  // If "tours", only tours
  // If "places", only places
  const hasResults =
    (activeTab === 'discover' && (tours.length > 0 || places.length > 0 || blogs.length > 0)) ||
    (activeTab === 'tours' && tours.length > 0) ||
    (activeTab === 'places' && places.length > 0);

  const tabs = [
    { id: 'discover', label: 'All', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'tours', label: 'Tours', icon: <Calendar className="w-4 h-4" /> },
    { id: 'places', label: 'Places', icon: <MapPin className="w-4 h-4" /> },
  ];

  const handleBack = () => {
    router.push('/');
  };

  // A small card for each item
  const ResultCard = ({ item, type }) => {
    let linkHref = '#';
    if (type === 'tour') {
      // e.g. /trip/<id>
      linkHref = `/trip/${item.id}`;
    } else if (type === 'place') {
      // e.g. /attractions/<id>
      linkHref = `/attractions/${item.id}`;
    } else if (type === 'blog') {
      // e.g. /blog/<slug>
      linkHref = `/blog/${item.slug}`;
    }

    return (
      <Link href={linkHref}>
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 cursor-pointer">
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4">
            <img
              src={
                type === 'tour'
                  ? item.main_image_url || '/placeholder.jpg'
                  : type === 'place'
                  ? item.attraction_images?.[0]?.image_url || '/placeholder.jpg'
                  : item.thumbnail_url || '/blog-placeholder.jpg'
              }
              alt={item.title || item.name || 'Result'}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {type === 'tour' && <Calendar className="w-4 h-4 text-gray-500" />}
              {type === 'place' && <MapPin className="w-4 h-4 text-gray-500" />}
              {type === 'blog' && <Book className="w-4 h-4 text-gray-500" />}
              <span className="text-sm text-gray-500 capitalize">{type}</span>
            </div>
            <h3 className="font-semibold text-lg">
              {type === 'place' ? item.name : item.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {item.description}
            </p>
          </div>
        </div>
      </Link>
    );
  };

  const NoResults = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No results found</h3>
      <p className="text-gray-500 max-w-md mx-auto">
        We couldn't find anything matching "{searchQuery}".
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="p-8">
        <button onClick={handleBack} className="mb-4 p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <p>Loading search results...</p>
      </div>
    );
  }

  if (toursError || placesError || blogsError) {
    return (
      <div className="p-8">
        <button onClick={handleBack} className="mb-4 p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <p className="text-red-600">Error loading search results.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-lg font-medium">
                <Search className="w-5 h-5" />
                <span>
                  {searchQuery ? `Results for "${searchQuery}"` : 'Search Results'}
                </span>
              </div>
            </div>
          </div>
          {/* Tabs */}
          <div className="mt-4 flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  // Also push to the URL so user can share the link
                  router.push({
                    pathname: '/search',
                    query: { q: searchQuery, tab: tab.id },
                  });
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${
                    activeTab === tab.id
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!hasResults ? (
          <NoResults />
        ) : (
          <>
            {activeTab === 'discover' && (
              <>
                {tours.length > 0 && (
                  <div className="space-y-4 mb-8">
                    <h2 className="text-2xl font-semibold">Tours</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {tours.map((tour) => (
                        <ResultCard key={tour.id} item={tour} type="tour" />
                      ))}
                    </div>
                  </div>
                )}
                {places.length > 0 && (
                  <div className="space-y-4 mb-8">
                    <h2 className="text-2xl font-semibold">Places</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {places.map((place) => (
                        <ResultCard key={place.id} item={place} type="place" />
                      ))}
                    </div>
                  </div>
                )}
                {blogs.length > 0 && (
                  <div className="space-y-4 mb-8">
                    <h2 className="text-2xl font-semibold">Travel Stories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {blogs.map((blog) => (
                        <ResultCard key={blog.id} item={blog} type="blog" />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'tours' && tours.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tours.map((tour) => (
                  <ResultCard key={tour.id} item={tour} type="tour" />
                ))}
              </div>
            )}

            {activeTab === 'places' && places.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {places.map((place) => (
                  <ResultCard key={place.id} item={place} type="place" />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
