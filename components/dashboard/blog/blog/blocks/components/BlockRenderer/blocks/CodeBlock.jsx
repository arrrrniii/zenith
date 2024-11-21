// components/BlockRenderer/blocks/CodeBlock.jsx
import React from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import languages you want to use
import javascript from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript';
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css';
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python';
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json';
import sql from 'react-syntax-highlighter/dist/cjs/languages/prism/sql';
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';

// Register languages
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('bash', bash);

export const CodeBlock = ({ content }) => {
  const {
    code = '',
    language = 'javascript',
    showLineNumbers = true,
    wrapLongLines = false,
    theme = 'dark',
    fileName = ''
  } = content;

  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className={cn( 
      'rounded-lg h-[400px] w-full relative overflow-hidden',
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    )}>
      {/* Header with filename and copy button */}
      <div className={cn(
        'flex items-center justify-between px-4 py-2',
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100',
        'border-b',
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      )}>
        <div className={cn(
          'font-mono text-sm',
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        )}>
          {fileName || language}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className={theme === 'dark' ? 'text-gray-300 hover:text-white' : ''}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Code content */}
      <div className="relative h-[400px] overflow-auto">
        <SyntaxHighlighter
          language={language}
          style={theme === 'dark' ? oneDark : oneLight}
          showLineNumbers={showLineNumbers}
          wrapLines={wrapLongLines}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            fontSize: '14px',
            padding: '1rem',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};