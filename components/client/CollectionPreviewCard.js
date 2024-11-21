// components/client/CollectionPreviewCard.js

import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Import Link from next/link
import { Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';

const CollectionPreviewCard = ({
  image,
  title,
  author,
  itemCount,
  href, // Add href prop
  className = "",
}) => (
  <Card className={`w-full overflow-hidden ${className}`}>
    {/* Wrap the content with Link */}
    <Link href={href} className="block group">
      {/* Image Section */}
      <div className="relative aspect-[4/3]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw,
                 (max-width: 1200px) 50vw,
                 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      {/* Content Section */}
      <div className="p-4">
        <p className="text-sm text-gray-600">{author}</p>
        <h3 className="font-semibold text-lg mt-1 line-clamp-2">{title}</h3>
        <div className="flex items-center gap-2 mt-2">
          <Heart className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-600">{itemCount} items</span>
        </div>
      </div>
    </Link>
  </Card>
);

export default CollectionPreviewCard;
