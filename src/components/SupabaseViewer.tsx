import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import JsonViewer from './JsonViewer';
import ForceGraph from './ForceGraph';
import { CharacterProfile } from '../types/json';
import { convertToGraphFormat } from '../utils/jsonToGraph';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface Record {
  id: number;
  json_content: CharacterProfile | any;
  created_at?: string;
}

interface SupabaseViewerProps {
  darkMode: boolean;
}

const SupabaseViewer: React.FC<SupabaseViewerProps> = ({ darkMode }) => {
  const [records, setRecords] = useState<Record[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('selfmapsbench')
        .select('id, json_content, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRecords(data || []);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % records.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + records.length) % records.length);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (records.length > 0) {
      const index = records.findIndex(record => 
        JSON.stringify(record.json_content)
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
      );
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      handlePrevious();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-400">
        <p>No records found</p>
      </div>
    );
  }

  const currentRecord = records[currentIndex];
  const graphData = convertToGraphFormat(currentRecord.json_content);

  return (
    <div className="space-y-4" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className={`flex justify-between items-center ${darkMode ? 'bg-dark-card' : 'bg-white'} p-4 rounded shadow`}>
        <h2 className="text-xl font-bold">Record {currentRecord.id}</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search in JSON..."
              value={searchTerm}
              onChange={handleSearch}
              className={`pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-dark-bg border-dark-border text-dark-text' : 'bg-white border-gray-300'
              }`}
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevious}
              className="p-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <span className={`text-sm ${darkMode ? 'text-dark-text' : 'text-gray-600'}`}>
              {currentIndex + 1} of {records.length}
            </span>
            <button
              onClick={handleNext}
              className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <div className={`text-sm ${darkMode ? 'text-dark-text bg-dark-card' : 'text-gray-500 bg-white'} p-4 rounded shadow`}>
        Created: {new Date(currentRecord.created_at!).toLocaleString()}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <JsonViewer data={currentRecord.json_content} darkMode={darkMode} />
        <ForceGraph data={graphData} darkMode={darkMode} />
      </div>
    </div>
  );
};

export default SupabaseViewer;