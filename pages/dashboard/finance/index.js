import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { format } from "date-fns";
import { useQuery } from '@apollo/client';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Activity,
  Download,
  Calendar as CalendarIcon
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from '@/components/ui/button';
import { GET_FINANCE_OVERVIEW } from './graphql/queries';

const FinanceIndex = () => {
  const router = useRouter();

  const [selectedTour, setSelectedTour] = useState('all');
  const [date, setDate] = useState(null);
  const [tourDate, setTourDate] = useState('all');

  const { data, loading, error } = useQuery(GET_FINANCE_OVERVIEW);

  if (loading) return <DashboardLayout pageTitle="Finance">Loading...</DashboardLayout>;
  if (error) return <DashboardLayout pageTitle="Finance">Error: {error.message}</DashboardLayout>;

  const { financeOverview, recentTransactions, tours, tourDates } = data;

  const handleExport = (format) => {
    // Implement export logic based on format (CSV, Excel, PDF)
    console.log(`Exporting in ${format} format`);
  };

  const handleTourClick = (tourId) => {
    router.push(`/dashboard/finance/tour/${tourId}`);
  };

  const handleViewDetails = (transactionId) => {
    router.push(`/dashboard/finance/transaction/${transactionId}`);
  };

  const handleResetFilters = () => {
    setSelectedTour('all');
    setDate(null);
    setTourDate('all');
  };

  const filteredTransactions = recentTransactions.filter(transaction => {
    let matchesTour = true;
    let matchesDate = true;
    let matchesTourDate = true;

    if (selectedTour !== 'all') {
      matchesTour = transaction.tourId.toString() === selectedTour;
    }

    if (date) {
      const transactionDate = new Date(transaction.date);
      matchesDate = format(transactionDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    }

    if (tourDate !== 'all') {
      matchesTourDate = transaction.tourDate === tourDate;
    }

    return matchesTour && matchesDate && matchesTourDate;
  });

  return (
    <DashboardLayout pageTitle="Finance">
      <div className="space-y-6">
        {/* Filters Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Filters</CardTitle>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleResetFilters}
                >
                  Reset Filters
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40">
                    <div className="flex flex-col space-y-2">
                      <Button variant="ghost" onClick={() => handleExport('csv')}>CSV</Button>
                      <Button variant="ghost" onClick={() => handleExport('excel')}>Excel</Button>
                      <Button variant="ghost" onClick={() => handleExport('pdf')}>PDF</Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Select value={selectedTour} onValueChange={setSelectedTour}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Tour" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tours</SelectItem>
                  {tours.map(tour => (
                    <SelectItem key={tour.id} value={tour.id.toString()}>
                      {tour.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={tourDate} onValueChange={setTourDate}>
                <SelectTrigger>
                  <SelectValue placeholder="Tour Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  {tourDates.map(td => (
                    <SelectItem key={td.id} value={td.date}>
                      {td.date}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
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
            </div>
          </CardContent>
        </Card>

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
                ${financeOverview.totalRevenue.toLocaleString()}
              </div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{financeOverview.monthlyGrowth}% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Payments
              </CardTitle>
              <CreditCard className="w-4 h-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ${financeOverview.pendingPayments.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                Pending transactions
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Average Booking Value
              </CardTitle>
              <Activity className="w-4 h-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ${financeOverview.averageBookingValue}
              </div>
              <div className="text-sm text-gray-600">
                Per transaction
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
                {financeOverview.totalBookings}
              </div>
              <div className="text-sm text-gray-600">
                All time
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Booking ID</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Tour</th>
                    <th className="px-6 py-3">Tour Date</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Date</th>
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
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleTourClick(transaction.tourId)}
                          className="text-blue-600 hover:underline"
                        >
                          {transaction.tourName}
                        </button>
                      </td>
                      <td className="px-6 py-4">{transaction.tourDate}</td>
                      <td className="px-6 py-4">${transaction.amount}</td>
                      <td className="px-6 py-4">{transaction.date}</td>
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
                          onClick={() => handleViewDetails(transaction.id)}
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
      </div>
    </DashboardLayout>
  );
};

export default FinanceIndex;
