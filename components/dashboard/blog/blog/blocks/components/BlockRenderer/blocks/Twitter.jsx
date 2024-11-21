// components/BlockRenderer/blocks/Twitter.jsx
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Twitter as TwitterIcon } from 'lucide-react';

export const Twitter = ({ content }) => {
  const { tweetUrl = '', theme = 'light' } = content;

  useEffect(() => {
    // Load Twitter widget script
    if (tweetUrl && window.twttr) {
      window.twttr.widgets.load();
    }
  }, [tweetUrl]);

  if (!tweetUrl) {
    return null;
  }

  // Extract tweet ID from URL (supporting both twitter.com and x.com)
  const getTweetId = (url) => {
    const regex = /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/i;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const tweetId = getTweetId(tweetUrl);

  if (!tweetId) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-200">
        <TwitterIcon className="w-6 h-6 text-gray-400 mr-2" />
        <span className="text-gray-500">Invalid post URL</span>
      </div>
    );
  }

  // Convert x.com URLs to twitter.com for the embed
  const embedUrl = tweetUrl.replace('x.com', 'twitter.com');

  return (
    <figure className="my-6 mx-auto w-full max-w-[550px]">
      <blockquote
        className="twitter-tweet"
        data-theme={theme}
      >
        <a href={embedUrl}>Loading post...</a>
      </blockquote>
      <script
        async
        src="https://platform.twitter.com/widgets.js"
        charSet="utf-8"
      />
    </figure>
  );
};