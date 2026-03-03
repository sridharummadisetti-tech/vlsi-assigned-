import { GoogleGenAI, Type } from '@google/genai';

const getAiInstance = () => {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

export const generateRtl = async (description: string) => {
  const ai = getAiInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: `You are an expert VLSI engineer. Generate synthesizable Verilog RTL code for the following description:
    
    ${description}
    
    Return ONLY the Verilog code inside a \`\`\`verilog block. Do not include any other text.`,
  });
  
  let code = response.text || '';
  const match = code.match(/```(?:verilog)?\n([\s\S]*?)```/);
  if (match) {
    code = match[1];
  }
  return code.trim();
};

export const generateTestbench = async (code: string) => {
  const ai = getAiInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: `You are an expert VLSI verification engineer. Generate a comprehensive SystemVerilog testbench for the following Verilog module:
    
    ${code}
    
    Return ONLY the SystemVerilog code inside a \`\`\`systemverilog block. Do not include any other text.`,
  });
  
  let tbCode = response.text || '';
  const match = tbCode.match(/```(?:systemverilog|verilog)?\n([\s\S]*?)```/);
  if (match) {
    tbCode = match[1];
  }
  return tbCode.trim();
};

export const verifyRtl = async (code: string) => {
  const ai = getAiInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: `You are an expert VLSI design and verification engineer. Analyze the following Verilog code for:
    1. Common RTL design errors (e.g., inferred latches, multiple drivers).
    2. Synthesis issues.
    3. Linting warnings.
    4. Best practices and optimizations.
    
    Provide a detailed, well-structured markdown report.
    
    Code:
    ${code}`,
  });
  
  return response.text || '';
};

export const generateDiagram = async (code: string) => {
  const ai = getAiInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: `Analyze the following Verilog code and extract its structural information to visualize it as a block diagram.
    
    Code:
    ${code}
    
    Return a JSON object with this schema:
    {
      "moduleName": "string",
      "inputs": ["string"],
      "outputs": ["string"],
      "internalSignals": ["string"],
      "submodules": [
        { "instanceName": "string", "moduleName": "string" }
      ]
    }`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          moduleName: { type: Type.STRING },
          inputs: { type: Type.ARRAY, items: { type: Type.STRING } },
          outputs: { type: Type.ARRAY, items: { type: Type.STRING } },
          internalSignals: { type: Type.ARRAY, items: { type: Type.STRING } },
          submodules: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                instanceName: { type: Type.STRING },
                moduleName: { type: Type.STRING }
              },
              required: ["instanceName", "moduleName"]
            }
          }
        },
        required: ["moduleName", "inputs", "outputs", "internalSignals", "submodules"]
      }
    }
  });
  
  return JSON.parse(response.text || '{}');
};

export const generateTruthTable = async (rtlCode: string) => {
  const ai = getAiInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: `Analyze the following Verilog RTL and generate a truth table representing its logical behavior.
    
    RTL:
    ${rtlCode}
    
    Return a JSON object representing the truth table.
    Schema:
    {
      "description": "string", // Brief description of the table
      "headers": ["string"], // Input and output signal names
      "rows": [["string"]] // Array of rows, each row is an array of string values (e.g., '0', '1', 'X', 'Z')
    }
    `,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          headers: { type: Type.ARRAY, items: { type: Type.STRING } },
          rows: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.STRING } } }
        },
        required: ["description", "headers", "rows"]
      }
    }
  });
  
  return JSON.parse(response.text || '{}');
};

export const generateWaveform = async (rtlCode: string, tbCode: string) => {
  const ai = getAiInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: `Analyze the following Verilog RTL and Testbench. Generate a simulated waveform trace for the key signals.
    
    RTL:
    ${rtlCode}
    
    Testbench:
    ${tbCode}
    
    Return a JSON object representing the waveform in a format similar to WaveDrom.
    Schema:
    {
      "signals": [
        {
          "name": "string",
          "wave": "string", // Use '0', '1', 'x', '=', 'p' (pos edge clock with arrow), 'n' (neg edge clock with arrow), 'P' (pos edge clock), 'N' (neg edge clock), '.' (extend)
          "data": ["string"] // Array of data labels for '=' states
        }
      ]
    }
    Make the wave strings exactly 16 characters long (16 time steps).
    `,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          signals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                wave: { type: Type.STRING },
                data: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["name", "wave"]
            }
          }
        },
        required: ["signals"]
      }
    }
  });
  
  return JSON.parse(response.text || '{}');
};

export const designChip = async (description: string) => {
  const ai = getAiInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: `You are an expert SoC/Chip Architect. Given the following high-level requirements, design the chip architecture.
    
    Requirements:
    ${description}
    
    Provide a detailed Markdown document including:
    1. Architecture Overview
    2. Key Components (e.g., CPU, Memory, Peripherals)
    3. Memory Map
    4. External Interfaces (Pinout)
    5. Top-level Verilog module interface (module declaration only)
    `,
  });
  
  return response.text || '';
};
