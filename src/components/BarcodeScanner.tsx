import React, { useState, useRef, useEffect } from 'react';
import { Barcode, Camera, CameraOff, ZoomIn, ZoomOut } from 'lucide-react';
import Scanner from './Scanner';
import Quagga from '@ericblade/quagga2';

interface BarcodeScannerProps {
  onResult: (result: string) => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onResult }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [zoom, setZoom] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 1;
    }

    return () => {
      if (isEnabled) {
        Quagga.stop();
      }
    };
  }, [isEnabled]);

  const handleStartStop = async () => {
    if (isEnabled) {
      await Quagga.stop();
      onResult('');
    }
    setIsEnabled(prev => !prev);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => {
      if (direction === 'in' && prev < 5) {
        return Math.min(5, prev + 0.2);
      } else if (direction === 'out' && prev > 1) {
        return Math.max(1, prev - 0.2);
      }
      return prev;
    });
  };

  const handleDetected = (result: any) => {
    if (result.codeResult) {
      onResult(result.codeResult.code);
      setIsEnabled(false);
      if (audioRef.current) {
        audioRef.current.play();
      }
      Quagga.stop();
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <audio ref={audioRef} src="beep.mp3" style={{ display: 'none' }} />
      
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-900">
        <div ref={scannerRef} className="absolute inset-0">
          {!isEnabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <Barcode className="w-16 h-16 text-gray-600" />
            </div>
          )}
          {isEnabled && <Scanner scannerRef={scannerRef} zoom={zoom} onDetected={handleDetected} />}
        </div>

        {isEnabled && (
          <>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border-2 border-white/50 rounded-lg"></div>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => handleZoom('in')}
                disabled={zoom >= 5}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors disabled:opacity-50"
              >
                <ZoomIn className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => handleZoom('out')}
                disabled={zoom <= 1}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors disabled:opacity-50"
              >
                <ZoomOut className="w-5 h-5 text-white" />
              </button>
            </div>
          </>
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