// components/client/trips/TripDetail/StatusBadge.js
// components/client/trips/TripDetail/StatusBadge.js
const StatusBadge = ({ type, text }) => {
  const styles = {
    bestseller: 'bg-black text-white',
    limited: 'bg-gradient-to-r from-red-500 to-pink-500 text-white',
    special: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white',
    default: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800'
  };

  return (
    <span
      className={`
        inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium
        backdrop-blur-sm shadow-sm transition-transform duration-300 hover:scale-105
        ${styles[type] || styles.default}
      `}
    >
      {text}
    </span>
  );
};

export default StatusBadge;