//components/dashboard/finance/TransactionDetailsDialog.js
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { format } from 'date-fns';

const TransactionDetailsDialog = ({ 
  isOpen, 
  onClose, 
  transaction 
}) => {
  if (!transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Transaction Details - {transaction.bookingId}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4">
          {/* Customer Information */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Customer Name</p>
                  <p className="text-base">{transaction.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-base">{transaction.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-base">{transaction.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Country</p>
                  <p className="text-base">{transaction.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Tour Date</p>
                  <p className="text-base">{transaction.tourDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Time Slot</p>
                  <p className="text-base">{transaction.timeSlot}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Participants</p>
                  <p className="text-base">{transaction.participants}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Special Requests</p>
                  <p className="text-base">{transaction.specialRequests || 'None'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Amount</p>
                  <p className="text-base">${transaction.amount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Payment Method</p>
                  <p className="text-base">{transaction.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Payment Status</p>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    transaction.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Booking Date</p>
                  <p className="text-base">{transaction.bookingDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailsDialog;