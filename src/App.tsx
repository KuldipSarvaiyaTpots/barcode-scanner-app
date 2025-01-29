import React, { useState } from 'react';
import { BarcodeScanner } from './components/BarcodeScanner';
import { ResultModal } from './components/ResultModal';
import { Barcode } from 'lucide-react';

function App() {
  const [scannedCode, setScannedCode] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [apiResult, setApiResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = (result: string) => {
    setScannedCode(result);
  };

  const handleSubmit = async () => {
    if (!scannedCode) return;

    setIsLoading(true);
    setModalOpen(true);

    try {
      // Replace with your actual API endpoint
      const response = await fetch('https://api.example.com/barcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ barcode: scannedCode }),
      });
      
      const data = await response.json();
      setApiResult(data.result);
    } catch (error) {
      setApiResult('Error fetching results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Barcode className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Barcode Scanner</h1>
          </div>
          <p className="text-gray-600">Scan any barcode to get product information</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <BarcodeScanner onResult={handleScan} />
          
          <div className="mt-6">
            <label htmlFor="barcode" className="block text-sm font-medium text-gray-700 mb-2">
              Scanned Barcode
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                id="barcode"
                value={scannedCode}
                onChange={(e) => setScannedCode(e.target.value)}
                className="flex-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Barcode will appear here"
              />
              <button
                onClick={handleSubmit}
                disabled={!scannedCode}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <ResultModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        result={apiResult}
        isLoading={isLoading}
      />
    </div>
  );
}

export default App;