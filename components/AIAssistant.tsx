import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { AIResponse, ViewerSettings } from '../types';
import { Sparkles, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AIAssistantProps {
  onApplySettings: (settings: Partial<ViewerSettings>) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ onApplySettings }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await geminiService.getStylingSuggestion(prompt);
      setResponse(result);
      
      // Automatically apply the settings for immediate feedback
      onApplySettings({
        backgroundColor: result.backgroundColor,
        wireframe: result.wireframe,
        gridHelper: result.gridHelper
      });

    } catch (err) {
      setError("Couldn't generate style. Check API Key.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
       <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h3 className="text-white font-bold text-lg">AI Designer</h3>
      </div>
      <p className="text-gray-400 text-xs mb-4">
        Describe a mood (e.g. "Cyberpunk City", "Clean Medical", "Warm Sunset") and Gemini will style the viewer.
      </p>

      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a theme..."
          className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
        />
        <button
          type="submit"
          disabled={isLoading || !prompt}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-purple-600 hover:bg-purple-500 rounded-md text-white disabled:opacity-50 disabled:hover:bg-purple-600 transition-colors"
        >
          {isLoading ? (
             <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
        </button>
      </form>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
          {error}
        </div>
      )}

      {response && (
        <div className="animate-fade-in bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
             <div className="bg-purple-500/20 p-2 rounded-full">
               <MessageSquare className="w-4 h-4 text-purple-300" />
             </div>
             <div>
                <h4 className="text-purple-200 text-sm font-semibold mb-1">Suggestion Applied</h4>
                <p className="text-gray-300 text-xs italic">"{response.explanation}"</p>
                <div className="flex gap-2 mt-3">
                    <span className="text-[10px] uppercase tracking-wide px-2 py-1 bg-black/40 rounded text-gray-400">
                        Bg: {response.backgroundColor}
                    </span>
                    {response.wireframe && (
                        <span className="text-[10px] uppercase tracking-wide px-2 py-1 bg-black/40 rounded text-blue-400">
                            Wireframe
                        </span>
                    )}
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
