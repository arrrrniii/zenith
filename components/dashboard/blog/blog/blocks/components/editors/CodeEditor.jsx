// components/admin/dashboard/service/blocks/components/editors/CodeEditor.jsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

const LANGUAGE_OPTIONS = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'jsx', label: 'JSX' },
  { value: 'tsx', label: 'TSX' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'scss', label: 'SCSS' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'sql', label: 'SQL' },
  { value: 'shell', label: 'Shell' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
].sort((a, b) => a.label.localeCompare(b.label));

export const CodeEditor = ({ content, onChange }) => {
  // Initialize default content
  const codeContent = {
    code: '',
    language: 'javascript',
    showLineNumbers: true,
    wrapLongLines: false,
    theme: 'dark', // dark or light
    fileName: '',
    ...content
  };

  return (
    <div className="space-y-6">
      {/* Code Settings */}
      <div className="grid gap-4">
        {/* Language Selection */}
        <div>
          <Label>Language</Label>
          <Select
            value={codeContent.language}
            onValueChange={(value) => onChange({ ...codeContent, language: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGE_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* File Name (Optional) */}
        <div className="space-y-2">
          <Label>
            Filename{' '}
            <span className="text-sm text-gray-500">(optional)</span>
          </Label>
          <input
            type="text"
            value={codeContent.fileName}
            onChange={(e) => onChange({ ...codeContent, fileName: e.target.value })}
            placeholder="e.g. example.js"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Code Input */}
        <div className="space-y-2">
          <Label>Code</Label>
          <Textarea
            value={codeContent.code}
            onChange={(e) => onChange({ ...codeContent, code: e.target.value })}
            placeholder={`Enter your ${LANGUAGE_OPTIONS.find(l => l.value === codeContent.language)?.label || 'code'} here...`}
            className="font-mono text-sm"
            rows={10}
          />
        </div>

        {/* Display Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Show Line Numbers</Label>
            <Switch
              checked={codeContent.showLineNumbers}
              onCheckedChange={(checked) => 
                onChange({ ...codeContent, showLineNumbers: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Wrap Long Lines</Label>
            <Switch
              checked={codeContent.wrapLongLines}
              onCheckedChange={(checked) => 
                onChange({ ...codeContent, wrapLongLines: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Theme</Label>
            <Select
              value={codeContent.theme}
              onValueChange={(value) => onChange({ ...codeContent, theme: value })}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

 
    </div>
  );
};