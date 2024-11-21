// components/client/FourCardSection.js
import React from 'react';
import BaseCardSection from './BaseCardSection';
import { SECTION_LAYOUTS } from '@/types';

const FourCardSection = ({ title, subtitle, items, cardType }) => (
  <BaseCardSection
    title={title}
    subtitle={subtitle}
    items={items}
    cardType={cardType}
    layout={SECTION_LAYOUTS.FOUR}
  />
);

export default FourCardSection;
