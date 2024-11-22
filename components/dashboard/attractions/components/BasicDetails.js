import React from 'react';
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormSection,
  FormField,
} from '../FormComponents';

const BasicDetails = ({ formData, updateFormData, errors, loading }) => {
  // Sample country list - you can expand this or fetch from an API
// Country and city data
const countries = [
    { code: 'AL', name: 'Albania' },
    { code: 'XK', name: 'Kosova' }
  ];
  
  const cities = {
    AL: [
      'Tirana',
      'Durrës',
      'Vlorë',
      'Elbasan',
      'Shkodër',
      'Korçë',
      'Fier',
      'Berat',
      'Lushnjë',
      'Pogradec',
      'Kavajë',
      'Gjirokastër',
      'Krujë',
      'Kuçovë',
      'Kukës',
      'Lezhë',
      'Peshkopi',
      'Sarandë',
      'Patos',
      'Tepelenë'
    ],
    XK: [
      'Pristina',
      'Prizren',
      'Ferizaj',
      'Pejë',
      'Gjakovë',
      'Gjilan',
      'Mitrovicë',
      'Podujevë',
      'Vushtrri',
      'Suharekë',
      'Rahovec',
      'Drenas',
      'Lipjan',
      'Malishevë',
      'Kamenicë',
      'Viti',
      'Deçan',
      'Istog',
      'Klinë',
      'Skenderaj'
    ]
  };

  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="space-y-2 mb-6">
        <h2 className="text-2xl font-bold">Basic Information</h2>
        <p className="text-gray-500">
          Enter the essential details about your attraction
        </p>
      </div>

      <div className="space-y-6">
        <FormField
          label="Name"
          error={errors.name}
          required
          description="Enter the official name of the attraction"
        >
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            className={`w-full px-3 py-2 rounded-md border shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
            required
            placeholder="Enter attraction name"
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Country"
            error={errors.country}
            required
            description="Select the country where the attraction is located"
          >
            <Select
              value={formData.country}
              onValueChange={(value) => updateFormData('country', value)}
              disabled={loading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="City"
            error={errors.city}
            required
            description="Select the city where the attraction is located"
          >
            <Select
              value={formData.city}
              onValueChange={(value) => updateFormData('city', value)}
              disabled={loading || !formData.country}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a city" />
              </SelectTrigger>
              <SelectContent>
                {formData.country &&
                  cities[formData.country]?.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>

        <FormField
          label="Description"
          error={errors.description}
          required
          description="Provide a detailed description of the attraction"
        >
          <textarea
            value={formData.description}
            onChange={(e) => updateFormData('description', e.target.value)}
            rows={4}
            className={`w-full px-3 py-2 rounded-md border shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
            required
            placeholder="Describe the attraction, its features, and what makes it special..."
          />
        </FormField>
      </div>
    </div>
  );
};

export default BasicDetails;