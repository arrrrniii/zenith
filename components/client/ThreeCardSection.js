
// components/client/ThreeCardSection.js
import React from 'react';
import BaseCardSection from './BaseCardSection';
import { SECTION_LAYOUTS } from '@/types';

const ThreeCardSection = ({ title, subtitle, items, cardType }) => (
  <BaseCardSection
    title={title}
    subtitle={subtitle}
    items={items}
    cardType={cardType}
    layout={SECTION_LAYOUTS.THREE}
  />
);

export default ThreeCardSection;