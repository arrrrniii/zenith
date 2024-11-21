//components/admin/dashboard/service/blocks/store.js
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { getBlockConfig } from './config';

const MAX_HISTORY_SIZE = 50;

// Create the store with updated syntax
const useBlockStore = create(
  devtools(
    persist(
      (set, get) => ({
        blocks: [],
        history: [],
        historyIndex: -1,
        selectedBlock: null,
        searchQuery: '',
        selectedCategory: 'all',

        // Block operations
        addBlock: (blockType, index) => {
          const blockConfig = getBlockConfig(blockType);
          if (!blockConfig) return;

          const newBlock = {
            id: `${blockType}-${Date.now()}`,
            type: blockType,
            content: { ...blockConfig.defaultContent }
          };

          set(state => {
            const newBlocks = [...state.blocks];
            newBlocks.splice(typeof index === 'number' ? index : newBlocks.length, 0, newBlock);
            return addToHistory({ ...state, blocks: newBlocks });
          });
        },

        updateBlock: (id, updates) => {
          set(state => {
            const newBlocks = state.blocks.map(block => {
              if (block.id === id) {
                return {
                  ...block,
                  ...updates,
                  content: {
                    ...block.content,
                    ...updates.content
                  }
                };
              }
              return block;
            });
        
            return addToHistory({ ...state, blocks: newBlocks });
          });
        },

        removeBlock: (blockId) => {
          set(state => {
            const newBlocks = state.blocks.filter(block => block.id !== blockId);
            return addToHistory({ ...state, blocks: newBlocks });
          });
        },

        moveBlock: (fromIndex, toIndex) => {
          set(state => {
            const newBlocks = [...state.blocks];
            const [movedBlock] = newBlocks.splice(fromIndex, 1);
            newBlocks.splice(toIndex, 0, movedBlock);
            
            // Update order_index for all blocks
            const updatedBlocks = newBlocks.map((block, index) => ({
              ...block,
              order_index: index
            }));
            
            return addToHistory({ ...state, blocks: updatedBlocks });
          });
        },

        // Selection
        setSelectedBlock: (blockId) => {
          set({ selectedBlock: blockId });
        },

        // Search and filtering
        setSearchQuery: (query) => {
          set({ searchQuery: query });
        },

        setSelectedCategory: (category) => {
          set({ selectedCategory: category });
        },

        // History management
        undo: () => {
          set(state => {
            if (state.historyIndex <= 0) return state;
            const newIndex = state.historyIndex - 1;
            return {
              ...state,
              blocks: [...state.history[newIndex].blocks],
              historyIndex: newIndex
            };
          });
        },

        redo: () => {
          set(state => {
            if (state.historyIndex >= state.history.length - 1) return state;
            const newIndex = state.historyIndex + 1;
            return {
              ...state,
              blocks: [...state.history[newIndex].blocks],
              historyIndex: newIndex
            };
          });
        },

        // Bulk operations
        setBlocks: (blocks) => {
          // Ensure all blocks have order_index
          const blocksWithOrder = blocks.map((block, index) => ({
            ...block,
            order_index: block.order_index ?? index
          }));
          set(state => addToHistory({ ...state, blocks: blocksWithOrder }));
        },

        // Clear everything
        reset: () => {
          set({ blocks: [], history: [], historyIndex: -1, selectedBlock: null });
        },

        // Debug helper
        getState: () => get()
      }),
      {
        name: 'block-store', // unique name for localStorage
        version: 1,
        partialize: (state) => ({
          blocks: state.blocks // only persist blocks, not history
        })
      }
    )
  )
);

// Helper function to manage history
const addToHistory = (state) => {
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push({ blocks: [...state.blocks] });
  
  if (newHistory.length > MAX_HISTORY_SIZE) {
    newHistory.shift();
  }

  return {
    ...state,
    history: newHistory,
    historyIndex: newHistory.length - 1
  };
};

export default useBlockStore;