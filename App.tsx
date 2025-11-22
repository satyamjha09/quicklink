import React, { useState, useEffect, useCallback } from 'react';
import { Scene } from './components/Scene';
import { Controls } from './components/Controls';
import { AIAssistant } from './components/AIAssistant';
import { ViewerSettings, SavedConfig } from './types';
import { mockBackend } from './services/mockBackend';
import { Box, Layers, Loader2, Save, Download } from 'lucide-react';

// Default settings
const DEFAULT_SETTINGS: ViewerSettings = {
  backgroundColor: '#1a1a1a',
  wireframe: false,
  autoRotate: false,
  gridHelper: true,
};

export default function App() {
  // State
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [settings, setSettings] = useState<ViewerSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [configId, setConfigId] = useState<string | null>(null);

  // Handlers
  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    try {
      // Simulate Backend Upload API
      const url = await mockBackend.uploadModel(file);
      setModelUrl(url);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload model");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = (key: keyof ViewerSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveConfig = async () => {
    if (!modelUrl) return;
    setIsSaving(true);
    try {
      // Simulate Backend Save API
      const saved = await mockBackend.saveSettings({
        modelUrl,
        settings,
      });
      setConfigId(saved.id);
      alert(`Configuration saved! ID: ${saved.id.substring(0, 8)}...`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadConfig = async () => {
    const id = prompt("Enter Configuration ID to load (check console/localstorage for IDs if needed):");
    if (!id) return;
    
    setIsLoading(true);
    try {
      // Simulate Backend Fetch API
      const config = await mockBackend.fetchSettings(id);
      if (config) {
        setModelUrl(config.modelUrl);
        setSettings(config.settings);
        setConfigId(config.id);
      } else {
        alert("Configuration not found");
      }
    } catch (e) {
      console.error(e);
      alert("Error loading configuration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col md:flex-row overflow-hidden">
      
      {/* Main 3D Viewer Area */}
      <div className="flex-1 relative h-full bg-gray-900 order-2 md:order-1">
        <Scene 
          modelUrl={modelUrl} 
          settings={settings} 
        />

        {/* Top Bar overlay */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start pointer-events-none">
          <div className="bg-black/40 backdrop-blur-md p-3 rounded-lg border border-white/10 pointer-events-auto flex items-center gap-2">
            <Box className="w-5 h-5 text-blue-400" />
            <span className="font-semibold text-sm text-white tracking-wide">Quleep 3D Viewer</span>
          </div>

          <div className="flex gap-2 pointer-events-auto">
             <button 
              onClick={handleLoadConfig}
              className="flex items-center gap-2 bg-gray-800/80 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm border border-white/10 transition-all backdrop-blur-md"
            >
              <Download className="w-4 h-4" />
              Load Config
            </button>
            <button 
              onClick={handleSaveConfig}
              disabled={!modelUrl || isSaving}
              className="flex items-center gap-2 bg-blue-600/90 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all backdrop-blur-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Config
            </button>
          </div>
        </div>

        {/* Instructions Overlay (only if no model) */}
        {!modelUrl && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 text-center max-w-md mx-4">
              <Box className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-bold text-white mb-2">Ready to View</h2>
              <p className="text-gray-400">Upload a .glb or .gltf file using the panel to begin exploring your 3D product.</p>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
            <div className="flex flex-col items-center">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
              <span className="text-white font-medium">Loading Resource...</span>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Controls */}
      <div className="w-full md:w-80 h-[40vh] md:h-full bg-gray-900 border-t md:border-t-0 md:border-l border-gray-800 flex flex-col order-1 md:order-2 z-20 shadow-2xl">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <Controls 
            onFileSelect={handleFileSelect}
            settings={settings}
            onSettingChange={handleSettingChange}
            hasModel={!!modelUrl}
          />
          
          <div className="p-4 border-t border-gray-800">
            <AIAssistant 
              onApplySettings={(newSettings) => {
                setSettings(prev => ({ ...prev, ...newSettings }));
              }}
            />
          </div>
        </div>
        
        <div className="p-3 border-t border-gray-800 text-center">
           <p className="text-xs text-gray-600">Powered by Gemini 2.5 Flash & React Three Fiber</p>
        </div>
      </div>
    </div>
  );
}
