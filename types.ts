export interface AnalysisResult {
  score: number;
  isFake: boolean;
  c2paPresent: boolean;
  certTrusted: boolean;
  signer: string;
  aiLabel: string;
  c2paData?: any;
}

export interface UploadedFile {
  id: string;
  taskId?: string;
  file?: File; // Optional because URL uploads won't have a File object
  name: string;
  type: string;
  size: number;
  previewUrl: string;
  status: 'uploaded' | 'uploading' | 'analyzing' | 'done' | 'error';
  analysis: AnalysisResult;
  progress: number; // 0 to 100
}

export type ViewState = 'upload' | 'result';
