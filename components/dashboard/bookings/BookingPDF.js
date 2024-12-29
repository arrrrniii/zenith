// BookingPDF.js
import React from 'react';
import { format } from 'date-fns';
import { Clock, MapPin, Users, Mail, Phone } from 'lucide-react';

const BookingPDF = ({ booking }) => {
  return (
    <div id="pdf-content" className="bg-white p-8 max-w-4xl mx-auto h-full">
      {/* Header with Logo */}
      <div className="flex justify-between items-center border-b pb-6 mb-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-blue-600">Travel Booking</h1>
          <p className="text-gray-500 mt-1">Experience of a lifetime</p>
        </div>
        <div className="text-right">
          <div className=" rounded-lg p-3">
            <p className="text-sm text-gray-600">Booking Reference</p>
            <p className="text-xl font-bold text-blue-600">#{booking.bookingNumber}</p>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`mb-8 rounded-lg p-4 ${
        booking.status === 'Confirmed' ? 'bg-green-50 text-green-700' :
        booking.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' :
        'bg-gray-50 text-gray-700'
      }`}>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold">Status: {booking.status}</p>
            <p className="text-sm">Booked on {format(new Date(booking.bookingDate), 'MMMM dd, yyyy')}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">Tour Date</p>
            <p>{format(new Date(booking.date), 'MMMM dd, yyyy')}</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Tour Details */}
        <div className=" rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Tour Details</h2>
          <div className="space-y-4">
            <h3 className="font-medium text-xl text-gray-800">{booking.tourName}</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-3 text-blue-600" />
                <span>{booking.time}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                <span>{booking.meetingPoint}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="w-5 h-5 mr-3 text-blue-600" />
                <span>{booking.participants} participants</span>
              </div>
            </div>
            <p className="text-gray-600 mt-4 p-4 bg-white rounded-lg">
              {booking.tourDescription}
            </p>
          </div>
        </div>

        {/* Customer Details */}
        <div className="  rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Customer Information</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <p className="font-semibold text-lg text-gray-800">{booking.customerName}</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-3 text-blue-600" />
                  <span>{booking.customerEmail}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-5 h-5 mr-3 text-blue-600" />
                  <span>{booking.customerPhone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="  rounded-lg p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">Payment Summary</h2>
        <div className="bg-white rounded-lg p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${booking.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>${booking.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium text-lg border-t pt-3 mt-3">
              <span>Total Amount</span>
              <span className="text-blue-600">${booking.totalAmount.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Payment Status:</span>
              <span className={`font-medium ${
                booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {booking.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Payment Method:</span>
              <span>{booking.paymentMethod}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t text-center text-gray-500 text-sm">
        <p>Thank you for booking with us!</p>
      </div>
    </div>
  );
};

export default BookingPDF;