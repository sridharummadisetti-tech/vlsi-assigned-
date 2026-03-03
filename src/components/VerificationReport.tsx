import React from 'react';
import Markdown from 'react-markdown';

interface VerificationReportProps {
  report: string;
}

export function VerificationReport({ report }: VerificationReportProps) {
  return (
    <div className="w-full h-full overflow-y-auto p-6 bg-[#1A1C20] text-gray-200">
      <div className="max-w-4xl mx-auto">
        <div className="prose prose-invert prose-emerald max-w-none">
          <Markdown>{report}</Markdown>
        </div>
      </div>
    </div>
  );
}
