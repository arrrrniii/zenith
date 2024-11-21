// components/client/FiveCardSection.js
import React from 'react';
import BaseCardSection from './BaseCardSection';
import { SECTION_LAYOUTS } from '@/types';

const FiveCardSection = ({ title, subtitle, items, cardType }) => (
  <BaseCardSection
    title={title}
    subtitle={subtitle}
    items={items}
    cardType={cardType}
    layout={SECTION_LAYOUTS.FIVE}
  />
);

export default FiveCardSection;