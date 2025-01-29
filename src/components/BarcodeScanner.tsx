import React, { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { Barcode, Camera, CameraOff, Loader2 } from 'lucide-react';

interface BarcodeScannerProps {
  onResult: (result: string) => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onResult }) => {
  const [isEnabled, setIsEnabled] = useState(false);

  const handleStartStop = async () => {
    setIsEnabled(prev => !prev);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-900">
        {isEnabled ? (
          <BarcodeScannerComponent
            width={1280}
            height={1280}
            onUpdate={(err, result) => {
              if (result) {
                onResult(result.text);
                setIsEnabled(false);
              }
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <Barcode className="w-16 h-16 text-gray-600" />
          </div>
        )}

        {isEnabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}

        {isEnabled && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 border-2 border-white/50 rounded-lg"></div>
          </div>
        )}
      </div>

      <button
        onClick={handleStartStop}
        className="mt-4 w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        {isEnabled ? (
          <>
            <CameraOff className="w-5 h-5" />
            Stop Scanner
          </>
        ) : (
          <>
            <Camera className="w-5 h-5" />
            Start Scanner
          </>
        )}
      </button>
    </div>
  );
};
