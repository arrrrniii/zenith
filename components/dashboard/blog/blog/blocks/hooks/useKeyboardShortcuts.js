
// components/admin/dashboard/service/blocks/hooks/useKeyboardShortcuts.js
import { useEffect } from 'react';
import useBlockStore from '../store';

export const useKeyboardShortcuts = () => {
const { undo, redo } = useBlockStore();

useEffect(() => {
const handleKeyDown = (e) => {
 if (e.metaKey || e.ctrlKey) {
   if (e.key === 'z') {
     e.preventDefault();
     if (e.shiftKey) {
       redo();
     } else {
       undo();
     }
   }
 }
};

document.addEventListener('keydown', handleKeyDown);
return () => document.removeEventListener('keydown', handleKeyDown);
}, [undo, redo]);
};