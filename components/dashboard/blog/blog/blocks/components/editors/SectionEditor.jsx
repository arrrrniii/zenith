// components/admin/dashboard/service/blocks/components/editors/SectionEditor.jsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { BlockPalette } from '../BlockPalette';
import { BlockCanvas } from '../BlockCanvas';

export const SectionEditor = ({ content, onChange }) => {
  // Initialize default content
  const sectionContent = {
    title: '',
    subtitle: '',
    background: 'white', // white, light, dark, primary, gradient
    padding: 'medium', // small, medium, large
    container: 'default', // default, narrow, wide, full
    divider: 'none', // none, line, shadow, wave
    anchor: '',
    animation: 'none', // none, fade, slide
    fullHeight: false,
    centerContent: false,
    blocks: [],
    ...content
  };

  // Handle nested blocks changes
  const handleBlocksChange = (newBlocks) => {
    onChange({
      ...sectionContent,
      blocks: newBlocks
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Settings */}
      <div className="grid gap-4">
        {/* Title & Subtitle */}
        <div className="space-y-4">
          <div>
            <Label>Section Title (Optional)</Label>
            <Input
              value={sectionContent.title}
              onChange={(e) => onChange({ ...sectionContent, title: e.target.value })}
              placeholder="Enter section title"
            />
          </div>
          <div>
            <Label>Subtitle (Optional)</Label>
            <Input
              value={sectionContent.subtitle}
              onChange={(e) => onChange({ ...sectionContent, subtitle: e.target.value })}
              placeholder="Enter section subtitle"
            />
          </div>
        </div>

        {/* Background */}
        <div>
          <Label>Background</Label>
          <Select
            value={sectionContent.background}
            onValueChange={(value) => onChange({ ...sectionContent, background: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select background" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="white">White</SelectItem>
              <SelectItem value="light">Light Gray</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="primary">Primary Color</SelectItem>
              <SelectItem value="gradient">Gradient</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Padding */}
        <div>
          <Label>Padding</Label>
          <Select
            value={sectionContent.padding}
            onValueChange={(value) => onChange({ ...sectionContent, padding: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select padding" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Container Width */}
        <div>
          <Label>Container Width</Label>
          <Select
            value={sectionContent.container}
            onValueChange={(value) => onChange({ ...sectionContent, container: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select container width" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="narrow">Narrow</SelectItem>
              <SelectItem value="wide">Wide</SelectItem>
              <SelectItem value="full">Full Width</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Divider */}
        <div>
          <Label>Divider</Label>
          <Select
            value={sectionContent.divider}
            onValueChange={(value) => onChange({ ...sectionContent, divider: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select divider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="line">Line</SelectItem>
              <SelectItem value="shadow">Shadow</SelectItem>
              <SelectItem value="wave">Wave</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Anchor ID */}
        <div>
          <Label>Anchor ID (Optional)</Label>
          <Input
            value={sectionContent.anchor}
            onChange={(e) => onChange({ ...sectionContent, anchor: e.target.value })}
            placeholder="section-id"
          />
        </div>

        {/* Animation */}
        <div>
          <Label>Animation</Label>
          <Select
            value={sectionContent.animation}
            onValueChange={(value) => onChange({ ...sectionContent, animation: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select animation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="fade">Fade In</SelectItem>
              <SelectItem value="slide">Slide Up</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Toggles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Full Height Section</Label>
            <Switch
              checked={sectionContent.fullHeight}
              onCheckedChange={(checked) => 
                onChange({ ...sectionContent, fullHeight: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Center Content</Label>
            <Switch
              checked={sectionContent.centerContent}
              onCheckedChange={(checked) => 
                onChange({ ...sectionContent, centerContent: checked })
              }
            />
          </div>
        </div>
      </div>

      {/* Nested Blocks */}
      <div className="border-t pt-6">
        <Label>Section Content</Label>
        <div className="mt-4 border rounded-lg overflow-hidden">
          <div className="flex">
            <BlockPalette />
            <BlockCanvas 
              blocks={sectionContent.blocks}
              onChange={handleBlocksChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};