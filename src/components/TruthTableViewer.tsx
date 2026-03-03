import React from 'react';

interface TruthTableData {
  description: string;
  headers: string[];
  rows: string[][];
}

interface TruthTableViewerProps {
  data: TruthTableData | null;
}

export function TruthTableViewer({ data }: TruthTableViewerProps) {
  if (!data || !data.headers) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500 bg-[#1A1C20]">
        Generate a truth table to view the logic states.
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-auto bg-[#0a0a0a] p-6 text-gray-200">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-[#1A1C20] p-6 rounded-xl border border-white/10 shadow-lg">
          <h2 className="text-lg font-semibold text-emerald-400 mb-2">Truth Table</h2>
          <p className="text-sm text-gray-400 mb-6">{data.description}</p>
          
          <div className="overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-xs text-gray-400 uppercase bg-white/5 border-b border-white/10">
                <tr>
                  {data.headers.map((header, i) => (
                    <th key={i} className="px-6 py-3 font-medium border-r border-white/10 last:border-r-0">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors last:border-b-0">
                    {row.map((cell, j) => (
                      <td key={j} className="px-6 py-4 font-mono border-r border-white/5 last:border-r-0">
                        <span className={`px-2 py-1 rounded-md ${
                          cell === '1' ? 'bg-emerald-500/20 text-emerald-400' :
                          cell === '0' ? 'bg-blue-500/20 text-blue-400' :
                          cell.toLowerCase() === 'x' ? 'bg-red-500/20 text-red-400' :
                          cell.toLowerCase() === 'z' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-300'
                        }`}>
                          {cell}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
