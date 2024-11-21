// components/BlockRenderer/blocks/InstagramBlock.jsx
import React from 'react';
import { cn } from '@/lib/utils';
import { Instagram as InstagramIcon } from 'lucide-react';

export const Instagram = ({ content }) => {
  const { postUrl = '' } = content;

  if (!postUrl) {
    return null;
  }

  // Extract post ID from URL
  const getInstagramId = (url) => {
    const regex = /(?:https?:\/\/(?:www\.)?instagram\.com(?:\/p\/|\/reel\/)([\w-]+))/i;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const postId = getInstagramId(postUrl);

  if (!postId) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-200">
        <InstagramIcon className="w-6 h-6 text-gray-400 mr-2" />
        <span className="text-gray-500">Invalid Instagram URL</span>
      </div>
    );
  }

  return (
    <figure className="my-6 mx-auto w-full max-w-[550px]">
      <div className="relative overflow-hidden bg-gray-50 rounded-lg">
        <iframe
          src={`https://www.instagram.com/p/${postId}/embed`}
          className="w-full aspect-square"
          frameBorder="0"
          scrolling="no"
          allowtransparency="true"
        />
      </div>
    </figure>
  );
};

