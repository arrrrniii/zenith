// components/PreviewTab/index.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Laptop, 
  Smartphone, 
  Tablet, 
  RefreshCw,
  Maximize2,
  Share2,
  Printer,
  Palette,
  Sun,
  Moon
} from 'lucide-react';
import { BlockRenderer } from '../BlockRenderer';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

export const PreviewTab = ({ blocks = [], formData = {} }) => {
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [orientation, setOrientation] = useState('portrait');
  const [browserFrame, setBrowserFrame] = useState(true);

  const {
    title = '',
    description = '',
    features = []
  } = formData;

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Device dimensions
  const deviceDimensions = {
    mobile: { width: '375px', height: '667px' },
    tablet: { width: '768px', height: '1024px' },
    desktop: { width: '100%', height: '100%' }
  };

  // Browser frame component
  const BrowserFrame = ({ children }) => (
    <div className="rounded-lg overflow-hidden border border-gray-200 shadow-lg bg-white">
      {browserFrame && (
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="flex-1 px-2">
            <div className="bg-white rounded-md px-3 py-1 text-sm text-gray-600 flex items-center justify-between">
              <span>yoursite.com/blog/{formData.slug || ''}</span>
              <RefreshCw className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Controls Header */}
      <div className="border-b p-4 space-y-4">
        {/* Device Selection */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <Button
              variant={previewDevice === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewDevice('desktop')}
            >
              <Laptop className="w-4 h-4 mr-2" />
              Desktop
            </Button>
            <Button
              variant={previewDevice === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewDevice('tablet')}
            >
              <Tablet className="w-4 h-4 mr-2" />
              Tablet
            </Button>
            <Button
              variant={previewDevice === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewDevice('mobile')}
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Mobile
            </Button>
          </div>

          {/* Additional Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4" />
              <Switch
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
              <Moon className="w-4 h-4" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Zoom:</span>
              <Slider
                value={[zoom]}
                onValueChange={([value]) => setZoom(value)}
                min={50}
                max={150}
                step={10}
                className="w-32"
              />
              <span className="text-sm text-gray-500">{zoom}%</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBrowserFrame(!browserFrame)}
              >
                <Palette className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOrientation(o => o === 'portrait' ? 'landscape' : 'portrait')}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.print()}
              >
                <Printer className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-hidden bg-gray-100 p-6 overflow-y-auto">
        <div className="h-full flex items-center justify-center">
          <div
            style={{
              width: deviceDimensions[previewDevice].width,
              height: orientation === 'portrait' ? deviceDimensions[previewDevice].height : 'auto',
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'center top'
            }}
            className="transition-all duration-300"
          >
            <BrowserFrame>
              <div className={`
                overflow-y-auto bg-white
                ${isDarkMode ? 'dark' : ''}
              `}>
                <article className={`
                  prose max-w-none
                  ${isDarkMode ? 'prose-invert' : ''}
                  ${previewDevice === 'mobile' ? 'p-4' : 'p-8'}
                `}>

                  {/* Content Blocks */}
                  {Array.isArray(blocks) && blocks.length > 0 ? (
                    <BlockRenderer blocks={blocks} isDarkMode={isDarkMode} />
                  ) : (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <p>No content blocks added yet.</p>
                      <p className="text-sm">Add some content blocks to see them in preview.</p>
                    </div>
                  )}
                </article>
              </div>
            </BrowserFrame>
          </div>
        </div>
      </div>
    </div>
  );
};