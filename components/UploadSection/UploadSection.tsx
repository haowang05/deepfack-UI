import React, { useState, useRef } from 'react';
import { IconImage, IconVideo, IconUpload, IconTrash } from '../Icons';
import { UploadedFile } from '../../types';
import './UploadSection.css'; 

interface UploadSectionProps {
  files: UploadedFile[];
  onFilesAdded: (files: File[]) => void;
  onUrlAdded: (url: string) => void;
  onStartAnalysis: () => void;
  onCancel: () => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  files,
  onFilesAdded,
  onUrlAdded,
  onStartAnalysis,
  onCancel
}) => {
  const [uploadTab, setUploadTab] = useState<'file' | 'url'>('file');
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesAdded(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFilesAdded(Array.from(event.target.files));
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onUrlAdded(urlInput.trim());
      setUrlInput('');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return 'Unknown size';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="upload-card">
      {/* Tabs */}
      <div className="tab-header">
        <button 
          onClick={() => setUploadTab('file')}
          className={`tab-toggle ${uploadTab === 'file' ? 'active' : ''}`}
        >
          Upload file(s)
        </button>
        <button 
          onClick={() => setUploadTab('url')}
          className={`tab-toggle ${uploadTab === 'url' ? 'active' : ''}`}
        >
          Upload via URL
        </button>
      </div>
      
      <div className="upload-body">
        {uploadTab === 'file' ? (
          <div className="tab-pane">
              <div className="drop-zone"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <IconUpload className="upload-icon-large" />
                <p className="drop-text-primary">Drag and drop files here...</p>
                <p className="drop-text-divider">or</p>
                <button className="btn-primary">Click to upload file(s)</button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden-input" multiple accept="image/*,video/*" />
              </div>

              <div className="formats-info">
                <p className="formats-title">Accepted formats</p>
                <div className="formats-grid">
                  <div className="format-item">
                    <IconImage className="icon-med" />
                    <span className="format-name">Image</span>
                    <span className="format-ext">.jpg, .jpeg, .png</span>
                  </div>
                  <div className="format-item">
                    <IconVideo className="icon-med" />
                    <span className="format-name">Video</span>
                    <span className="format-ext">.mp4, .avi, .mov, .mkv</span>
                  </div>
                </div>
              </div>
          </div>
        ) : (
          /* URL Tab */
          <div className="tab-pane">
              <div className="url-input-section">
                <label className="url-label">Enter URL link below</label>
                <input 
                  type="text" 
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="url-input"
                />
                <button onClick={handleUrlSubmit} className="btn-primary url-btn">Upload URL</button>
              </div>

              <div className="formats-info">
                <p className="formats-title">Accepted formats</p>
                <div className="formats-grid">
                  <div className="format-item">
                    <IconImage className="icon-med" />
                    <span className="format-name">Image</span>
                    <span className="format-ext">.jpg, .jpeg, .png</span>
                  </div>
                  <div className="format-item">
                    <IconVideo className="icon-med" />
                    <span className="format-name">Video</span>
                    <span className="format-ext">.mp4, .avi, .mov, .mkv</span>
                  </div>
                </div>
              </div>
          </div>
        )}

        {/* Shared Queue Area */}
        {files.length > 0 && (
          <div className="upload-queue-container">
            <h3 className="queue-title">Upload queue</h3>
            <div className="queue-list">
              {files.map((file) => (
                <div key={file.id} className="queue-item">
                  <div className="item-icon-wrapper">
                    {file.type.startsWith('image/') ? <IconImage /> : <IconVideo />}
                  </div>
                  <div className="item-details">
                    <p className="item-name">{file.name}</p>
                    <p className="item-size">{formatSize(file.size)}</p>
                  </div>
                  <button onClick={onCancel} className="btn-delete">
                    <IconTrash className="icon-trash" />
                  </button>
                </div>
              ))}
            </div>

            <div className="action-footer">
              <button onClick={onStartAnalysis} className="btn-primary btn-large">Analyse</button>
              <button onClick={onCancel} className="btn-secondary btn-large">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};