import { useCallback, useEffect, useRef } from 'react';

interface Position {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export const useDropdownPosition = (isOpen: boolean, dropdownId: number | null) => {
  const dropdownRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  
  const updatePosition = useCallback(() => {
    if (!isOpen || dropdownId === null) return;
    
    const dropdown = dropdownRefs.current.get(dropdownId);
    if (!dropdown) return;
    
    // Get the button element (parent of dropdown)
    const button = dropdown.parentElement;
    if (!button) return;
    
    // Get positions
    const buttonRect = button.getBoundingClientRect();
    const dropdownRect = dropdown.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    // Calculate position
    const position: Position = {};
    
    // Vertical positioning
    if (buttonRect.bottom + dropdownRect.height > viewportHeight) {
      // Position above button if not enough space below
      position.bottom = viewportHeight - buttonRect.top;
      position.top = undefined;
    } else {
      // Position below button
      position.top = buttonRect.bottom;
      position.bottom = undefined;
    }
    
    // Horizontal positioning
    if (buttonRect.left + dropdownRect.width > viewportWidth) {
      // Align right edge if not enough space on the right
      position.right = viewportWidth - buttonRect.right;
      position.left = undefined;
    } else {
      // Align left edge
      position.left = buttonRect.left;
      position.right = undefined;
    }
    
    // Apply positioning
    if (position.top !== undefined) dropdown.style.top = `${position.top}px`;
    if (position.bottom !== undefined) dropdown.style.bottom = `${position.bottom}px`;
    if (position.left !== undefined) dropdown.style.left = `${position.left}px`;
    if (position.right !== undefined) dropdown.style.right = `${position.right}px`;
  }, [isOpen, dropdownId]);
  
  // Update position when dropdown opens or window resizes
  useEffect(() => {
    if (isOpen && dropdownId !== null) {
      // Initial positioning
      const timer = setTimeout(updatePosition, 0);
      
      // Update on window resize
      window.addEventListener('resize', updatePosition);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen, dropdownId, updatePosition]);
  
  // Update position when scrolling
  useEffect(() => {
    if (isOpen && dropdownId !== null) {
      const handleScroll = () => {
        updatePosition();
      };
      
      window.addEventListener('scroll', handleScroll, true);
      
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [isOpen, dropdownId, updatePosition]);
  
  const setDropdownRef = useCallback((id: number, element: HTMLDivElement | null) => {
    if (element) {
      dropdownRefs.current.set(id, element);
    } else {
      dropdownRefs.current.delete(id);
    }
  }, []);
  
  return { setDropdownRef, updatePosition };
};