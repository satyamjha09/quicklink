import React, { useRef } from 'react';
import { ViewerSettings } from '../types';
import { Upload, Sliders, Check, Sun, Grid3X3, Box, RotateCw } from 'lucide-react';

interface ControlsProps {
  onFileSelect: (file: File) => void;
  settings: ViewerSettings;
  onSettingChange: (key: keyof ViewerSettings, value: any) => void;
  hasModel: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ 
  onFileSelect, 
  settings, 
  onSettingChange,
  hasModel
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="p-5 space-y-8">
      
      {/* Header */}
      <div>
        <h3 className="text-white font-bold text-lg flex items-center gap-2 mb-1">
          <Sliders className="w-5 h-5 text-blue-500" />
          Controls
        </h3>
        <p className="text-gray-400 text-xs">Configure your scene and model</p>
      </div>

      {/* Upload Section */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-300 uppercase tracking-wider text-[10px]">Model Input</label>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-700 hover:border-blue-500 rounded-xl transition-colors group cursor-pointer bg-gray-800/50"
        >
          <div className="p-3 bg-gray-800 group-hover:bg-blue-500/20 rounded-full transition-colors">
            <Upload className="w-6 h-6 text-gray-400 group-hover:text-blue-400" />
          </div>
          <span className="text-sm text-gray-300 font-medium">Upload GLB / GLTF</span>
          <span className="text-xs text-gray-500">Max 50MB</span>
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".glb,.gltf" 
          className="hidden" 
        />
      </div>

      {/* Appearance Section */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-gray-300 uppercase tracking-wider text-[10px]">Appearance</label>
        
        {/* Background Color Picker */}
        <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
          <span className="text-sm text-gray-300">Background</span>
          <div className="flex items-center gap-2">
             <span className="text-xs text-gray-500 font-mono uppercase">{settings.backgroundColor}</span>
             <input 
              type="color" 
              value={settings.backgroundColor}
              onChange={(e) => onSettingChange('backgroundColor', e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent p-0"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onSettingChange('wireframe', !settings.wireframe)}
            className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all text-sm ${settings.wireframe ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750'}`}
          >
            <Box className="w-4 h-4" />
            Wireframe
          </button>

          <button
            onClick={() => onSettingChange('gridHelper', !settings.gridHelper)}
            className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all text-sm ${settings.gridHelper ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750'}`}
          >
            <Grid3X3 className="w-4 h-4" />
            Grid
          </button>

           <button
            onClick={() => onSettingChange('autoRotate', !settings.autoRotate)}
            className={`col-span-2 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all text-sm ${settings.autoRotate ? 'bg-green-500/10 border-green-500 text-green-400' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750'}`}
          >
            <RotateCw className={`w-4 h-4 ${settings.autoRotate ? 'animate-spin' : ''}`} />
            Auto Rotate
          </button>
        </div>
      </div>
    </div>
  );
};
