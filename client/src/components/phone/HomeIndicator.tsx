import React, { useState, useRef, useEffect } from 'react';
import { useTaskManager } from '@/context/TaskManagerContext';

interface HomeIndicatorProps {
  onHomePress: () => void;
}

export const HomeIndicator = ({ onHomePress }: HomeIndicatorProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const indicatorRef = useRef<HTMLDivElement>(null);
  
  const { 
    openTaskManager
  } = useTaskManager();

  // Global mouse event handlers
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const mouseY = e.clientY;
        setCurrentY(mouseY);

      }
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (isDragging) {
        const deltaY = startY - e.clientY;
        
        
        // If dragged up more than 30px, open task manager
        if (deltaY > 30) {
        
          openTaskManager();
        } else {
          // Otherwise, treat as home button press
         
          onHomePress();
        }
        
        setIsDragging(false);
        setStartY(0);
        setCurrentY(0);
        setIsPressed(false);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, startY, openTaskManager, onHomePress]);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent default touch behavior
    const touchY = e.touches[0].clientY;
    
    setStartY(touchY);
    setCurrentY(touchY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      e.preventDefault(); // Prevent default touch behavior
      const touchY = e.touches[0].clientY;
      setCurrentY(touchY);
    
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent default touch behavior
    if (isDragging) {
      const deltaY = startY - currentY;
      
    
      
      // If swiped up more than 30px (lowered threshold), open task manager
      if (deltaY > 30) {
       
        openTaskManager();
      } else {
        // Otherwise, treat as home button press
        
        onHomePress();
      }
      
      setIsDragging(false);
      setStartY(0);
      setCurrentY(0);
    }
  };

  // Mouse event handlers for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPressed(true);
    setStartY(e.clientY);
    setCurrentY(e.clientY);
    setIsDragging(true);
    //add animation when mouse down
  
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const mouseY = e.clientY;
      setCurrentY(mouseY);
      
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    const phoneScreen = document.querySelector('.phone-screen') as HTMLElement;
    
    if (phoneScreen) {
      phoneScreen.classList.add('sliding-in');
    }
    setTimeout(() => {
      phoneScreen?.classList.remove('sliding-in');
    }, 500);

    if (isDragging) {
      const deltaY = startY - e.clientY;
      // If dragged up more than 30px, open task manager
      if (deltaY > 30) {
       
        openTaskManager();
      } else {
        // Otherwise, treat as home button press
        onHomePress();
      }
      setIsDragging(false);
      setStartY(0);
      setCurrentY(0);
    }
    setIsPressed(false);
  };


  return (
    <>
      {/* Home Indicator */}
      <div 
        ref={indicatorRef}
        className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-200 touch-none ${
          isPressed ? 'scale-95' : 'scale-100'
        }`}
        /*onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}*/
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
  
        style={{ touchAction: 'none' }} // Prevent default touch actions
      >
        <div className="w-36 h-1 bg-white/60 rounded-full cursor-pointer select-none">
          {/* Home icon removed, keeping only the line indicator */}
        </div>
      </div>
    </>
  );
};
