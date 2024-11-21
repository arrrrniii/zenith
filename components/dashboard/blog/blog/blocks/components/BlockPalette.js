// components/admin/dashboard/blog/blocks/components/BlockPalette.js
import React, { useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { BLOCKS_CONFIG, BLOCK_CATEGORIES } from '../config';
import useBlockStore from '../store';
import { motion, AnimatePresence } from 'framer-motion';

export const BlockPalette = () => {
  const { searchQuery, selectedCategory, setSearchQuery, setSelectedCategory } = useBlockStore();

  const filteredBlocks = useMemo(() => {
    return BLOCKS_CONFIG.filter(block => {
      const matchesSearch = block.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          block.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || block.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="w-72 border-r flex flex-col h-full overflow-hidden"> {/* Changed h-screen to h-full */}
      <div className="p-4 border-b flex-shrink-0"> {/* Added flex-shrink-0 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blocks..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto"> {/* Simplified overflow handling */}
        <div className="p-4 space-y-6">
          {Object.entries(BLOCK_CATEGORIES).map(([key, category]) => {
            const categoryBlocks = filteredBlocks.filter(block => block.category === key);
            if (categoryBlocks.length === 0) return null;

            return (
              <div key={key}>
                <h3 className="text-sm font-medium text-gray-500 mb-2">{category.label}</h3>
                <AnimatePresence>
                  <div className="grid gap-2">
                    {categoryBlocks.map((block) => (
                      <motion.div
                        key={block.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-3 border rounded-lg hover:bg-gray-50 cursor-move"
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('block-type', block.id);
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <block.icon className="w-4 h-4 text-gray-500" />
                          <div>
                            <div className="font-medium text-sm">{block.label}</div>
                            <div className="text-xs text-gray-500">{block.description}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
