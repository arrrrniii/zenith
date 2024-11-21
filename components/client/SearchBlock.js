import React, { useState, useEffect } from 'react';
import { Search, Map, Compass, TrendingUp, X } from 'lucide-react';

const ModernSearchBar = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  const phrases = [
    "Where to?",
    "Ready to explore?",
    "Need inspiration?",
    "Want adventure?",
    "Looking for fun?"
  ];

  // Typing animation effect
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
  }, [displayText, isDeleting, loopNum, typingSpeed]);

  const tabs = [
    {
      id: 'discover',
      label: 'Discover',
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: 'places',
      label: 'Places',
      icon: <Map className="w-4 h-4" />
    },
    {
      id: 'tours',
      label: 'Tours',
      icon: <Compass className="w-4 h-4" />
    }
  ];

  const popularSearches = ['Paris Tours', 'London Experiences', 'NYC Walking Tours', 'Tokyo Nights'];

  return (
    <div className="w-full">
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
        {/* Header - Responsive text sizes */}
        <h1 className="text-4xl md:text-5xl font-black text-center mb-2 tracking-tight min-h-[3rem] md:min-h-[4rem] flex items-center justify-center">
          {displayText}
          <span className="inline-block w-0.5 h-8 md:h-12 ml-1 bg-black animate-pulse" />
        </h1>
        <p className="text-sm md:text-base text-gray-500 text-center mb-6 md:mb-8">
          Discover amazing places and experiences
        </p>

        {/* Main Search Container - Mobile optimized */}
        <div className={`
          relative bg-white rounded-xl md:rounded-2xl
          transition-all duration-300 ease-out
          ${isFocused ? 'shadow-xl md:shadow-2xl scale-100 md:scale-[1.02]' : 'shadow-md md:shadow-lg'}
        `}>
          {/* Search Tabs - Horizontal scroll on mobile */}
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

          {/* Search Input - Adjusted padding for mobile */}
          <div className="p-3 md:p-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search for places, tours..."
                className="w-full pl-10 md:pl-12 pr-10 md:pr-12 py-3 md:py-4 text-base md:text-lg
                  bg-gray-100 rounded-xl
                  placeholder-gray-400 text-gray-900
                  focus:outline-none focus:bg-gray-50
                  transition-all duration-300"
              />
              <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-gray-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2
                    w-6 h-6 md:w-8 md:h-8 flex items-center justify-center
                    hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {/* Popular Searches - Adjusted for mobile */}
          <div className="px-3 md:px-4 pb-3 md:pb-4">
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(search)}
                  className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm
                    bg-gray-100 hover:bg-gray-200
                    text-gray-600 rounded-full
                    transition-colors duration-200"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons - Stack on mobile */}
        <div className="mt-4 md:mt-6 flex flex-col md:flex-row gap-3 md:gap-4 justify-center">
          <button className="w-full md:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl
            bg-black text-white font-medium text-sm md:text-base
            hover:bg-gray-900 transition-colors
            shadow-lg hover:shadow-xl">
            Search Now
          </button>
          <button className="w-full md:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl
            bg-gray-100 text-gray-700 font-medium text-sm md:text-base
            hover:bg-gray-200 transition-colors">
            I'm Feeling Lucky
          </button>
        </div>

        {/* Recent Searches - Mobile optimized */}
        {isFocused && (
          <div className="absolute top-full left-0 right-0 mt-2
            bg-white rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl p-3 md:p-4 z-50
            border border-gray-100 mx-3 md:mx-0">
            <div className="text-xs md:text-sm text-gray-500 font-medium mb-2">
              Recent Searches
            </div>
            <div className="space-y-1 md:space-y-2">
              {['Paris Food Tours', 'London Museums'].map((search, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2
                    hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <Search className="w-4 h-4 text-gray-400" />
                  <span className="text-sm md:text-base text-gray-700">{search}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernSearchBar;