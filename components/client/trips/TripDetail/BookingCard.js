import React, { useState } from 'react';
import { 
  Clock, Users, Ticket, Globe, 
  CreditCard, Check, ChevronRight, 
  ChevronDown, ArrowRight,
  Minus, Plus
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

const BookingCard = ({ 
  price = {}, 
  details = {},
  onBook = () => {},
  tourType = 'single_day',
  tourSchedule = { startDates: [], dailySchedules: [] },
  allDatesPath = ''
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [showAllDates, setShowAllDates] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const formatCurrency = (amount, currency = 'USD') => {
    if (!amount) return '-';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (error) {
      console.error('Currency formatting error:', error);
      return `${currency} ${amount.toFixed(2)}`;
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (details.maxQuantity || 10)) {
      setQuantity(newQuantity);
    }
  };

  const DateButton = ({ date, isSelected, onClick }) => (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onClick={onClick}
      className={`
        px-4 py-3 rounded-xl border transition-all duration-300
        ${isSelected 
          ? 'border-blue-200 bg-blue-50 text-blue-700 shadow-sm scale-[1.02]' 
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }
      `}
    >
      <div className="text-left space-y-1">
        <div className="text-xs text-gray-500">
          {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
        </div>
        <div className="font-medium">
          {new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })}
        </div>
      </div>
    </motion.button>
  );

  const renderDateSelection = () => {
    if (!tourType === 'multi_day' || !tourSchedule?.startDates?.length) return null;

    const displayDates = showAllDates 
      ? tourSchedule.startDates
      : tourSchedule.startDates.slice(0, 4);

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium text-gray-700">Select Start Date</h4>
          {tourSchedule.startDates.length > 4 && (
            <button
              onClick={() => setShowAllDates(!showAllDates)}
              className="group flex items-center text-sm text-blue-600 hover:text-blue-700"
            >
              {showAllDates ? 'Show less' : 'View more dates'}
              <motion.div
                animate={{ rotate: showAllDates ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-4 h-4 ml-1" />
              </motion.div>
            </button>
          )}
        </div>
        <motion.div 
          className="grid grid-cols-2 gap-3"
          layout
        >
          <AnimatePresence>
            {displayDates.map((date) => (
              <DateButton
                key={date}
                date={date}
                isSelected={selectedDate === date}
                onClick={() => setSelectedDate(date)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  };

  return (
    <Card className="overflow-hidden backdrop-blur-md bg-white/90 sticky top-4">
      <div className="p-6 space-y-6">
        {/* Price Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-baseline">
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-light tracking-tight">
                  {formatCurrency(price.amount * quantity, price.currency)}
                </span>
                <span className="text-sm text-gray-500">{price.unit}</span>
              </div>
              {price.originalPrice && (
                <div className="text-sm text-gray-400">
                  <span className="line-through">
                    {formatCurrency(price.originalPrice * quantity, price.currency)}
                  </span>
                </div>
              )}
            </div>
            {price.savings && (
              <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-50 rounded-full">
                {price.savings}
              </span>
            )}
          </div>
          {price.priceDetails && (
            <p className="text-sm text-gray-500">{price.priceDetails}</p>
          )}
        </div>

        {/* Date Selection */}
        {renderDateSelection()}

        {/* Quantity Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Select Quantity</label>
          <div className="flex items-center justify-between px-4 py-3 border rounded-xl bg-gray-50/50">
            <button 
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="p-1 rounded-lg hover:bg-white disabled:opacity-50"
            >
              <Minus className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-lg font-medium text-gray-700">{quantity}</span>
            <button 
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= (details.maxQuantity || 10)}
              className="p-1 rounded-lg hover:bg-white disabled:opacity-50"
            >
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Deposit Info */}
        {price?.deposit?.amount && (
          <div className="p-4 bg-blue-50/50 backdrop-blur-sm rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <CreditCard className="w-4 h-4 text-blue-700" />
              </div>
              <span className="text-sm font-medium text-blue-900">
                Secure your spot
              </span>
            </div>
            <p className="text-sm text-blue-700">
              {formatCurrency(price.deposit.amount * quantity, price.currency)} deposit
              {price.deposit.refundable && " (fully refundable)"}
            </p>
            {price.deposit.deadline && (
              <p className="text-sm text-blue-600 mt-1">
                {price.deposit.deadline}
              </p>
            )}
          </div>
        )}

        {/* Key Details */}
        <div className="grid gap-3">
          {[
            { icon: Clock, text: details?.duration },
            { icon: Users, text: details?.groupSize },
            { icon: Ticket, text: details?.ticketType },
            { icon: Globe, text: details?.languages?.live?.join(', ') }
          ].filter(detail => detail.text).map((detail, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 
                backdrop-blur-sm transition-colors duration-300 hover:bg-gray-50"
            >
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <detail.icon className="w-4 h-4 text-gray-600" />
              </div>
              <span className="text-sm text-gray-700">{detail.text}</span>
            </div>
          ))}
        </div>

        {/* Book Button */}
        <button
          onClick={() => onBook({ selectedDate, quantity })}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className={`
            relative w-full py-4 rounded-xl font-medium text-base
            transition-all duration-300 transform
            ${tourType === 'multi_day' && !selectedDate
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : `
                bg-gradient-to-r from-blue-600 to-blue-500
                hover:from-blue-700 hover:to-blue-600
                text-white shadow-lg hover:shadow-xl
                ${isHovering ? 'scale-[1.02]' : 'scale-100'}
              `
            }
          `}
          disabled={tourType === 'multi_day' && !selectedDate}
        >
          <span className="flex items-center justify-center gap-2">
            {tourType === 'multi_day' ? 'Reserve These Dates' : 'Reserve Now'}
            <ArrowRight className="w-4 h-4" />
          </span>
        </button>

        {/* Features */}
        {details?.features?.length > 0 && (
          <div className="grid gap-2 pt-4 border-t border-gray-100">
            {details.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-600">
                <div className="p-1 bg-green-50 rounded-full">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default BookingCard;