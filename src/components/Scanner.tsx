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
              width: { min: 1280, ideal: 1920 },
              height: { min: 720, ideal: 1080 },
              facingMode: 'environment',
              aspectRatio: { min: 1, max: 2 },
            },
            area: {
              top: "0%",
              right: "0%",
              left: "0%",
              bottom: "0%",
            },
          },
          locate: true,
          numOfWorkers: navigator.hardwareConcurrency || 4,
          decoder: {
            readers: [
              'ean_reader',
              'ean_8_reader',
              'code_128_reader',
              'code_39_reader',
              'upc_reader',
              'upc_e_reader',
              'codabar_reader',
              'i2of5_reader'
            ],
            debug: {
              drawBoundingBox: true,
              showFrequency: true,
              drawScanline: true,
              showPattern: true
            },
            multiple: false
          },
          locator: {
            patchSize: "large",
            halfSample: true,
            debug: {
              showCanvas: true,
              showPatches: true,
              showFoundPatches: true
            }
          }
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

  // Handle zoom changes
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
