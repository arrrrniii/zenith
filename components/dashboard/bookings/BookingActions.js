// BookingActions.js
import React, { useRef } from 'react';
import { useRouter } from 'next/router';
import { Printer, Download, Edit, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import BookingPDF from './BookingPDF';

const BookingActions = ({ booking }) => {
  const router = useRouter();
  const [showPDF, setShowPDF] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const pdfRef = useRef(null);

  const handlePrint = () => {
    setShowPDF(true);
    // Wait for the modal content to be rendered
    setTimeout(() => {
      if (pdfRef.current) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
          <html>
            <head>
              <title>Booking #${booking.bookingNumber}</title>
              <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
              <style>
                @media print {
                  body { padding: 20px; }
                  button { display: none !important; }
                  .no-print { display: none !important; }
                }
              </style>
            </head>
            <body>
              ${pdfRef.current.innerHTML}
            </body>
          </html>
        `);
        
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      }
    }, 100);
  };

  const handleDownload = async () => {
    if (typeof window === 'undefined') return;
    
    setIsLoading(true);
    try {
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default;

      setShowPDF(true);
      // Wait for the modal content to be rendered
      setTimeout(async () => {
        if (pdfRef.current) {
          const opt = {
            margin: 0,
            filename: `booking-${booking.bookingNumber}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
          };
          
          await html2pdf().set(opt).from(pdfRef.current).save();
          setShowPDF(false);
        }
        setIsLoading(false);
      }, 100);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsLoading(false);
      // Add error handling UI here if needed
    }
  };

  return (
    <>
      <div className="flex items-center space-x-4">
        <button
          onClick={handlePrint}
          disabled={isLoading}
          className="flex items-center px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Printer className="w-4 h-4 mr-2" />
          {isLoading ? 'Processing...' : 'Print'}
        </button>
        <button
          onClick={handleDownload}
          disabled={isLoading}
          className="flex items-center px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4 mr-2" />
          {isLoading ? 'Processing...' : 'Download PDF'}
        </button>
        <button
          onClick={() => router.push(`/dashboard/bookings/edit/${booking.id}`)}
          disabled={isLoading}
          className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Booking
        </button>
      </div>

      {/* Hidden PDF container for generation */}
      <div style={{ display: 'none' }}>
        <div ref={pdfRef}>
          <BookingPDF booking={booking} />
        </div>
      </div>

      {/* Preview Modal */}
      {showPDF && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {isLoading ? 'Processing...' : 'Booking Preview'}
              </h2>
              <button
                onClick={() => setShowPDF(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
                disabled={isLoading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <BookingPDF booking={booking} />
          </div>
        </div>
      )}
    </>
  );
};

export default BookingActions;