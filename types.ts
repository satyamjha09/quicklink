export interface ViewerSettings {
  backgroundColor: string;
  wireframe: boolean;
  autoRotate: boolean;
  gridHelper: boolean;
}

export interface SavedConfig {
  id: string;
  timestamp: number;
  modelUrl: string;
  settings: ViewerSettings;
}

export interface AIResponse {
  backgroundColor?: string;
  wireframe?: boolean;
  explanation?: string;
  gridHelper?: boolean;
}
