import React, { useRef, useEffect } from 'react';
import { Download, RefreshCw, Monitor, Smartphone } from 'lucide-react';

interface LivePreviewProps {
  code: string;
  isLoading: boolean;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ code, isLoading }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewMode, setViewMode] = React.useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    if (iframeRef.current && code) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(code);
        doc.close();
      }
    }
  }, [code]);

  const handleDownload = () => {
    if (code) {
      const blob = new Blob([code], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated-website.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="flex items-center justify-between p-3 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-gray-800">Live Preview</h3>
          {isLoading && (
            <div className="flex items-center space-x-2 text-blue-600">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm">Generating...</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-1 rounded ${
                viewMode === 'desktop'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              title="Desktop view"
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`p-1 rounded ${
                viewMode === 'mobile'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              title="Mobile view"
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>
          
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh preview"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          
          <button
            onClick={handleDownload}
            disabled={!code}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Download HTML file"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-4">
        <div
          className={`mx-auto bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
            viewMode === 'mobile' ? 'w-80 h-full' : 'w-full h-full'
          }`}
        >
          {code ? (
            <iframe
              ref={iframeRef}
              className="w-full h-full border-none"
              title="Generated Website Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Monitor className="mx-auto h-16 w-16 mb-4 opacity-30" />
                <p className="text-lg font-medium">No preview available</p>
                <p className="text-sm mt-2">Generate some code to see the preview</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};