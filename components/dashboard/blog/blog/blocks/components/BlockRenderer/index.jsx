//components/admin/dashboard/service/blocks/components/BlockRenderer/index.jsx
import React from 'react';
import { HeadingBlock } from './blocks/HeadingBlock';
import { ParagraphBlock } from './blocks/ParagraphBlock';
import { ImageBlock } from './blocks/ImageBlock';
import { ListBlock } from './blocks/ListBlock';
import { QuoteBlock } from './blocks/QuoteBlock';
import { CTABlock } from './blocks/CTABlock';
import { VideoBlock } from './blocks/VideoBlock';
import { TableBlock } from './blocks/TableBlock';
import { AlertBlock } from './blocks/AlertBlock';
import { CodeBlock } from './blocks/CodeBlock';
import { TextBlock } from './blocks/TextBlock';
import { ColumnsBlock } from './blocks/ColumnsBlock';
import { SectionBlock } from './blocks/SectionBlock';
import { ButtonBlock } from './blocks/ButtonBlock';
import { MapBlock } from './blocks/MapBlock';
import { Instagram } from './blocks/InstagramBlock';
import { Twitter } from './blocks/Twitter';
import { YouTubeBlock } from './blocks/YouTubeBlock';
import { FormBlock } from './blocks/FormBlock';


export const BlockRenderer = ({ blocks, nested = false }) => {
  const parseBlockContent = (block) => {
    try {
      const parsedContent = typeof block.content === 'string' 
        ? JSON.parse(block.content)
        : block.content;
      
      return {
        ...block,
        content: parsedContent,
      };
    } catch (error) {
      console.error(`Failed to parse content for block ${block.id}:`, error);
      return {
        ...block,
        content: {},
      };
    }
  };

  const renderBlock = (block) => {
    try {
      const { id, ...restProps } = parseBlockContent(block);
      
      // Add unique key to each block
      const commonProps = {
        ...restProps,
        nested, // Pass nested flag to prevent infinite recursion
      };

      switch (block.type) {
        case 'text':
          return <TextBlock key={id} {...commonProps} />;
        case 'heading':
          return <HeadingBlock key={id} {...commonProps} />;
        case 'paragraph':
          return <ParagraphBlock key={id} {...commonProps} />;
        case 'image':
          return <ImageBlock key={id} {...commonProps} />;
        case 'list':
          return <ListBlock key={id} {...commonProps} />;
        case 'quote':
          return <QuoteBlock key={id} {...commonProps} />;
        case 'cta':
          return <CTABlock key={id} {...commonProps} />;
        case 'video':
          return <VideoBlock key={id} {...commonProps} />;
        case 'table':
          return <TableBlock key={id} {...commonProps} />;
        case 'alert':
          return <AlertBlock key={id} {...commonProps} />;
        case 'code':
          return <CodeBlock key={id} {...commonProps} />;
        case 'button':
          return <ButtonBlock key={id} {...commonProps} />;
        case 'map':
          return <MapBlock key={id} {...commonProps} />;
        case 'youtube':
          return <YouTubeBlock key={id} {...commonProps} />;
        case 'instagram':
          return <Instagram key={id} {...commonProps} />;
        case 'twitter':
          return <Twitter key={id} {...commonProps} />;
          case 'form':
          return <FormBlock key={id} {...commonProps} />;
        case 'section':
          // Prevent deeply nested sections
          if (nested) {
            console.warn('Nested sections are not supported');
            return null;
          }
          return <SectionBlock key={id} {...commonProps} renderer={BlockRenderer} />;
        case 'columns':
          // Prevent nested columns to avoid complexity
          if (nested) {
            console.warn('Nested columns are not supported');
            return null;
          }
          return <ColumnsBlock key={id} {...commonProps} renderer={BlockRenderer} />;
        default:
          console.warn(`Unknown block type: ${block.type}`);
          return null;
      }
    } catch (error) {
      console.error(`Error rendering block:`, error, block);
      return null;
    }
  };

  // If no blocks, return null or a placeholder
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  // Render blocks with proper spacing
  return (
    <div className={`${nested ? '' : 'space-y-6'}`}>
      {blocks.map(renderBlock)}
    </div>
  );
};