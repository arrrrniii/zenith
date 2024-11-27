// components/client/trips/TripDetail/TripHighlights.js
// components/client/trips/TripDetail/TripHighlights.js
const TripHighlights = ({ highlights = [] }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-medium tracking-tight text-gray-900">Highlights</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {highlights.map((highlight, index) => (
          <li 
            key={index} 
            className="flex items-start gap-3 p-4 rounded-xl bg-gray-50/50 backdrop-blur-sm transition-colors duration-300 hover:bg-gray-50"
          >
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2.5" />
            <span className="text-gray-700 leading-relaxed">{highlight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

  
  export default TripHighlights;