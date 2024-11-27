// components/checkout/elements/HelpSection.js
import { 
    Phone, 
    Mail, 
    MessageCircle, 
    Clock, 
    Info,
    ExternalLink
  } from 'lucide-react';
  
  const ContactOption = ({ icon: Icon, label, value, href, className = '' }) => (
    <a 
      href={href}
      className={`
        flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 
        transition-colors duration-200 group ${className}
      `}
    >
      <Icon className="w-4 h-4 text-gray-500 group-hover:text-blue-500" />
      <div className="flex-1">
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
          {value}
        </div>
      </div>
      <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  );
  
  const HelpSection = () => {
    const currentHour = new Date().getHours();
    const isBusinessHours = currentHour >= 9 && currentHour < 17;
  
    return (
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {/* Status Banner */}
        <div className={`
          px-4 py-2 text-sm flex items-center gap-2
          ${isBusinessHours ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'}
        `}>
          <div className="flex items-center gap-1.5">
            <div className={`
              w-2 h-2 rounded-full
              ${isBusinessHours ? 'bg-green-500' : 'bg-gray-400'}
            `} />
            <Clock className="w-4 h-4" />
          </div>
          {isBusinessHours 
            ? "We're online | Average response time: 5 mins"
            : "We're currently offline | We'll respond within 24 hours"
          }
        </div>
  
        {/* Help Content */}
        <div className="p-4">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900">Need help?</h3>
              <p className="text-sm text-gray-600 mt-1">
                Our travel experts are here to assist you with your booking
              </p>
            </div>
          </div>
  
          <div className="space-y-1">
            <ContactOption
              icon={Phone}
              label="Call us"
              value="+1 (234) 567-890"
              href="tel:+1234567890"
            />
            <ContactOption
              icon={Mail}
              label="Email us"
              value="support@example.com"
              href="mailto:support@example.com"
            />
            <ContactOption
              icon={MessageCircle}
              label="Live chat"
              value="Start a conversation"
              href="#"
              className="text-blue-600"
            />
          </div>
  
          {/* FAQ Quick Links */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-xs font-medium text-gray-500 mb-2">
              FREQUENTLY ASKED QUESTIONS
            </div>
            <div className="space-y-2">
              {[
                'How do I modify my booking?',
                "What's your cancellation policy?",
                'Do I need to print my ticket?'
              ].map((question, index) => (
                <a
                  key={index}
                  href="#"
                  className="block text-sm text-gray-600 hover:text-blue-600 hover:underline"
                >
                  {question}
                </a>
              ))}
            </div>
          </div>
  
          {/* Business Hours */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-xs font-medium text-gray-500 mb-2">
              BUSINESS HOURS
            </div>
            <div className="text-sm text-gray-600">
              <p>Monday - Friday: 9:00 AM - 5:00 PM EST</p>
              <p>Saturday - Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default HelpSection;