import React from 'react';

interface RawViewProps {
  content: string;
}

const RawView: React.FC<RawViewProps> = ({ content }) => {
  return (
    <pre className="bg-black text-white min-h-screen p-0 m-0 text-sm font-mono whitespace-pre-wrap break-all selection:bg-white selection:text-black">
      {content}
    </pre>
  );
};

export default RawView;