import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { DialogHeader } from './blocks/components/DialogHeader';
import { BasicDetailsTab } from './blocks/components/BasicDetailsTab';
import { ContentBuilderTab } from './blocks/components/ContentBuilderTab';
import { PreviewTab } from './blocks/components/PreviewTab';
import { SettingsTab } from './blocks/components/SettingsTab';
import { useServiceForm } from './blocks/hooks/useServiceForm';
import { useKeyboardShortcuts } from './blocks/hooks/useKeyboardShortcuts';
import useBlockStore from './blocks/store';
import { useMutation } from '@apollo/client';
import { INSERT_BLOG, UPDATE_BLOG } from '../graphql/BlogMutations';

const ServiceDialog = ({ service, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState('details');
  const { formData, handleFormChange, handleImageUpload, handleImageRemove, imagePreview } = useServiceForm(service);
  const { blocks, setBlocks, undo, redo, history, historyIndex } = useBlockStore();
  const { toast } = useToast();

  const [insertService, { loading: insertLoading }] = useMutation(INSERT_BLOG);
  const [updateService, { loading: updateLoading }] = useMutation(UPDATE_BLOG);

  const isLoading = insertLoading || updateLoading;

  useKeyboardShortcuts();

  useEffect(() => {
    if (!service) {
      setBlocks([]);
      return;
    }

    try {
      const contentBlocks = service.blog_content_blocks || [];
      
      const existingBlocks = contentBlocks.map(block => {
        try {
          const parsedContent = typeof block.content === 'string' 
            ? JSON.parse(block.content) 
            : block.content;

          return {
            id: block.id || `block-${Date.now()}-${Math.random()}`,
            type: block.type || block.block_type || 'text',
            content: parsedContent,
            parentId: block.parent_block_id,
            orderIndex: block.order_index
          };
        } catch (error) {
          console.error(`Error parsing block content:`, error);
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => a.orderIndex - b.orderIndex);

      setBlocks(existingBlocks);
    } catch (error) {
      console.error('Error processing blog blocks:', error);
      toast({
        title: 'Error loading blocks',
        description: 'There was an error loading the blog content blocks.',
        variant: 'destructive',
      });
      setBlocks([]);
    }
  }, [service, setBlocks, toast]);

  const validateForm = () => {
    const errors = {};
    if (!formData.title?.trim()) errors.title = 'Title is required';
    if (!formData.slug?.trim()) errors.slug = 'Slug is required';
    if (!formData.titletag?.trim()) errors.titletag = 'Title tag is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const status = (formData.status || 'DRAFT').toUpperCase();
      
      const formattedContentBlocks = blocks.map((block, index) => ({
        type: block.type,
        content: JSON.stringify(block.content),
        order_index: index,
        parent_block_id: block.parentId || null
      }));
  
      const commonVariables = {
        title: formData.title.trim(),
        titletag: formData.titletag.trim(),
        slug: formData.slug.trim(),
        description: formData.description?.trim() || '',
        keywords: formData.keywords?.trim() || '',
        thumbnail_url: formData.thumbnailUrl || '',
        status
      };
  
      console.log('Submitting with variables:', {
        ...commonVariables,
        blog_content_blocks: formattedContentBlocks
      });
  
      if (service?.id) {
        await updateService({
          variables: {
            id: service.id,
            ...commonVariables,
            content_blocks: formattedContentBlocks // Match UPDATE_BLOG mutation variable name
          }
        });
      } else {
        await insertService({
          variables: {
            ...commonVariables,
            content_blocks: formattedContentBlocks // Match INSERT_BLOG mutation variable name
          }
        });
      }
  
      onSave();
    } catch (error) {
      console.error('Error saving blog:', error);
      toast({
        title: 'Error saving blog', 
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full h-[95vh] max-w-7xl bg-white overflow-hidden relative">
        <div className="h-full flex flex-col">
          <DialogHeader
            title={service ? 'Edit Blog' : 'New Blog'}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            onUndo={undo}
            onRedo={redo}
            onClose={onClose}
            onSave={handleSubmit}
            isLoading={isLoading}
          />

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="border-b px-4">
              <TabsList>
                <TabsTrigger value="details" disabled={isLoading}>
                  Basic Details
                </TabsTrigger>
                <TabsTrigger value="content" disabled={isLoading}>
                  Content Builder
                </TabsTrigger>
                <TabsTrigger value="preview" disabled={isLoading}>
                  Preview
                </TabsTrigger>
                <TabsTrigger value="settings" disabled={isLoading}>
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="details" className="h-full">
                <BasicDetailsTab
                  formData={formData}
                  onChange={handleFormChange}
                  onImageUpload={handleImageUpload}
                  onImageRemove={handleImageRemove}
                  imagePreview={imagePreview}
                  disabled={isLoading}
                />
              </TabsContent>

              <TabsContent value="content" className="h-full overflow-hidden">
                <ContentBuilderTab 
                  disabled={isLoading}
                  onBlocksChange={setBlocks}
                />
              </TabsContent>

              <TabsContent value="preview" className="h-full">
                <PreviewTab
                  blocks={blocks}
                  formData={formData}
                  disabled={isLoading}
                />
              </TabsContent>

              <TabsContent value="settings" className="h-full">
                <SettingsTab
                  formData={formData}
                  onChange={handleFormChange}
                  disabled={isLoading}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default ServiceDialog;