// components/BlockRenderer/blocks/AlertBlock.jsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';

export const AlertBlock = ({ content }) => {
  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle
  };

  const Icon = icons[content.variant] || Info;

  return (
    <Alert variant={content.variant} className="my-6">
      <Icon className="h-4 w-4" />
      {content.title && <AlertTitle>{content.title}</AlertTitle>}
      <AlertDescription>{content.message}</AlertDescription>
    </Alert>
  );
};