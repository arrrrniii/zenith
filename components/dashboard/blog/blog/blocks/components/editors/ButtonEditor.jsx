import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowRight, ExternalLink, ChevronRight, MoveRight } from 'lucide-react';

export const ButtonEditor = ({ content, onChange }) => {
  // Initialize default content with colors
  const buttonContent = {
    text: 'Click me',
    url: '',
    variant: 'default',
    size: 'default',
    style: 'solid',
    icon: 'none',
    animation: 'none',
    fullWidth: false,
    openInNewTab: false,
    alignment: 'left',
    backgroundColor: '#000000',
    textColor: '#ffffff',
    underline: false,
    ...content
  };

  // Preview the button animation
  const previewAnimation = (animation) => {
    const newContent = {
      ...buttonContent,
      animation
    };
    onChange(newContent);
  };

  return (
    <div className="space-y-6">
      {/* Button Text & URL */}
      <div className="grid gap-4">
        <div>
          <Label>Button Text</Label>
          <Input
            value={buttonContent.text}
            onChange={(e) => onChange({ ...buttonContent, text: e.target.value })}
            placeholder="Enter button text"
          />
        </div>
        <div>
          <Label>URL</Label>
          <Input
            value={buttonContent.url}
            onChange={(e) => onChange({ ...buttonContent, url: e.target.value })}
            placeholder="Enter URL"
            type="url"
          />
        </div>
      </div>

      {/* Color pickers */}
      <div className="grid gap-4">
        <div>
          <Label>Background Color</Label>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[80px] h-[35px] p-1"
                  style={{ backgroundColor: buttonContent.backgroundColor }}
                >
                  <span className="sr-only">Pick background color</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="flex flex-col gap-2">
                  <Input
                    type="color"
                    value={buttonContent.backgroundColor}
                    onChange={(e) =>
                      onChange({ ...buttonContent, backgroundColor: e.target.value })
                    }
                    className="w-full h-8"
                  />
                  <Input
                    type="text"
                    value={buttonContent.backgroundColor}
                    onChange={(e) =>
                      onChange({ ...buttonContent, backgroundColor: e.target.value })
                    }
                    placeholder="#000000"
                  />
                </div>
              </PopoverContent>
            </Popover>
            <span className="text-sm text-muted-foreground">
              {buttonContent.backgroundColor}
            </span>
          </div>
        </div>

        <div>
          <Label>Text Color</Label>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[80px] h-[35px] p-1"
                  style={{ backgroundColor: buttonContent.textColor }}
                >
                  <span className="sr-only">Pick text color</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="flex flex-col gap-2">
                  <Input
                    type="color"
                    value={buttonContent.textColor}
                    onChange={(e) =>
                      onChange({ ...buttonContent, textColor: e.target.value })
                    }
                    className="w-full h-8"
                  />
                  <Input
                    type="text"
                    value={buttonContent.textColor}
                    onChange={(e) =>
                      onChange({ ...buttonContent, textColor: e.target.value })
                    }
                    placeholder="#ffffff"
                  />
                </div>
              </PopoverContent>
            </Popover>
            <span className="text-sm text-muted-foreground">
              {buttonContent.textColor}
            </span>
          </div>
        </div>
      </div>

      {/* Button Appearance */}
      <div className="grid gap-4">
        <div>
          <Label>Size</Label>
          <Select
            value={buttonContent.size}
            onValueChange={(value) => onChange({ ...buttonContent, size: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
              <SelectItem value="xl">Extra Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Style</Label>
          <Select
            value={buttonContent.style}
            onValueChange={(value) => onChange({ ...buttonContent, style: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solid">Solid</SelectItem>
              <SelectItem value="rounded">Rounded</SelectItem>
              <SelectItem value="pill">Pill</SelectItem>
              <SelectItem value="soft">Soft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Icon</Label>
          <Select
            value={buttonContent.icon}
            onValueChange={(value) => onChange({ ...buttonContent, icon: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select icon" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="arrow">Arrow</SelectItem>
              <SelectItem value="chevron">Chevron</SelectItem>
              <SelectItem value="external">External Link</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Animation</Label>
          <Select
            value={buttonContent.animation}
            onValueChange={(value) => previewAnimation(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select animation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="hover">Hover Slide</SelectItem>
              <SelectItem value="pulse">Pulse</SelectItem>
              <SelectItem value="bounce">Bounce</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Alignment</Label>
          <Select
            value={buttonContent.alignment}
            onValueChange={(value) => onChange({ ...buttonContent, alignment: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select alignment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Underline</Label>
          <Switch
            checked={buttonContent.underline}
            onCheckedChange={(checked) => 
              onChange({ ...buttonContent, underline: checked })
            }
          />
        </div>
      </div>

      {/* Button Options */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Full Width</Label>
          <Switch
            checked={buttonContent.fullWidth}
            onCheckedChange={(checked) => 
              onChange({ ...buttonContent, fullWidth: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Open in New Tab</Label>
          <Switch
            checked={buttonContent.openInNewTab}
            onCheckedChange={(checked) => 
              onChange({ ...buttonContent, openInNewTab: checked })
            }
          />
        </div>
      </div>
    </div>
  );
};