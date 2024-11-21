import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Type, 
  Image as ImageIcon,
  X,
  Palette,
  Maximize,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  ArrowLeft,
  Lock,
  Unlock,
  Settings,
  SunMedium,
  TextSelect,
  Layers,
  GripHorizontal,
  Palette as PaletteIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

const PaddingInput = ({ value, onChange, icon: Icon, label }) => (
  <div className="space-y-1">
    <Label className="text-xs">{label}</Label>
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-gray-500" />
      <Input
        type="number"
        value={value || 0}
        onChange={(e) => onChange(e.target.valueAsNumber || 0)}
        className="w-20"
        min={0}
        max={100}
      />
    </div>
  </div>
);

export const HeadingEditor = ({ content, onChange }) => {
  const [paddingLinked, setPaddingLinked] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Preset colors for quick selection
  const presetColors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#808080', '#800000',
    '#008000', '#000080', '#808000', '#800080', '#008080',
    '#FFA500', '#A52A2A', '#8B4513', '#556B2F', '#483D8B'
  ];

  // Default advanced options
  const defaultAdvanced = {
    darkOverlay: false,
    overlayOpacity: 0.3,
    textShadow: false,
    shadowColor: 'rgba(0,0,0,0.4)',
    shadowBlur: 3,
    letterSpacing: 0,
    textTransform: 'none',
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({
          ...content,
          backgroundImage: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearBackgroundImage = () => {
    onChange({
      ...content,
      backgroundImage: null
    });
  };

  const handlePaddingChange = (value, side) => {
    const currentPadding = content.padding || {};
    
    if (paddingLinked) {
      onChange({
        ...content,
        padding: {
          top: value,
          right: value,
          bottom: value,
          left: value
        }
      });
    } else {
      onChange({
        ...content,
        padding: {
          ...currentPadding,
          [side]: value
        }
      });
    }
  };

  const updateAdvancedOption = (key, value) => {
    onChange({
      ...content,
      advanced: {
        ...content.advanced,
        [key]: value
      }
    });
  };

  // Function to get the actual advanced options with defaults
  const getAdvancedOptions = () => {
    return {
      ...defaultAdvanced,
      ...content.advanced
    };
  };

  const advancedOptions = getAdvancedOptions();


  return (
    <div className="space-y-4">
      {/* Text and Level Controls */}
      <div className="flex gap-4">
        <Input
          value={content.text || 'New Heading'}
          onChange={(e) => onChange({
            ...content,
            text: e.target.value
          })}
          placeholder="Heading text"
          className="flex-1"
        />
        <Select
          value={content.level || 'h2'}
          onValueChange={(value) => onChange({
            ...content,
            level: value
          })}
        >
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(level => (
              <SelectItem key={level} value={level}>
                {level.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Basic Controls Section */}
      <div className="space-y-4 rounded-lg border p-4">
        {/* Color Controls */}
        <div className="grid grid-cols-2 gap-4">
          {/* Text Color */}
          <div className="space-y-2">
            <Label className="text-xs">Text Color</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                >
                  <div 
                    className="h-4 w-4 rounded border"
                    style={{ backgroundColor: content.color || '#000000' }}
                  />
                  <Type className="h-4 w-4" />
                  <span>Text Color</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="grid grid-cols-5 gap-2">
                  {presetColors.map((color) => (
                    <Button
                      key={color}
                      variant="ghost"
                      className="w-8 h-8 p-0"
                      style={{ backgroundColor: color }}
                      onClick={() => onChange({
                        ...content,
                        color: color
                      })}
                    />
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <Input
                    type="color"
                    value={content.color || '#000000'}
                    onChange={(e) => onChange({
                      ...content,
                      color: e.target.value
                    })}
                    className="w-full"
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Background Color */}
          <div className="space-y-2">
            <Label className="text-xs">Background Color</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                >
                  <div 
                    className="h-4 w-4 rounded border"
                    style={{ backgroundColor: content.backgroundColor || 'transparent' }}
                  />
                  <Palette className="h-4 w-4" />
                  <span>Background</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="grid grid-cols-5 gap-2">
                  {[...presetColors, 'transparent'].map((color) => (
                    <Button
                      key={color}
                      variant="ghost"
                      className={cn(
                        "w-8 h-8 p-0",
                        color === 'transparent' && "bg-transparent border-2 border-dashed"
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => onChange({
                        ...content,
                        backgroundColor: color
                      })}
                    />
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <Input
                    type="color"
                    value={content.backgroundColor || '#ffffff'}
                    onChange={(e) => onChange({
                      ...content,
                      backgroundColor: e.target.value
                    })}
                    className="w-full"
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Background Image Control */}
        <div className="space-y-2">
          <Label className="text-xs">Background Image</Label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 justify-start gap-2"
              onClick={() => document.getElementById('bg-image-input').click()}
            >
              <ImageIcon className="h-4 w-4" />
              <span>Choose Image</span>
            </Button>
            {content.backgroundImage && (
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={clearBackgroundImage}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <input
              id="bg-image-input"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          {content.backgroundImage && (
            <div className="mt-2 relative w-full h-20 rounded overflow-hidden">
              <img
                src={content.backgroundImage}
                alt="Background preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Padding Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Padding</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPaddingLinked(!paddingLinked)}
              className="h-8 w-8 p-0"
            >
              {paddingLinked ? (
                <Lock className="h-4 w-4" />
              ) : (
                <Unlock className="h-4 w-4" />
              )}
            </Button>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">All Sides</TabsTrigger>
              <TabsTrigger value="individual">Individual</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-2">
              <div className="flex items-end gap-4">
                <PaddingInput
                  value={content.padding?.top || 0}
                  onChange={(value) => handlePaddingChange(value, 'top')}
                  icon={Maximize}
                  label="All Padding"
                />
                <div className="text-xs text-gray-500 mb-2">px</div>
              </div>
            </TabsContent>
            
            <TabsContent value="individual" className="mt-2">
              <div className="grid grid-cols-2 gap-4">
                <PaddingInput
                  value={content.padding?.top || 0}
                  onChange={(value) => handlePaddingChange(value, 'top')}
                  icon={ArrowUp}
                  label="Top"
                />
                <PaddingInput
                  value={content.padding?.right || 0}
                  onChange={(value) => handlePaddingChange(value, 'right')}
                  icon={ArrowRight}
                  label="Right"
                />
                <PaddingInput
                  value={content.padding?.bottom || 0}
                  onChange={(value) => handlePaddingChange(value, 'bottom')}
                  icon={ArrowDown}
                  label="Bottom"
                />
                <PaddingInput
                  value={content.padding?.left || 0}
                  onChange={(value) => handlePaddingChange(value, 'left')}
                  icon={ArrowLeft}
                  label="Left"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Alignment Controls */}
        <div className="flex justify-end gap-2">
          {['left', 'center', 'right'].map((align) => (
            <Button
              key={align}
              variant="ghost"
              size="sm"
              onClick={() => onChange({
                ...content,
                align: align
              })}
              className={content.align === align ? 'bg-gray-100' : ''}
            >
              {align === 'left' && <AlignLeft className="h-4 w-4" />}
              {align === 'center' && <AlignCenter className="h-4 w-4" />}
              {align === 'right' && <AlignRight className="h-4 w-4" />}
            </Button>
          ))}
        </div>
      </div>

      {/* Advanced Options Switch */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-gray-500" />
          <Label className="text-sm">Advanced Options</Label>
        </div>
        <Switch
          checked={showAdvanced}
          onCheckedChange={setShowAdvanced}
        />
      </div>

      {/* Advanced Options Section */}
      {showAdvanced && (
        <div className="space-y-4 rounded-lg border p-4 bg-gray-50">
          {/* Dark Overlay Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Dark Overlay
              </Label>
              <Switch
                checked={advancedOptions.darkOverlay}
                onCheckedChange={(checked) => updateAdvancedOption('darkOverlay', checked)}
              />
            </div>
            {advancedOptions.darkOverlay && (
              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-2">
                  <SunMedium className="h-4 w-4" />
                  Overlay Opacity
                </Label>
                <Slider
                  value={[advancedOptions.overlayOpacity * 100]}
                  onValueChange={([value]) => updateAdvancedOption('overlayOpacity', value / 100)}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            )}
          </div>
          {/* Text Enhancement Controls */}
          <div className="space-y-4 pt-4 border-t">
            <Label className="text-xs flex items-center gap-2">
              <TextSelect className="h-4 w-4" />
              Text Enhancements
            </Label>

            {/* Text Shadow */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Text Shadow</Label>
                <Switch
                  checked={advancedOptions.textShadow}
                  onCheckedChange={(checked) => updateAdvancedOption('textShadow', checked)}
                />
              </div>
              {advancedOptions.textShadow && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Shadow Color</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start gap-2"
                          >
                            <div 
                              className="h-4 w-4 rounded border"
                              style={{ backgroundColor: advancedOptions.shadowColor }}
                            />
                            <PaletteIcon className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64">
                          <div className="space-y-2">
                            <Input
                              type="color"
                              value={advancedOptions.shadowColor}
                              onChange={(e) => updateAdvancedOption('shadowColor', e.target.value)}
                              className="w-full"
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Shadow Blur</Label>
                      <Slider
                        value={[advancedOptions.shadowBlur]}
                        onValueChange={([value]) => updateAdvancedOption('shadowBlur', value)}
                        min={0}
                        max={20}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Letter Spacing */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs flex items-center gap-2">
                  <GripHorizontal className="h-4 w-4" />
                  Letter Spacing
                </Label>
              </div>
              <Slider
                value={[advancedOptions.letterSpacing]}
                onValueChange={([value]) => updateAdvancedOption('letterSpacing', value)}
                min={-3}
                max={10}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Text Transform */}
            <div className="space-y-2">
              <Label className="text-xs">Text Transform</Label>
              <Select
                value={advancedOptions.textTransform}
                onValueChange={(value) => updateAdvancedOption('textTransform', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select text transform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="uppercase">Uppercase</SelectItem>
                  <SelectItem value="lowercase">Lowercase</SelectItem>
                  <SelectItem value="capitalize">Capitalize</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview */}
      <div className="space-y-2">
        <Label className="text-xs">Preview</Label>
        <div
          className={cn(
            "rounded-lg overflow-hidden relative",
            content.backgroundImage && "min-h-[100px]"
          )}
        >
          {/* Background Image */}
          {content.backgroundImage && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${content.backgroundImage})`
              }}
            />
          )}
          
          {/* Dark Overlay */}
          {(content.backgroundImage && advancedOptions.darkOverlay) && (
            <div 
              className="absolute inset-0 bg-black"
              style={{
                opacity: advancedOptions.overlayOpacity
              }}
            />
          )}
          
          {/* Content */}
          <div
            className="relative"
            style={{
              textAlign: content.align || 'left',
              color: content.color || 'inherit',
              backgroundColor: !content.backgroundImage ? (content.backgroundColor || 'transparent') : undefined,
              paddingTop: `${content.padding?.top || 0}px`,
              paddingRight: `${content.padding?.right || 0}px`,
              paddingBottom: `${content.padding?.bottom || 0}px`,
              paddingLeft: `${content.padding?.left || 0}px`,
              textShadow: advancedOptions.textShadow 
                ? `0 2px ${advancedOptions.shadowBlur}px ${advancedOptions.shadowColor}`
                : undefined,
              letterSpacing: `${advancedOptions.letterSpacing}px`,
              textTransform: advancedOptions.textTransform
            }}
          >
            <span className="font-semibold">Preview: </span>
            {content.text || 'New Heading'} ({content.level || 'h2'})
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadingEditor;