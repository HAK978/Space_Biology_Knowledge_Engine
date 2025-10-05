import React, { useState } from 'react';
import { FaDownload, FaFileCsv, FaFileAlt, FaFileCode, FaCopy, FaCheck } from 'react-icons/fa';
import { exportToCSV, exportToText, exportStatsToJSON, copyToClipboard } from '../utils/exportUtils';

const ExportButton = ({ papers }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleExport = async (type) => {
    switch (type) {
      case 'csv':
        exportToCSV(papers);
        break;
      case 'text':
        exportToText(papers);
        break;
      case 'json':
        exportStatsToJSON(papers);
        break;
      case 'copy':
        const success = await copyToClipboard(papers);
        if (success) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
        break;
      default:
        break;
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all shadow-lg hover:shadow-green-500/30"
      >
        <FaDownload className="mr-2" />
        Export
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-indigo-800/40 rounded-lg shadow-2xl z-50 overflow-hidden">
            <div className="py-1">
              <button
                onClick={() => handleExport('csv')}
                className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors flex items-center text-white"
              >
                <FaFileCsv className="mr-3 text-green-400" />
                <div>
                  <div className="font-medium">Export as CSV</div>
                  <div className="text-xs text-gray-400">Spreadsheet format</div>
                </div>
              </button>

              <button
                onClick={() => handleExport('text')}
                className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors flex items-center text-white"
              >
                <FaFileAlt className="mr-3 text-blue-400" />
                <div>
                  <div className="font-medium">Export as Text</div>
                  <div className="text-xs text-gray-400">Full summary report</div>
                </div>
              </button>

              <button
                onClick={() => handleExport('json')}
                className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors flex items-center text-white"
              >
                <FaFileCode className="mr-3 text-purple-400" />
                <div>
                  <div className="font-medium">Export as JSON</div>
                  <div className="text-xs text-gray-400">Statistics & data</div>
                </div>
              </button>

              <div className="border-t border-slate-700"></div>

              <button
                onClick={() => handleExport('copy')}
                className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors flex items-center text-white"
              >
                {copied ? (
                  <>
                    <FaCheck className="mr-3 text-green-400" />
                    <div>
                      <div className="font-medium text-green-400">Copied!</div>
                      <div className="text-xs text-gray-400">To clipboard</div>
                    </div>
                  </>
                ) : (
                  <>
                    <FaCopy className="mr-3 text-yellow-400" />
                    <div>
                      <div className="font-medium">Copy Summary</div>
                      <div className="text-xs text-gray-400">To clipboard</div>
                    </div>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportButton;
