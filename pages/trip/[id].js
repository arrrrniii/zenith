// pages/trip/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import TripDetail from '@/components/client/trips/TripDetail';
import { tripData as mockTripData } from '@/utils/mockData';

const TripPage = ({ tripData }) => {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if the trip is saved in localStorage on mount
  useEffect(() => {
    try {
      const savedTrips = JSON.parse(localStorage.getItem('savedTrips') || '[]');
      setIsSaved(savedTrips.includes(tripData?.id));
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading saved trips:', error);
      setIsLoading(false);
    }
  }, [tripData?.id]);

  if (router.isFallback || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading experience details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button 
            onClick={() => router.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!tripData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Experience Not Found</h2>
          <p className="mt-2 text-gray-600">The experience you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    try {
      const savedTrips = JSON.parse(localStorage.getItem('savedTrips') || '[]');
      let newSavedTrips;
      
      if (isSaved) {
        newSavedTrips = savedTrips.filter(id => id !== tripData.id);
      } else {
        newSavedTrips = [...savedTrips, tripData.id];
      }
      
      localStorage.setItem('savedTrips', JSON.stringify(newSavedTrips));
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error saving trip:', error);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: tripData.title,
          text: tripData.description,
          url: window.location.href
        });
      } else {
        // Fallback copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleBook = () => {
    // You could add analytics tracking here
    console.log('Booking:', tripData.title);
    
    // Store booking attempt in recent activity
    try {
      const recentActivity = JSON.parse(localStorage.getItem('recentActivity') || '[]');
      recentActivity.unshift({
        type: 'booking_attempt',
        tripId: tripData.id,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('recentActivity', JSON.stringify(recentActivity.slice(0, 10)));
    } catch (error) {
      console.error('Error storing recent activity:', error);
    }

    // Proceed with booking
    router.push(`/checkout/${tripData.id}`);
  };

  return (
    <>
      <Head>
        <title>{`${tripData.title} - Chicago Tours`}</title>
        <meta name="description" content={tripData.description} />
        <meta property="og:title" content={tripData.title} />
        <meta property="og:description" content={tripData.description} />
        <meta property="og:image" content={tripData.images[0]} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://yourdomain.com/trip/${tripData.id}`} />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          <TripDetail
            {...tripData}
            onSave={handleSave}
            onShare={handleShare}
            onBook={handleBook}
            isSaved={isSaved}
            location={tripData.location}
            category={tripData.category}
            tripStyle={tripData.tripStyle}
            similarTrips={tripData.similarTrips}
          />
        </main>
      </div>
    </>
  );
};

export async function getServerSideProps({ params }) {
  try {
    // In a real application, you would fetch data from an API here
    // For now, we're using mock data and filtering by ID
    const tripId = params.id;
    
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));

    // In real application, you would fetch specific trip by ID
    // For mock data, we're just returning the single mock trip
    // You could add more mock trips and filter by ID if needed
    const tripData = mockTripData;

    // Validate trip exists and matches requested ID
    if (!tripData || tripData.id !== tripId) {
      return { notFound: true };
    }

    return {
      props: {
        tripData
      }
    };
  } catch (error) {
    console.error('Error fetching trip data:', error);
    return { notFound: true };
  }
}

export default TripPage;