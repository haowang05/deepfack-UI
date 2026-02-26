import React from 'react';
import { IconX } from '../Icons';
import './AboutModal.css'; 

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="modal-close-btn"
          aria-label="Close"
        >
          {/* 注意：图标的宽高也改为了 CSS 控制 */}
          <IconX className="icon-x" />
        </button>

        <div className="modal-body">
          <h2 className="modal-title">About the Deepfake Detector</h2>

          <div className="modal-description">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

          <h3 className="section-subtitle">Important Notices - AI Detection</h3>

          <div className="info-grid">
            <div className="info-item">
              <h4 className="info-item-title">Independent signals</h4>
              <p className="info-item-text">
                C2PA provenance results and AI detection signals are produced by separate systems and should be interpreted separately.
              </p>
            </div>

            <div className="info-item">
              <h4 className="info-item-title">Only supports fully AI-generated content</h4>
              <p className="info-item-text">
                The tool does not reliably detect partially manipulated images or videos.
              </p>
            </div>

            <div className="info-item">
              <h4 className="info-item-title">Video detection</h4>
              <p className="info-item-text">
                Preview version of the AI video detector. Videos are analysed by processing each frame independently and averages results across frames. Does not support audio or temporal inconsistencies.
              </p>
            </div>

            <div className="info-item">
              <h4 className="info-item-title">Does not support partial modifications</h4>
              <p className="info-item-text">
                This includes face swapping, manual editing from tools and hybrid real-AI edited content.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="modal-continue-btn"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};