import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { CodeEditor } from './components/CodeEditor';
import { DiagramViewer } from './components/DiagramViewer';
import { WaveformViewer } from './components/WaveformViewer';
import { VerificationReport } from './components/VerificationReport';
import { Cpu, Code2, FileCheck2, Network, Layers, Activity } from 'lucide-react';
import { generateRtl, generateTestbench, verifyRtl, generateDiagram, designChip, generateWaveform } from './services/geminiService';

export default function App() {
  const [activeTab, setActiveTab] = useState<'rtl' | 'testbench' | 'verification' | 'diagram' | 'architecture' | 'waveform'>('rtl');
  const [rtlCode, setRtlCode] = useState<string>('// Enter a description and click "Generate RTL" to start');
  const [testbenchCode, setTestbenchCode] = useState<string>('// Generate testbench from RTL');
  const [verificationReport, setVerificationReport] = useState<string>('No report generated yet.');
  const [diagramData, setDiagramData] = useState<any>(null);
  const [waveformData, setWaveformData] = useState<any>(null);
  const [architectureDoc, setArchitectureDoc] = useState<string>('No architecture designed yet.');

  const [isGeneratingRtl, setIsGeneratingRtl] = useState(false);
  const [isGeneratingTb, setIsGeneratingTb] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isGeneratingDiagram, setIsGeneratingDiagram] = useState(false);
  const [isGeneratingWaveform, setIsGeneratingWaveform] = useState(false);
  const [isDesigningChip, setIsDesigningChip] = useState(false);

  const handleGenerateRtl = async (description: string) => {
    setIsGeneratingRtl(true);
    try {
      const code = await generateRtl(description);
      if (code) {
        setRtlCode(code);
        setActiveTab('rtl');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingRtl(false);
    }
  };

  const handleGenerateTestbench = async () => {
    if (!rtlCode || rtlCode.startsWith('//')) return;
    setIsGeneratingTb(true);
    try {
      const code = await generateTestbench(rtlCode);
      if (code) {
        setTestbenchCode(code);
        setActiveTab('testbench');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingTb(false);
    }
  };

  const handleVerifyRtl = async () => {
    if (!rtlCode || rtlCode.startsWith('//')) return;
    setIsVerifying(true);
    try {
      const report = await verifyRtl(rtlCode);
      if (report) {
        setVerificationReport(report);
        setActiveTab('verification');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleGenerateDiagram = async () => {
    if (!rtlCode || rtlCode.startsWith('//')) return;
    setIsGeneratingDiagram(true);
    try {
      const data = await generateDiagram(rtlCode);
      if (data) {
        setDiagramData(data);
        setActiveTab('diagram');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingDiagram(false);
    }
  };

  const handleGenerateWaveform = async () => {
    if (!rtlCode || rtlCode.startsWith('//') || !testbenchCode || testbenchCode.startsWith('//')) return;
    setIsGeneratingWaveform(true);
    try {
      const data = await generateWaveform(rtlCode, testbenchCode);
      if (data) {
        setWaveformData(data);
        setActiveTab('waveform');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingWaveform(false);
    }
  };

  const handleDesignChip = async (description: string) => {
    setIsDesigningChip(true);
    try {
      const doc = await designChip(description);
      if (doc) {
        setArchitectureDoc(doc);
        setActiveTab('architecture');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsDesigningChip(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#151619] text-gray-200 font-sans overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        onGenerateRtl={handleGenerateRtl} 
        isGenerating={isGeneratingRtl} 
        onDesignChip={handleDesignChip}
        isDesigning={isDesigningChip}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full bg-[#1A1C20] border-l border-white/10">
        {/* Header / Tabs */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#151619] overflow-x-auto">
          <div className="flex space-x-1 min-w-max">
            <TabButton 
              active={activeTab === 'rtl'} 
              onClick={() => setActiveTab('rtl')}
              icon={<Code2 size={16} />}
              label="RTL Code"
            />
            <TabButton 
              active={activeTab === 'testbench'} 
              onClick={() => setActiveTab('testbench')}
              icon={<Cpu size={16} />}
              label="Testbench"
            />
            <TabButton 
              active={activeTab === 'verification'} 
              onClick={() => setActiveTab('verification')}
              icon={<FileCheck2 size={16} />}
              label="Verification"
            />
            <TabButton 
              active={activeTab === 'diagram'} 
              onClick={() => setActiveTab('diagram')}
              icon={<Network size={16} />}
              label="Diagram"
            />
            <TabButton 
              active={activeTab === 'waveform'} 
              onClick={() => setActiveTab('waveform')}
              icon={<Activity size={16} />}
              label="Waveform"
            />
            <TabButton 
              active={activeTab === 'architecture'} 
              onClick={() => setActiveTab('architecture')}
              icon={<Layers size={16} />}
              label="Architecture"
            />
          </div>
          
          <div className="flex space-x-2 min-w-max ml-4">
            <ActionButton 
              onClick={handleGenerateTestbench} 
              loading={isGeneratingTb}
              label="Generate TB"
            />
            <ActionButton 
              onClick={handleVerifyRtl} 
              loading={isVerifying}
              label="Verify RTL"
            />
            <ActionButton 
              onClick={handleGenerateDiagram} 
              loading={isGeneratingDiagram}
              label="Generate Diagram"
            />
            <ActionButton 
              onClick={handleGenerateWaveform} 
              loading={isGeneratingWaveform}
              label="Simulate Waveform"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'rtl' && (
            <CodeEditor code={rtlCode} onChange={setRtlCode} language="verilog" />
          )}
          {activeTab === 'testbench' && (
            <CodeEditor code={testbenchCode} onChange={setTestbenchCode} language="systemverilog" />
          )}
          {activeTab === 'verification' && (
            <VerificationReport report={verificationReport} />
          )}
          {activeTab === 'diagram' && (
            <DiagramViewer data={diagramData} />
          )}
          {activeTab === 'waveform' && (
            <WaveformViewer data={waveformData} />
          )}
          {activeTab === 'architecture' && (
            <VerificationReport report={architectureDoc} />
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors whitespace-nowrap ${
        active 
          ? 'bg-[#1A1C20] text-emerald-400 border-t border-x border-white/10' 
          : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function ActionButton({ onClick, loading, label }: { onClick: () => void, loading: boolean, label: string }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium rounded-md border border-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 whitespace-nowrap"
    >
      {loading && (
        <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      <span>{label}</span>
    </button>
  );
}
