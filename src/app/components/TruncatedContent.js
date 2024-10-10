"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const YouTubeEmbed = ({ url }) => {
  const videoId = url.split('v=')[1];
  return (
    <div className="aspect-w-16 aspect-h-9 my-4">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full rounded-lg"
      ></iframe>
    </div>
  );
};

const CustomLink = ({ href, children }) => {
  if (href && (href.includes('youtube.com') || href.includes('youtu.be'))) {
    return <YouTubeEmbed url={href} />;
  }
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
};

const TruncatedContent = ({ content, maxLength = 300 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const truncatedContent = isExpanded ? content : content.slice(0, maxLength);

  return (
    <div className="markdown-content">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          a: CustomLink,
        }}
      >
        {truncatedContent}
      </ReactMarkdown>
      {content.length > maxLength && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-300 hover:text-blue-400 mt-2"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
};

export default TruncatedContent;