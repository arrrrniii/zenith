// components/client/ImageOverlayCard.js

import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Import Link from next/link
import { Card } from '@/components/ui/card';

const ImageOverlayCard = ({
  image,
  title,
  badge,
  href, // Add href prop
  className = "",
}) => (
  <div className={`w-full ${className}`}>
    <Card className="h-64">
      {/* Wrap the content with Link */}
      <Link href={href} className="relative w-full h-full overflow-hidden group block">
        <div className="relative w-full h-full">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw,
                   (max-width: 1200px) 50vw,
                   33vw"
            priority
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        {/* Badge */}
        {badge && (
          <div className="absolute top-4 left-4 bg-yellow-400 text-black font-semibold px-2 py-1 rounded text-sm">
            {badge}
          </div>
        )}
        {/* Title */}
        <h3 className="absolute bottom-6 left-6 text-white text-xl font-bold z-10 line-clamp-2">
          {title}
        </h3>
      </Link>
    </Card>
  </div>
);

export default ImageOverlayCard;
