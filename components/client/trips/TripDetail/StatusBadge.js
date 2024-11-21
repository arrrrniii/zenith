// components/client/trips/TripDetail/StatusBadge.js
const StatusBadge = ({ type, text }) => {
  const styles = {
    bestseller: 'bg-black text-white',
    limited: 'bg-red-100 text-red-700',
    special: 'bg-blue-100 text-blue-700',
    default: 'bg-gray-100 text-gray-700'
  };

  return (
    <span 
      className={`
        inline-flex items-center px-3 py-1 rounded-md text-sm font-medium
        ${styles[type] || styles.default}
      `}
    >
      {text}
    </span>
  );
};

export default StatusBadge;