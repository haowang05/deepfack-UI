import React, { useRef } from 'react';
import { UploadedFile } from '../../types';
import { IconChevronLeft, IconChevronRight, IconVideo } from '../Icons';
import './MediaSidebar.css'; 

interface MediaSidebarProps {
  files: UploadedFile[];
  activeFileId: string | null;
  onSelectFile: (id: string) => void;
  emptyMessage?: string;
  showDetails?: boolean;
}

export const MediaSidebar: React.FC<MediaSidebarProps> = ({ 
  files, 
  activeFileId, 
  onSelectFile,
  emptyMessage = "Files that you upload will be stored here.",
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="sidebar-wrapper">
      {/* Scroll Container */}
      <div 
        ref={scrollContainerRef}
        className="media-scroll-container"
      >
        {files.length === 0 ? (
           <div className="empty-state">
             {emptyMessage}
           </div>
        ) : (
          files.map((file) => {
            const isActive = activeFileId === file.id;
            return (
              <button
                key={file.id}
                onClick={() => onSelectFile(file.id)}
                className={`media-item-btn ${isActive ? 'is-active' : ''}`}
              >
                {file.type.startsWith('image/') ? (
                  <img 
                    src={file.previewUrl} 
                    alt={file.name}
                    className="media-thumbnail"
                  />
                ) : (
                  <div className="video-thumb-placeholder">
                    <IconVideo className="video-icon-sm" />
                  </div>
                )}
              </button>
            );
          })
        )}
        
        {/* Spacer */}
        <div className="scroll-spacer"></div>
      </div>

      {/* Floating Navigation Buttons */}
      {files.length > 0 && (
        <div className="nav-controls">
           <button 
             onClick={() => scroll('left')}
             className="nav-btn btn-left"
             aria-label="Scroll Left"
           >
             <IconChevronLeft className="icon-chevron" />
           </button>
           <button 
             onClick={() => scroll('right')}
             className="nav-btn btn-right"
             aria-label="Scroll Right"
           >
             <IconChevronRight className="icon-chevron" />
           </button>
        </div>
      )}
    </div>
  );
};