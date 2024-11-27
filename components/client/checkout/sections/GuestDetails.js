// components/client/checkout/sections/GuestDetails.js
import { Card } from '@/components/ui/card';
import { 
  User, 
  Users,
  CalendarDays, 
  Clock, 
  Star
} from 'lucide-react';

const GuestDetails = ({ formData, onChange, tour }) => {
  const handleAddOnToggle = (addon) => {
    onChange({
      target: {
        name: 'selectedAddOns',
        value: formData.selectedAddOns.includes(addon)
          ? formData.selectedAddOns.filter(a => a.id !== addon.id)
          : [...formData.selectedAddOns, addon]
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Customer Information */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Guest Details</h2>
        <Card className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={onChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={onChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={onChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Special Requests (Optional)
            </label>
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={onChange}
              rows={3}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any special requirements or requests..."
            />
          </div>
        </Card>
      </div>

      {/* Add-ons Section */}
      {tour.addOns?.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Available Add-ons</h2>
          <div className="space-y-4">
            {tour.addOns.map(addon => (
              <Card key={addon.id} className="p-4">
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    id={`addon-${addon.id}`}
                    checked={formData.selectedAddOns.includes(addon)}
                    onChange={() => handleAddOnToggle(addon)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label 
                      htmlFor={`addon-${addon.id}`}
                      className="font-medium cursor-pointer"
                    >
                      {addon.name}
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      {addon.description}
                    </p>
                    <p className="text-sm font-medium text-gray-900 mt-2">
                      ${addon.price}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestDetails;
