// BookingDetails.js
import React from 'react';
import { useRouter } from 'next/router';
import { 
  ArrowLeft, Calendar, Clock, Users, DollarSign, 
  Mail, Phone, MapPin, MessageSquare, Check, CreditCard
} from 'lucide-react';
import BookingStatusBadge from './BookingStatusBadge';
import BookingActions from './BookingActions';

// Subcomponent for consistent info cards
const InfoCard = ({ title, children, className = '' }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    </div>
    <div className="px-6 py-4">{children}</div>
  </div>
);

// Enhanced detail row with optional icon and styling
const DetailRow = ({ label, value, icon: Icon, className = '' }) => (
  <div className={`flex justify-between items-center py-2 ${className}`}>
    <span className="flex items-center text-sm text-gray-500">
      {Icon && <Icon className="w-4 h-4 mr-2 text-gray-400" />}
      {label}
    </span>
    <span className="text-sm font-medium text-gray-900">{value}</span>
  </div>
);

// Enhanced timeline component
const Timeline = ({ booking }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(date);
    } catch (error) {
      console.error('Date formatting error:', error);
      return '';
    }
  };

  const generateTimelineEvents = () => {
    const events = [
      {
        id: 'booking-created',
        type: 'status',
        content: 'Booking created',
        date: formatDate(booking.bookingDate),
        datetime: booking.bookingDate,
        icon: <Check className="h-5 w-5 text-white" />
      }
    ];

    if (booking.paymentStatus === 'paid') {
      events.push({
        id: 'payment-received',
        type: 'payment',
        content: 'Payment received',
        date: formatDate(booking.paymentDate || booking.bookingDate),
        datetime: booking.paymentDate || booking.bookingDate,
        icon: <CreditCard className="h-5 w-5 text-white" />
      });
    }

    // Add tour date as a future event if it hasn't occurred yet
    const tourDate = new Date(booking.date);
    if (tourDate > new Date()) {
      events.push({
        id: 'tour-scheduled',
        type: 'upcoming',
        content: 'Tour scheduled',
        date: formatDate(booking.date),
        datetime: booking.date,
        icon: <Calendar className="h-5 w-5 text-white" />
      });
    }

    return events;
  };

  const events = generateTimelineEvents();

  return (
    <div className="flow-root">
      {events.length === 0 ? (
        <div className="text-sm text-gray-500 py-4">No timeline events</div>
      ) : (
        <ul className="-mb-8">
          {events.map((event, eventIdx) => (
            <li key={event.id}>
              <div className="relative pb-8">
                {eventIdx !== events.length - 1 && (
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white
                      ${event.type === 'status' ? 'bg-blue-500' : 
                        event.type === 'payment' ? 'bg-emerald-500' : 
                        'bg-purple-500'}`}>
                      {event.icon}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-900 font-medium">{event.content}</p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <time dateTime={event.datetime}>{event.date}</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const BookingDetails = ({ booking }) => {
  const router = useRouter();

  const formatCurrency = (amount) => (
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  );

  const formatDate = (dateString) => (
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  );

  const handleStatusChange = async (newStatus) => {
    try {
      // Add your status update logic here
      console.log('Status changed:', newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div id="booking-details" className="max-w-7xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 no-print"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Bookings
        </button>
        <BookingActions booking={booking} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Information */}
        <div className="lg:col-span-2 space-y-6">
          <InfoCard title="Booking Information">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Booking #{booking.bookingNumber}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Made on {formatDate(booking.bookingDate)}
                  </p>
                </div>
                <BookingStatusBadge status={booking.status} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <DetailRow 
                  icon={Calendar}
                  label="Tour Date"
                  value={formatDate(booking.date)}
                />
                <DetailRow 
                  icon={Clock}
                  label="Start Time"
                  value={booking.time}
                />
                <DetailRow 
                  icon={Users}
                  label="Participants"
                  value={booking.participants}
                />
                <DetailRow 
                  icon={DollarSign}
                  label="Total Amount"
                  value={formatCurrency(booking.totalAmount)}
                />
              </div>
            </div>
          </InfoCard>

          <InfoCard title="Tour Details">
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">
                {booking.tourName}
              </h4>
              <DetailRow 
                icon={MapPin}
                label="Meeting Point"
                value={booking.meetingPoint}
              />
              <p className="text-sm text-gray-600 mt-4">
                {booking.tourDescription}
              </p>
            </div>
          </InfoCard>

          <InfoCard title="Activity Timeline">
            <Timeline booking={booking} />
          </InfoCard>
        </div>

        {/* Right Column - Additional Information */}
        <div className="space-y-6">
          <InfoCard title="Customer Information">
            <div className="space-y-4">
              <h4 className="text-base font-medium text-gray-900">
                {booking.customerName}
              </h4>
              <DetailRow 
                icon={Mail}
                label="Email"
                value={booking.customerEmail}
              />
              <DetailRow 
                icon={Phone}
                label="Phone"
                value={booking.customerPhone}
              />
            </div>
          </InfoCard>

          <InfoCard title="Quick Actions">
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </button>
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <Mail className="w-4 h-4 mr-2" />
                Resend Confirmation
              </button>
            </div>
          </InfoCard>

          <InfoCard title="Payment Details">
            <div className="space-y-3">
              <DetailRow label="Subtotal" value={formatCurrency(booking.subtotal)} />
              <DetailRow label="Tax" value={formatCurrency(booking.tax)} />
              <div className="border-t pt-2 mt-2">
                <DetailRow 
                  label="Total Amount" 
                  value={formatCurrency(booking.totalAmount)}
                  className="font-semibold"
                />
              </div>
              <DetailRow 
                label="Payment Status" 
                value={booking.paymentStatus}
                className="text-emerald-600"
              />
              <DetailRow label="Payment Method" value={booking.paymentMethod} />
            </div>
          </InfoCard>

          <InfoCard title="Manage Status">
            <select 
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={booking.status}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </InfoCard>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;