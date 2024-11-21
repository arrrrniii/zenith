// components/admin/dashboard/service/blocks/components/editors/QuoteEditor.js
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const QuoteEditor = ({ content, onChange }) => {
  const handleChange = (updates) => {
    onChange({
      ...content,
      ...updates
    });
  };

  return (
    <div className="space-y-4">
      {/* Quote Text */}
      <div>
        <Label>Quote Text</Label>
        <Textarea
          value={content?.text || ''}
          onChange={(e) => handleChange({ text: e.target.value })}
          placeholder="Enter quote text"
          rows={3}
        />
      </div>

      <div className="grid gap-4">
        {/* Author Info */}
        <div>
          <Label>Author</Label>
          <Input
            value={content?.author || ''}
            onChange={(e) => handleChange({ author: e.target.value })}
            placeholder="Author name"
          />
        </div>

        {/* Role/Title */}
        <div>
          <Label>Role or Title</Label>
          <Input
            value={content?.role || ''}
            onChange={(e) => handleChange({ role: e.target.value })}
            placeholder="Author role/title (optional)"
          />
        </div>

        {/* Citation Style */}
        <div>
          <Label>Citation Style</Label>
          <Select
            value={content?.citationStyle || 'standard'}
            onValueChange={(value) => handleChange({ citationStyle: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select citation style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (Name, Role)</SelectItem>
              <SelectItem value="compact">Compact (Name)</SelectItem>
              <SelectItem value="detailed">Detailed (Name - Role)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Preview */}
      <div className="mt-6 pt-6 border-t">
        <Label className="text-sm text-gray-500 mb-2">Preview</Label>
        <blockquote className="border-l-4 border-gray-200 pl-4 my-2">
          <p className="text-lg text-gray-700 italic">
            {content?.text || 'Your quote will appear here'}
          </p>
          {(content?.author || content?.role) && (
            <footer className="text-sm text-gray-500 mt-2">
              {content.citationStyle === 'compact' ? (
                `— ${content.author}`
              ) : content.citationStyle === 'detailed' ? (
                `— ${content.author}${content.role ? ` - ${content.role}` : ''}`
              ) : (
                `— ${content.author}${content.role ? `, ${content.role}` : ''}`
              )}
            </footer>
          )}
        </blockquote>
      </div>
    </div>
  );
};  