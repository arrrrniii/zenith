// components/client/checkout/sections/OrderSummary.js
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { 
  Shield, 
  Star, 
  Clock, 
  Users, 
  Calendar,
  MapPin,
  Tag,
  Info
} from 'lucide-react';

const OrderSummary = ({ tour, formData, totalAmount }) => {
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Your Trip Summary</h3>
        
        <div className="space-y-6">
          {/* Tour Image and Basic Info */}
          <div className="flex gap-4">
            <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src={tour.image}
                alt={tour.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-medium mb-1">{tour.title}</h4>
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                <Star className="w-4 h-4 fill-current text-yellow-400" />
                <span>{tour.rating}</span>
                <span>·</span>
                <span>{tour.reviewCount} reviews</span>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{tour.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{formData.participants} {formData.participants === 1 ? 'Guest' : 'Guests'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tour Details */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>{formatDate(tour.selectedDate)}</span>
              {tour.startTime && (
                <span className="text-gray-500">at {tour.startTime}</span>
              )}
            </div>
            {tour.meetingPoint && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>{tour.meetingPoint}</span>
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex justify-between items-baseline">
              <span className="text-gray-600">Tour Price</span>
              <div className="text-right">
                <span className="font-medium">${tour.pricing?.price_per_person}</span>
                <span className="text-sm text-gray-500 ml-1">× {formData.participants}</span>
              </div>
            </div>

            {/* Early Bird Discount if applicable */}
            {tour.pricing?.early_bird_discount_percentage > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600 flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  Early Bird Discount
                </span>
                <span className="text-green-600">
                  -{tour.pricing.early_bird_discount_percentage}%
                </span>
              </div>
            )}

            {/* Add-ons */}
            {formData.selectedAddOns.map(addon => (
              <div key={addon.id} className="flex justify-between text-sm">
                <span className="text-gray-600">{addon.name}</span>
                <span>${addon.price}</span>
              </div>
            ))}

            {/* Total */}
            <div className="flex justify-between font-semibold pt-3 border-t">
              <span>Total</span>
              <span>${totalAmount}</span>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="p-4 bg-gray-50 rounded-xl text-sm space-y-2">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <span className="font-medium text-gray-900">Free cancellation</span>
                <p className="text-gray-600">
                  Cancel up to 24 hours before your trip for a full refund
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {tour.additionalInfo && (
            <div className="p-4 border border-blue-100 bg-blue-50 rounded-xl text-sm">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                <div className="text-blue-800">
                  <span className="font-medium">Important Information</span>
                  <p className="mt-1 text-blue-700">{tour.additionalInfo}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default OrderSummary;