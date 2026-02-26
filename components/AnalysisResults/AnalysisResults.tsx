import React, { useState } from 'react';
import { IconCheck, IconX, IconImage, IconVideo } from '../Icons';
import { UploadedFile } from '../../types';
import './AnalysisResults.css'; 

interface AnalysisResultsProps {
  activeFile: UploadedFile | undefined;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ activeFile }) => {
  const [activeTab, setActiveTab] = useState<'score' | 'c2pa' | 'factcheck'>('score');

  if (!activeFile) return null;

  // --- loading ---
  if (activeFile.status === 'uploading' || activeFile.status === 'analyzing') {
    return (
      <div className="analysis-status-container">
        <div className="spinner"></div>
        <h2 className="status-title">
          {activeFile.status === 'uploading' ? 'Uploading media...' : 'Analyzing content...'}
        </h2>
        <p className="status-subtitle">Please wait while we process your file.</p>
        {activeFile.status === 'uploading' && (
           <div className="progress-bar-container">
             <div className="progress-bar-fill" style={{ width: `${activeFile.progress}%` }}></div>
           </div>
        )}
      </div>
    );
  }

  // --- 2. error ---
  if (activeFile.status === 'error') {
    return (
      <div className="analysis-status-container error">
        <IconX className="status-icon-error" />
        <h2 className="status-title error-text">Analysis Failed</h2>
        <p className="status-subtitle">There was an error processing your file. Please try again.</p>
      </div>
    );
  }

  const result = activeFile.analysis;
  if (!result) return null;

  return (
    <div className="analysis-results-wrapper">
      {/* 选项卡导航 */}
      <div className="tabs-nav">
        <button 
          onClick={() => setActiveTab('score')}
          className={`tab-btn ${activeTab === 'score' ? 'active' : ''}`}
        >
          Model score
        </button>
        <button 
          onClick={() => setActiveTab('c2pa')}
          className={`tab-btn middle ${activeTab === 'c2pa' ? 'active' : ''}`}
        >
          C2PA Provenance
        </button>
        <button 
          onClick={() => setActiveTab('factcheck')}
          className={`tab-btn ${activeTab === 'factcheck' ? 'active' : ''}`}
        >
          Google Fact Check
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'score' ? (
          /* --- Model Score Tab --- */
          <div className="score-tab">
            <div className="score-header">
              <h2 className={`score-title ${result.isFake ? 'fake' : 'real'}`}>
                {result.isFake ? "Our model has detected this content is fake." : "Our model has detected this content is real."}
              </h2>
              <div className="score-value-box">
                <div className="score-number">{Math.round(result.score)}%</div>
                <div className="score-label">Confidence level</div>
              </div>
            </div>

            <div className="score-slider-container">
              <span className="slider-label real-label">Real</span>
              <div className="score-slider">
                <div className="slider-indicator" style={{ left: `${result.score}%` }}></div>
              </div>
              <span className="slider-label fake-label">Fake</span>
            </div>

            <div className="info-notice">
              <div className="info-badge">i</div>
              <p>This result is based off what our model has predicted and is not linked to the C2PA results.</p>
            </div>

            <div className="text-section">
              <h3>What does this score mean?</h3>
              <p>Our model uses various parameters and a very large dataset of real and fake images, which processes user input and turned into a overall percentage score.</p>
            </div>

            <div className="stats-section">
              <h3>Score statistics</h3>
              <div className="stats-grid">
                <div className="stats-item">
                   <div className="stats-header"><IconImage className="icon-sm" /><span>Images</span></div>
                   <p>Statistics about image scores to go here</p>
                </div>
                <div className="stats-item">
                   <div className="stats-header"><IconVideo className="icon-sm" /><span>Videos</span></div>
                   <p>Statistics about video scores to go here</p>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'c2pa' ? (
          /* --- C2PA Provenance Tab --- */
          <div className="c2pa-tab">
            <div className="info-notice large">
              <div className="info-badge">?</div>
              <div>
                <h3>What is C2PA Provenance?</h3>
                <p>C2PA stands for 'Coalition for Content Provenance and Authenticity'...</p>
              </div>
            </div>

            <div className="c2pa-grid">
              <div className="c2pa-card">
                <h4>C2PA Provenance Data</h4>
                <div className={`c2pa-status ${result.c2paPresent ? 'success' : 'fail'}`}>
                  {result.c2paPresent ? <IconCheck /> : <IconX />}
                  <span>{result.c2paPresent ? "Present" : "Missing"}</span>
                </div>
                <p>If present, this asset contains attached metadata describing its source.</p>
              </div>
              <div className="c2pa-card">
                <h4>Certificate chain trusted</h4>
                <div className={`c2pa-status ${result.certTrusted ? 'success' : 'fail'}`}>
                  {result.certTrusted ? <IconCheck /> : <IconX />}
                  <span>{result.certTrusted ? "Trusted" : "Untrusted"}</span>
                </div>
                <p>Confidence in the entity who signed the asset's data.</p>
              </div>
              <div className="c2pa-card">
                <h4>Manifest signer</h4>
                <div className="c2pa-value">{result.signer}</div>
                <p>The entity responsible for the accuracy of the information.</p>
              </div>
              <div className="c2pa-card">
                <h4>AI labels</h4>
                <div className="c2pa-value">{result.aiLabel}</div>
                <p>Indicates if content was wholly or partially created using Gen AI.</p>
              </div>
            </div>
          </div>
        ) : (
          /* --- Google Fact Check Tab --- */
          <div className="factcheck-tab">
             <div className="info-notice large">
              <div className="info-badge">?</div>
              <div>
                <h3>Google Fact Check API</h3>
                <p>Finding 'sources', using keywords and image searches.</p>
              </div>
            </div>
            <div className="sources-list">
              <h3>Sources</h3>
              {[1, 2, 3].map((i) => (
                <div key={i} className="source-item">
                  <div className="source-thumb">
                    <img src={`https://picsum.photos/seed/${i + 100}/200/120`} alt="Source" />
                  </div>
                  <div className="source-info">
                    <h4>Article link</h4>
                    <p>Article description (if possible)</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="tab-footer">
          <button className="btn-export">Export report</button>
        </div>
      </div>
    </div>
  );
};