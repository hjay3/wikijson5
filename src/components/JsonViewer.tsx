import React from 'react';
import { CharacterProfile } from '../types/json';

interface JsonViewerProps {
  data: any;
  darkMode: boolean;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data, darkMode }) => {
  const createHTMLTree = (obj: any): JSX.Element => {
    return (
      <ul className="json-tree">
        {Object.entries(obj).map(([key, value], index) => (
          <li key={index} className="hover:bg-gray-50 dark:hover:bg-dark-border rounded px-1">
            {typeof value === "object" && value !== null && !Array.isArray(value) ? (
              <>
                <span className="key dark:text-purple-400">{key}:</span>
                {createHTMLTree(value)}
              </>
            ) : Array.isArray(value) ? (
              <>
                <span className="key dark:text-purple-400">{key}:</span>{' '}
                <span className="array dark:text-blue-400">[{value.join(", ")}]</span>
              </>
            ) : (
              <>
                <span className="key dark:text-purple-400">{key}:</span>{' '}
                <span className="value dark:text-blue-400">{String(value)}</span>
              </>
            )}
          </li>
        ))}
      </ul>
    );
  };

  const validateAndParseJSON = (data: any): CharacterProfile | any => {
    try {
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      return parsed;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return data;
    }
  };

  const parsedData = validateAndParseJSON(data);

  return (
    <div className={`${darkMode ? 'bg-dark-card' : 'bg-white'} p-4 rounded shadow overflow-auto max-h-[80vh]`}>
      <h2 className="text-xl font-bold mb-4">JSON Data</h2>
      <div className="json-viewer">
        {createHTMLTree(parsedData)}
      </div>
    </div>
  );
};

export default JsonViewer;