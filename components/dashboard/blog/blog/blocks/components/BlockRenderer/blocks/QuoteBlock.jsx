// components/BlockRenderer/blocks/QuoteBlock.jsx
export const QuoteBlock = ({ content }) => {
  const renderCitation = () => {
    if (!content?.author) return null;

    switch (content.citationStyle) {
      case 'compact':
        return `— ${content.author}`;
      case 'detailed':
        return `— ${content.author}${content.role ? ` - ${content.role}` : ''}`;
      default: // 'standard'
        return `— ${content.author}${content.role ? `, ${content.role}` : ''}`;
    }
  };

  return (
    <blockquote className="relative border-l-4 border-gray-200 pl-4 my-6">
      <div className="absolute -left-3 top-0 h-4 w-4 bg-white">
        <svg 
          className="text-gray-300" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>
      <p className="text-lg text-gray-700 italic relative">
        {content?.text}
      </p>
      {content?.author && (
        <footer className="text-sm text-gray-500 mt-2">
          {renderCitation()}
        </footer>
      )}
    </blockquote>
  );
};