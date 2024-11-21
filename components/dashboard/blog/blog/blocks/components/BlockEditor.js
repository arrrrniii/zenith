// components/admin/dashboard/blog/blocks/components/BlockEditor.js
import React from 'react';
import { Alert } from '@/components/ui/alert';
import * as editors from './editors';
import { getBlockConfig } from '../config';
import useBlockStore from '../store'; // Import the store

export const BlockEditor = ({ block, onChange }) => {
  const updateBlock = useBlockStore((state) => state.updateBlock); // Get updateBlock from the store

  if (!block || typeof block !== 'object') {
    return (
      <Alert variant="destructive">
        <p>Invalid block data</p>
      </Alert>
    );
  }

  const blockType = block.type && typeof block.type === 'string' ? block.type : 'default';
  const config = getBlockConfig(blockType);

  const handleChange = (updates) => {
    const newContent = {
      ...block.content,
      ...updates,
    };

    if (onChange) {
      onChange(newContent);
    } else {
      // Use the global store to update the block if onChange is not provided
      updateBlock(block.id, {
        content: newContent,
      });
    }
  };

  const editorName =
    blockType
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('') + 'Editor';

  const EditorComponent = editors[editorName] || editors.DefaultEditor;

  if (!EditorComponent) {
    return (
      <Alert variant="destructive">
        <p>No editor found for block type: {blockType}</p>
        <p>Attempted to find: {editorName}</p>
      </Alert>
    );
  }

  return (
    <EditorComponent
      content={block.content || {}}
      onChange={handleChange}
      config={config}
    />
  );
};
