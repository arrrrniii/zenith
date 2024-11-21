// components/client/trips/TripDetail/TripHighlights.js
const TripHighlights = ({ highlights = [] }) => {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Highlights</h2>
        <ul className="space-y-3">
          {highlights.map((highlight, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2" />
              <span className="text-gray-700">{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default TripHighlights;