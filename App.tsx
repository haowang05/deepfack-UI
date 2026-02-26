import React, { useState } from 'react';
import { Header } from './components/Header/Header';
import { MediaSidebar } from './components/MediaSidebar/MediaSidebar';
import { IconImage, IconVideo, IconQuestion } from './components/Icons';
import { UploadedFile, ViewState, AnalysisResult } from './types';
import { UploadSection } from './components/UploadSection/UploadSection';
import { AnalysisResults } from './components/AnalysisResults/AnalysisResults';
import { AboutModal } from './components/AboutModal/AboutModal';

import './App.css';

const generateMockAnalysis = (): AnalysisResult => {
  const isFake = Math.random() > 0.3;
  return {
    isFake,
    score: isFake ? 85 + Math.random() * 14 : 5 + Math.random() * 20,
    c2paPresent: Math.random() > 0.5,
    certTrusted: Math.random() > 0.5,
    signer: Math.random() > 0.5 ? 'Google LLC' : 'Unknown',
    aiLabel: isFake ? 'ai-generated' : 'none',
  };
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('upload');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [showAboutModal, setShowAboutModal] = useState(true);
  
  // 模拟分析过程
  const simulateAnalysis = (fileId: string) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'uploading', progress: 0 } : f));

    let progress = 0;
    const uploadInterval = setInterval(() => {
      progress += 10;
      setFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress: Math.min(progress, 100) } : f));
      
      if (progress >= 100) {
        clearInterval(uploadInterval);
        setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'analyzing' } : f));
        
        setTimeout(() => {
          setFiles(prev => prev.map(f => {
            if (f.id === fileId) {
              return {
                ...f,
                status: 'done',
                analysis: generateMockAnalysis()
              };
            }
            return f;
          }));
        }, 1500);
      }
    }, 200);
  };

  const handleFilesAdded = (incomingFiles: File[]) => {
    const newFiles: UploadedFile[] = incomingFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      type: file.type,
      size: file.size,
      previewUrl: URL.createObjectURL(file),
      status: 'uploaded',
      analysis: generateMockAnalysis(),
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);
    if (!activeFileId && newFiles.length > 0) {
      setActiveFileId(newFiles[0].id);
    }
  };

  const handleUrlAdded = (url: string) => {
    const isVideo = url.match(/\.(mp4|webm|ogg|mov|avi|mkv|m4v)$/i) != null;
    const type = isVideo ? 'video/mp4' : 'image/jpeg';
    const name = url.split('/').pop()?.split('?')[0] || 'url-media';
    
    const newFile: UploadedFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      type: type,
      size: 0,
      previewUrl: url, 
      status: 'uploaded',
      analysis: generateMockAnalysis(),
      progress: 0
    };

    setFiles(prev => [...prev, newFile]);
    if (!activeFileId) setActiveFileId(newFile.id);
  };

  const startAnalysis = () => {
    if (files.length > 0) {
       setView('result');
       files.forEach(f => {
         if (f.status === 'uploaded' || f.status === 'error') {
           simulateAnalysis(f.id);
         }
       });
    } else {
      alert("Please upload a file first.");
    }
  };

  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  return (
    <div className="app-wrapper">
      <Header />

      <main className="main-content">
        {view === 'upload' ? (
          <div className="upload-view-container">
            <div className="upload-box-wrapper">
              <UploadSection 
                files={files}
                onFilesAdded={handleFilesAdded}
                onUrlAdded={handleUrlAdded}
                onStartAnalysis={startAnalysis}
                onCancel={() => setFiles([])}
              />
            </div>
          </div>
        ) : (
          <div className="result-grid">
            
            <div className="preview-column">
              
              <div className="main-viewer">
                 <div className="viewer-display">
                    {activeFile ? (
                      activeFile.type.startsWith('image/') ? (
                        <img 
                          src={activeFile.previewUrl} 
                          alt="Analyzed Content" 
                          className="preview-img" 
                        />
                      ) : (
                        <div className="video-placeholder">
                          <IconVideo className="video-icon" />
                          <p className="video-filename">{activeFile.name}</p>
                        </div>
                      )
                    ) : (
                      <IconImage className="empty-icon" />
                    )}
                 </div>
                 
                 {activeFile && (
                    <div className="filename-badge">
                      {activeFile.name}
                    </div>
                 )}
              </div>

              <div className="sidebar-list-section">
                <div className="sidebar-header">
                  <h3 className="sidebar-title">Uploaded media</h3>
                  <button 
                    onClick={() => setView('upload')}
                    className="btn-secondary"
                  >
                    Upload new files
                  </button>
                </div>
                <p className="sidebar-subtext">Click to view your uploaded files and see their results.</p>
                <div className="sidebar-content">
                  <MediaSidebar 
                    files={files} 
                    activeFileId={activeFileId} 
                    onSelectFile={setActiveFileId} 
                    showDetails={false}
                  />
                </div>
              </div>
            </div>

            <div className="results-column">
              <AnalysisResults activeFile={activeFile} />
            </div>
          </div>
        )}
      </main>

      <button 
        onClick={() => setShowAboutModal(true)}
        className="floating-help-btn"
        aria-label="Help"
      >
        <IconQuestion className="help-icon" />
      </button>

      <AboutModal isOpen={showAboutModal} onClose={() => setShowAboutModal(false)} />
    </div>
  );
};

export default App;