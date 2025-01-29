import React from 'react';
import { X } from 'lucide-react';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: string | null;
  isLoading: boolean;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  onClose,
  result,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Scan Result</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <p className="text-gray-700">{result}</p>
          )}
        </div>
      </div>
    </div>
  );
};