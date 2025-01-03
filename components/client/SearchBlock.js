import React, { useState, useEffect } from 'react';
import { Search, Map, Compass, TrendingUp, X } from 'lucide-react';
import { useRouter } from 'next/router';

// How many days until our saved searches expire
const EXPIRY_DAYS = 7; 
const MS_IN_DAY = 24 * 60 * 60 * 1000;

const ModernSearchBar = ({
  externalSearchQuery = '',
  setExternalSearchQuery = () => {},
  activeTab = 'discover',
  setActiveTab = () => {},
  onSearchSubmit = () => {}, // optional callback
}) => {
  const router = useRouter();

  const [isFocused, setIsFocused] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  // The actual search input text
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery);

  // We'll store and manage all user-saved searches
  const [popularSearches, setPopularSearches] = useState([]);

  // “Typing” animation phrases
  const phrases = [
    "Where to?",
    "Ready to explore?",
    "Need inspiration?",
    "Want adventure?",
    "Looking for fun?"
  ];

  // Tabs
  const tabs = [
    { id: 'discover', label: 'Discover', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'places', label: 'Places', icon: <Map className="w-4 h-4" /> },
    { id: 'tours', label: 'Tours', icon: <Compass className="w-4 h-4" /> },
  ];

  /**
   * 1) Load searches from localStorage on mount
   */
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('popularSearches');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        const { lastUpdated, searches } = parsed;

        // Check if older than 1 week
        if (Date.now() - lastUpdated > EXPIRY_DAYS * MS_IN_DAY) {
          // Clear them if expired
          setPopularSearches([]);
          localStorage.removeItem('popularSearches');
        } else {
          setPopularSearches(searches);
        }
      }
    } catch (err) {
      console.error('Error reading localStorage for popularSearches:', err);
    }
  }, []);

  /**
   * 2) Typing animation for the heading
   */
  useEffect(() => {
    const animateText = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      if (isDeleting) {
        setDisplayText(fullText.substring(0, displayText.length - 1));
        setTypingSpeed(50);
      } else {
        setDisplayText(fullText.substring(0, displayText.length + 1));
        setTypingSpeed(100);
      }

      if (!isDeleting && displayText === fullText) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(50);
      }
    };

    const timer = setTimeout(animateText, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum, typingSpeed, phrases]);

  /**
   * 3) If parent changes externalSearchQuery, update local
   */
  useEffect(() => {
    setSearchQuery(externalSearchQuery);
  }, [externalSearchQuery]);

  /**
   * 4) On mount or route changes, sync `q` and `tab` from URL
   */
  useEffect(() => {
    const { q, tab } = router.query;
    if (q) {
      setSearchQuery(q);
      setExternalSearchQuery(q);
    }
    if (tab) {
      setActiveTab(tab);
    }
  }, [router.query, setExternalSearchQuery, setActiveTab]);

  /**
   * 5) Handle input changes
   */
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setExternalSearchQuery(e.target.value);
  };

  /**
   * 6) Perform the search + save in localStorage
   */
  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    // push to /search
    router.push({
      pathname: '/search',
      query: { q: searchQuery, tab: activeTab },
    });
    onSearchSubmit(searchQuery, activeTab);

    // add to localStorage if new
    addSearchToLocal(searchQuery);
  };

  /**
   * HELPER: Add a new search term
   */
  const addSearchToLocal = (searchTerm) => {
    let updated = [...popularSearches];
    // remove if it already exists
    updated = updated.filter((item) => item.toLowerCase() !== searchTerm.toLowerCase());
    // put new term at front
    updated.unshift(searchTerm);

    // optional limit, e.g. 10
    if (updated.length > 10) {
      updated = updated.slice(0, 10);
    }

    setPopularSearches(updated);

    // save to localStorage
    const payload = {
      searches: updated,
      lastUpdated: Date.now(),
    };
    try {
      localStorage.setItem('popularSearches', JSON.stringify(payload));
    } catch (err) {
      console.error('Error saving popularSearches to localStorage:', err);
    }
  };

  /**
   * 7) Remove a single search from the list
   */
  const removeSearchItem = (searchTerm) => {
    const filtered = popularSearches.filter(
      (item) => item.toLowerCase() !== searchTerm.toLowerCase()
    );
    setPopularSearches(filtered);

    const payload = {
      searches: filtered,
      lastUpdated: Date.now(),
    };
    localStorage.setItem('popularSearches', JSON.stringify(payload));
  };

  /**
   * 8) Press Enter to search
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="w-full">
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
        {/* Animated heading text */}
        <h1 className="text-4xl md:text-5xl font-black text-center mb-2 tracking-tight min-h-[3rem] md:min-h-[4rem] flex items-center justify-center">
          {displayText}
          <span className="inline-block w-0.5 h-8 md:h-12 ml-1 bg-black animate-pulse" />
        </h1>
        <p className="text-sm md:text-base text-gray-500 text-center mb-6 md:mb-8">
          Discover amazing places and experiences
        </p>

        {/* Main Search Container */}
        <div
          className={`relative bg-white rounded-xl md:rounded-2xl transition-all duration-300 ease-out
            ${isFocused ? 'shadow-xl md:shadow-2xl scale-100 md:scale-[1.02]' : 'shadow-md md:shadow-lg'}`}
        >
          {/* Search Tabs */}
          <div className="flex items-center gap-1 p-2 border-b overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-3 md:px-4 py-2
                  rounded-xl text-sm font-medium whitespace-nowrap
                  transition-all duration-200
                  ${activeTab === tab.id 
                    ? 'bg-black text-white' 
                    : 'hover:bg-gray-100 text-gray-600'}
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="p-3 md:p-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search for places, tours..."
                className="w-full pl-10 md:pl-12 pr-10 md:pr-12 py-3 md:py-4 text-base md:text-lg
                  bg-gray-100 rounded-xl placeholder-gray-400 text-gray-900
                  focus:outline-none focus:bg-gray-50 transition-all duration-300"
              />
              <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-gray-400" />
              
              {/* Clear button */}
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setExternalSearchQuery('');
                  }}
                  className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2
                    w-6 h-6 md:w-8 md:h-8 flex items-center justify-center
                    hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {/* Popular Searches (user-saved) */}
          <div className="px-3 md:px-4 pb-3 md:pb-4">
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-600 
                             rounded-full transition-colors duration-200">
                  
                  <button
                    onClick={() => {
                      setSearchQuery(item);
                      setExternalSearchQuery(item);
                      handleSearch();
                    }}
                    className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm focus:outline-none"
                  >
                    {item}
                  </button>

                  {/* Remove button (an "X" inside the chip) */}
                  <button
                    className="pr-2 pl-1 text-gray-400 hover:text-gray-600"
                    onClick={() => removeSearchItem(item)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 md:mt-6 flex flex-col md:flex-row gap-3 md:gap-4 justify-center">
          <button
            className="w-full md:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl
              bg-black text-white font-medium text-sm md:text-base
              hover:bg-gray-900 transition-colors shadow-lg hover:shadow-xl"
            onClick={handleSearch}
          >
            Search Now
          </button>
          {/* "I'm Feeling Lucky" is removed or hidden */}
        </div>
      </div>
    </div>
  );
};

export default ModernSearchBar;
