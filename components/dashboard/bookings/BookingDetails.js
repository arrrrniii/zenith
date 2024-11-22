import React from 'react';
import { useRouter } from 'next/router';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Download,
  Printer,
  Edit,
  Check
} from 'lucide-react';
import BookingStatusBadge from './BookingStatusBadge';

const InfoCard = ({ title, children }) => (
  <div className="bg-white rounded-lg border border-gray-200">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    </div>
    <div className="px-6 py-4">
      {children}
    </div>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between py-2">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-medium text-gray-900">{value}</span>
  </div>
);

const Timeline = ({ events }) => (
  <div className="flow-root">
    <ul className="-mb-8">
      {events.map((event, eventIdx) => (
        <li key={event.id}>
          <div className="relative pb-8">
            {eventIdx !== events.length - 1 ? (
              <span
                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                aria-hidden="true"
              />
            ) : null}
            <div className="relative flex space-x-3">
              <div>
                <span className={`
                  h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white
                  ${event.type === 'status' ? 'bg-blue-500' : 
                    event.type === 'message' ? 'bg-green-500' : 
                    'bg-gray-500'
                  }
                `}>
                  {event.icon}
                </span>
              </div>
              <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                <div>
                  <p className="text-sm text-gray-500">{event.content}</p>
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
  </div>
);

const BookingDetails = ({ booking }) => {
  const router = useRouter();

  // Sample timeline events
  const timelineEvents = [
    {
      id: 1,
      type: 'status',
      content: 'Booking confirmed',
      date: '2 hours ago',
      datetime: '2024-03-16T13:00',
      icon: <Check className="h-5 w-5 text-white" />
    },
    {
      id: 2,
      type: 'message',
      content: 'Sent confirmation email to customer',
      date: '2 hours ago',
      datetime: '2024-03-16T13:00',
      icon: <Mail className="h-5 w-5 text-white" />
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Bookings
        </button>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </button>
          <button className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>
          <button className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Edit className="w-4 h-4 mr-2" />
            Edit Booking
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Booking Details */}
        <div className="col-span-2 space-y-6">
          {/* Booking Header */}
          <InfoCard title="Booking Information">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Booking #{booking.bookingNumber}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Made on {booking.bookingDate}
                  </p>
                </div>
                <BookingStatusBadge status={booking.status} />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  Tour Date: {booking.date}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  Start Time: {booking.time}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2 text-gray-400" />
                  Participants: {booking.participants}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                  Total Amount: ${booking.totalAmount}
                </div>
              </div>
            </div>
          </InfoCard>

          {/* Tour Information */}
          <InfoCard title="Tour Details">
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">
                {booking.tourName}
              </h4>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                Meeting Point: {booking.meetingPoint}
              </div>
              <p className="text-sm text-gray-600">
                {booking.tourDescription}
              </p>
            </div>
          </InfoCard>

          {/* Activity Timeline */}
          <InfoCard title="Activity Timeline">
            <Timeline events={timelineEvents} />
          </InfoCard>
        </div>

        {/* Right Column - Customer Details & Actions */}
        <div className="space-y-6">
          {/* Customer Information */}
          <InfoCard title="Customer Information">
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-medium text-gray-900">
                  {booking.customerName}
                </h4>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {booking.customerEmail}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {booking.customerPhone}
                  </div>
                </div>
              </div>
            </div>
          </InfoCard>

          {/* Quick Actions */}
          <InfoCard title="Actions">
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </button>
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                <Mail className="w-4 h-4 mr-2" />
                Resend Confirmation
              </button>
            </div>
          </InfoCard>

          {/* Payment Information */}
          <InfoCard title="Payment Details">
            <div className="space-y-3">
              <DetailRow label="Subtotal" value={`$${booking.subtotal}`} />
              <DetailRow label="Tax" value={`$${booking.tax}`} />
              <DetailRow label="Total" value={`$${booking.totalAmount}`} />
              <DetailRow label="Payment Status" value={booking.paymentStatus} />
              <DetailRow label="Payment Method" value={booking.paymentMethod} />
            </div>
          </InfoCard>

          {/* Status Management */}
          <InfoCard title="Manage Status">
            <select 
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={booking.status}
              onChange={(e) => console.log('Status changed:', e.target.value)}
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