// components/client/MediaDetailCard.js

import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Import Link from next/link
import { Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';

const MediaDetailCard = ({
  image,
  title,
  subtitle,
  metadata,
  badge,
  href, // Add href prop
  className = "",
}) => (
  <Card className={`w-full overflow-hidden ${className}`}>
    {/* Wrap the content with Link */}
    <Link href={href} className="block group">
      {/* Image Section */}
      <div className="relative aspect-video">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw,
                 (max-width: 1200px) 50vw,
                 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Heart Icon Button */}
        <button
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 z-10"
          onClick={(e) => e.preventDefault()} // Prevent navigation when clicking the button
        >
          <Heart className="w-4 h-4" />
        </button>
        {/* Badge */}
        {badge && (
          <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs rounded z-10">
            {badge}
          </span>
        )}
      </div>
      {/* Content Section */}
      <div className="p-4">
        {subtitle && (
          <p className="text-sm text-gray-600">{subtitle}</p>
        )}
        <h3 className="font-medium text-base mt-1 line-clamp-2">{title}</h3>
        {metadata && (
          <div className="mt-2">
            {metadata}
          </div>
        )}
      </div>
    </Link>
  </Card>
);

export default MediaDetailCard;
