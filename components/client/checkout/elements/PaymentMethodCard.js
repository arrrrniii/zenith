
  // components/checkout/elements/PaymentMethodCard.js
  export default function PaymentMethodCard({ 
    method, 
    title, 
    icon, 
    description,
    isAvailable = true,
    isSelected,
    onSelect
  }) {
    return (
      <button
        disabled={!isAvailable}
        onClick={() => onSelect(method)}
        className={`
          w-full p-4 rounded-2xl border transition-all duration-300
          ${isSelected 
            ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500 ring-opacity-50' 
            : 'border-gray-200 hover:border-gray-300'
          }
          ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {/* ... rest of the component */}
      </button>
    );
  }