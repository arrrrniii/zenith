//components/dashboard/finance/TourFinancePage.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { format } from "date-fns";
import { 
  DollarSign, 
  TrendingUp, 
  ArrowLeft,
  Download,
  Users,
  Calendar as CalendarIcon,
  Activity,
  Clock
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TransactionDetailsDialog from './TransactionDetailsDialog';

const TourFinancePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [date, setDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Sample tour data - replace with actual API call
  const [tourData, setTourData] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (id) {
      // Fetch tour data
      setTourData({
        id,
        name: 'City Walking Tour',
        totalRevenue: 45000,
        monthlyGrowth: 15.5,
        averageBookingValue: 299,
        totalBookings: 150,
        upcomingBookings: 25,
        averageGroupSize: 8,
        popularTimes: ['10:00 AM', '2:00 PM'],
        nextAvailableDate: '2024-12-20'
      });

      // Fetch transactions
      setTransactions([
        { 
          id: 1, 
          customerName: 'John Doe',
          email: 'john@example.com',
          phone: '+1 234 567 8900',
          country: 'United States', 
          amount: 299, 
          bookingDate: '2024-12-10', 
          status: 'completed', 
          tourDate: '2024-12-15',
          bookingId: 'BK001',
          participants: 2,
          paymentMethod: 'Credit Card',
          timeSlot: '10:00 AM',
          specialRequests: 'Vegetarian meals'
        },
        { 
          id: 2, 
          customerName: 'Sarah Smith',
          email: 'sarah@example.com',
          phone: '+1 234 567 8901',
          country: 'Canada', 
          amount: 598, 
          bookingDate: '2024-12-09', 
          status: 'pending', 
          tourDate: '2024-12-20',
          bookingId: 'BK002',
          participants: 4,
          paymentMethod: 'PayPal',
          timeSlot: '2:00 PM',
          specialRequests: null
        }
      ]);
    }
  }, [id]);

  const handleExport = (format) => {
    console.log(`Exporting tour ${id} data in ${format} format`);
  };

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsOpen(true);
  };

  const filteredTransactions = transactions.filter(transaction => {
    let matchesDate = true;
    let matchesStatus = true;

    if (date) {
      const transactionDate = new Date(transaction.tourDate);
      matchesDate = format(new Date(transactionDate), 'yyyy-MM-dd') === format(new Date(date), 'yyyy-MM-dd');
    }

    if (selectedStatus !== 'all') {
      matchesStatus = transaction.status === selectedStatus;
    }

    return matchesDate && matchesStatus;
  });

  if (!tourData) return null;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Finance
          </Button>
          <h2 className="text-2xl font-bold">{tourData.name} - Financial Overview</h2>
        </div>
        <Button variant="outline" onClick={() => handleExport('pdf')}>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Revenue
            </CardTitle>
            <DollarSign className="w-4 h-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              ${tourData.totalRevenue.toLocaleString()}
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +{tourData.monthlyGrowth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Bookings
            </CardTitle>
            <Activity className="w-4 h-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {tourData.totalBookings}
            </div>
            <div className="text-sm text-gray-600">
              {tourData.upcomingBookings} upcoming
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Average Group Size
            </CardTitle>
            <Users className="w-4 h-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {tourData.averageGroupSize}
            </div>
            <div className="text-sm text-gray-600">
              persons per booking
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Popular Times
            </CardTitle>
            <Clock className="w-4 h-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {tourData.popularTimes[0]}
            </div>
            <div className="text-sm text-gray-600">
              Next available: {tourData.nextAvailableDate}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tour Bookings</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {date ? format(date, "PPP") : <span>Filter by date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transactions Table */}
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Booking ID</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Tour Date</th>
                  <th className="px-6 py-3">Participants</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Payment Method</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {transaction.bookingId}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {transaction.customerName}
                    </td>
                    <td className="px-6 py-4">{transaction.tourDate}</td>
                    <td className="px-6 py-4">{transaction.participants}</td>
                    <td className="px-6 py-4">${transaction.amount}</td>
                    <td className="px-6 py-4">{transaction.paymentMethod}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        transaction.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetails(transaction)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details Dialog */}
      <TransactionDetailsDialog
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction}
      />
    </div>
  );
};

export default TourFinancePage;