// components/SettingsTab/FeatureList.jsx
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react'; // Added import for icons

export const FeatureList = ({ features, onChange, error }) => {
    const addFeature = () => {
      onChange([...features, '']);
    };
  
    const removeFeature = (index) => {
      const newFeatures = features.filter((_, i) => i !== index);
      onChange(newFeatures.length ? newFeatures : ['']);
    };
  
    const updateFeature = (index, value) => {
      const newFeatures = [...features];
      newFeatures[index] = value;
      onChange(newFeatures);
    };
  
    return (
      <div className="space-y-4">
        <Label className="flex items-center gap-2">
          Key Features
          <span className="text-xs text-gray-500">
            (Helps with SEO and content structure)
          </span>
        </Label>
        
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                placeholder="e.g., '24/7 Support', 'Custom Development'"
                className={error ? 'border-red-500' : ''}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => removeFeature(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button
            variant="outline"
            onClick={addFeature}
          >
            Add Feature
          </Button>
          
          {error && (
            <div className="text-sm text-red-500">{error}</div>
          )}
        </div>
      </div>
    );
  };