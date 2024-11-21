// components/dashboard/attractions/AttractionsList.js
import React from 'react';
import AttractionCard from './AttractionCard';

const AttractionsList = ({ attractions, onEdit, onDelete, onView }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {attractions.map((attraction) => (
      <AttractionCard
        key={attraction.id}
        attraction={attraction}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
      />
    ))}
  </div>
);

export default AttractionsList;