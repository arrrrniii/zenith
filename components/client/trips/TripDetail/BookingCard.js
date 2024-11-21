// components/client/trips/TripDetail/BookingCard.js
import React, { useState } from 'react';
import { 
  Clock, Users, Ticket, Globe, Calendar, 
  CalendarDays, CreditCard, Info, Check 
} from 'lucide-react';
import { Card } from '@/components/ui/card';

const BookingCard = ({ 
  price, 
  details, 
  onBook,
  tourType = 'single_day',
  tourSchedule = { startDates: [], dailySchedules: [] }
}) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const renderPriceBreakdown = () => {
    const formattedPrice = formatCurrency(price.amount, price.currency);
    const formattedOriginal = price.originalPrice ? 
      formatCurrency(price.originalPrice, price.currency) : null;

    return (
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{formattedPrice}</span>
            <span className="text-sm text-gray-600">{price.unit}</span>
          </div>
          {price.savings && (
            <span className="text-green-600 text-sm font-medium">
              {price.savings}
            </span>
          )}
        </div>
        {formattedOriginal && (
          <div className="text-sm text-gray-500">
            <span className="line-through">{formattedOriginal}</span>
          </div>
        )}
        {price.priceDetails && (
          <p className="text-sm text-gray-600 mt-1">{price.priceDetails}</p>
        )}
      </div>
    );
  };

  const renderDepositInfo = () => {
    if (!price.deposit) return null;
    
    return (
      <div className="bg-blue-50 rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-blue-900">Deposit Required</span>
        </div>
        <div className="text-sm text-blue-800 space-y-1">
          <p>
            {formatCurrency(price.deposit.amount, price.currency)} deposit to book
            {price.deposit.refundable && " (refundable)"}
          </p>
          <p className="text-blue-700">{price.deposit.deadline}</p>
        </div>
      </div>
    );
  };

  const renderDateSelection = () => {
    if (tourType === 'single_day' || !tourSchedule.startDates) return null;

    return (
      <div className="space-y-3">
        <h4 className="font-medium">Select Start Date</h4>
        <div className="grid grid-cols-2 gap-2">
          {tourSchedule.startDates.slice(0, 4).map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors
                ${selectedDate === date 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              {new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </button>
          ))}
        </div>
        {tourSchedule.startDates.length > 4 && (
          <button className="text-sm text-blue-600 hover:text-blue-700">
            View more dates
          </button>
        )}
      </div>
    );
  };

  return (
    <Card className="p-6 sticky top-6">
      <div className="space-y-6">
        {/* Price Section */}
        {renderPriceBreakdown()}

        {/* Date Selection for Multi-day Tours */}
        {renderDateSelection()}

        {/* Deposit Information */}
        {renderDepositInfo()}

        {/* Key Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {tourType === 'multi_day' ? (
              <CalendarDays className="w-5 h-5 text-gray-500" />
            ) : (
              <Clock className="w-5 h-5 text-gray-500" />
            )}
            <span>{details.duration}</span>
          </div>
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-gray-500" />
            <span>{details.groupSize}</span>
          </div>
          <div className="flex items-center gap-3">
            <Ticket className="w-5 h-5 text-gray-500" />
            <span>{details.ticketType}</span>
          </div>
          {details.languages?.live?.length > 0 && (
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-500" />
              <span>{details.languages.live.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Booking Button */}
        <button
          onClick={() => onBook(selectedDate)}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors
            ${tourType === 'multi_day' && !selectedDate
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-yellow-500 hover:bg-yellow-600 text-black'
            }`}
          disabled={tourType === 'multi_day' && !selectedDate}
        >
          {tourType === 'multi_day' ? 'Reserve These Dates' : 'Reserve Now'}
        </button>

        {/* Features */}
        <div className="text-sm text-gray-600 space-y-2">
          {details.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default BookingCard;