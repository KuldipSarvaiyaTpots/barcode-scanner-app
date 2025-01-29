import React, { useEffect } from 'react';
import Quagga from '@ericblade/quagga2';

interface ScannerProps {
  scannerRef: React.RefObject<HTMLDivElement>;
  onDetected: (result: any) => void;
  zoom: number;
}

export const Scanner: React.FC<ScannerProps> = ({ scannerRef, onDetected, zoom }) => {
  useEffect(() => {
    if (scannerRef.current) {
      Quagga.init(
        {
          inputStream: {
            name: 'Live',
            type: 'LiveStream',
            target: scannerRef.current,
            constraints: {
              width: 1280,
              height: 720,
              facingMode: 'environment',
            },
            area: {
              top: "25%",
              right: "25%",
              left: "25%",
              bottom: "25%",
            },
          },
          locate: true,
          numOfWorkers: navigator.hardwareConcurrency || 4,
          decoder: {
            readers: ['ean_reader', 'ean_8_reader', 'code_128_reader', 'code_39_reader', 'upc_reader'],
            debug: {
              drawBoundingBox: true,
              showFrequency: true,
              drawScanline: true,
              showPattern: true
            }
          },
        },
        (err) => {
          if (err) {
            console.error('Error initializing Quagga:', err);
            return;
          }
          console.log('Quagga initialized');
          
          // Apply zoom after initialization
          const track = Quagga.CameraAccess.getActiveTrack();
          if (track && typeof track.getCapabilities === 'function') {
            const capabilities = track.getCapabilities();
            if (capabilities.zoom) {
              track.applyConstraints({
                advanced: [{ zoom: zoom }]
              });
            }
          }
          
          Quagga.start();
        }
      );

      Quagga.onDetected(onDetected);

      return () => {
        Quagga.stop();
      };
    }
  }, [scannerRef, onDetected]);

  // Handle zoom changes separately
  useEffect(() => {
    const track = Quagga.CameraAccess.getActiveTrack();
    if (track && typeof track.getCapabilities === 'function') {
      const capabilities = track.getCapabilities();
      if (capabilities.zoom) {
        track.applyConstraints({
          advanced: [{ zoom: zoom }]
        });
      }
    }
  }, [zoom]);

  return null;
};

export default Scanner;