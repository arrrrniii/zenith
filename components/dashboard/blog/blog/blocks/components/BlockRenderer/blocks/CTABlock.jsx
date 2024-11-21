// components/BlockRenderer/blocks/CTABlock.jsx
import { Button } from '@/components/ui/button';

export const CTABlock = ({ content }) => (
  <div className="my-8 p-6 bg-gray-50 rounded-lg text-center">
    {content.heading && (
      <h3 className="text-2xl font-semibold mb-4">
        {content.heading}
      </h3>
    )}
    {content.description && (
      <p className="text-gray-600 mb-6">
        {content.description}
      </p>
    )}
    <Button 
      variant={content.variant || 'default'}
      size={content.size || 'lg'}
      onClick={() => window.location.href = content.url}
    >
      {content.buttonText}
    </Button>
  </div>
);