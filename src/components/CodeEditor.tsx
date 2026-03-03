import React from 'react';
import Editor, { Monaco } from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: string;
}

const VERILOG_KEYWORDS = [
  'always', 'and', 'assign', 'automatic', 'begin', 'buf', 'bufif0', 'bufif1',
  'case', 'casex', 'casez', 'cell', 'cmos', 'config', 'deassign', 'default',
  'defparam', 'design', 'disable', 'edge', 'else', 'end', 'endcase', 'endconfig',
  'endfunction', 'endgenerate', 'endmodule', 'endprimitive', 'endspecify',
  'endtable', 'endtask', 'event', 'for', 'force', 'forever', 'fork', 'function',
  'generate', 'genvar', 'highz0', 'highz1', 'if', 'ifnone', 'incdir', 'include',
  'initial', 'inout', 'input', 'instance', 'integer', 'join', 'large', 'liblist',
  'library', 'localparam', 'macromodule', 'medium', 'module', 'nand', 'negedge',
  'nmos', 'nor', 'noshowcancelled', 'not', 'notif0', 'notif1', 'or', 'output',
  'parameter', 'pmos', 'posedge', 'primitive', 'pull0', 'pull1', 'pulldown',
  'pullup', 'rcmos', 'real', 'realtime', 'reg', 'release', 'repeat', 'rnmos',
  'rpmos', 'rtran', 'rtranif0', 'rtranif1', 'scalared', 'showcancelled',
  'signed', 'small', 'specify', 'specparam', 'strong0', 'strong1', 'supply0',
  'supply1', 'table', 'task', 'time', 'tran', 'tranif0', 'tranif1', 'tri',
  'tri0', 'tri1', 'triand', 'trior', 'trireg', 'unsigned', 'use', 'vectored',
  'wait', 'wand', 'weak0', 'weak1', 'while', 'wire', 'wor', 'xnor', 'xor'
];

const SV_KEYWORDS = [
  ...VERILOG_KEYWORDS,
  'alias', 'always_comb', 'always_ff', 'always_latch', 'assert', 'assume',
  'before', 'bind', 'bins', 'binsof', 'bit', 'break', 'build_coverage', 'byte',
  'chandle', 'checker', 'class', 'clocking', 'const', 'constraint', 'context',
  'continue', 'cover', 'covergroup', 'coverpoint', 'cross', 'dist', 'do',
  'endchecker', 'endclass', 'endclocking', 'endgroup', 'endinterface',
  'endpackage', 'endprogram', 'endproperty', 'endsequence', 'enum', 'expect',
  'export', 'extends', 'extern', 'final', 'first_match', 'foreach', 'forkjoin',
  'iff', 'ignore_bins', 'illegal_bins', 'implements', 'import', 'inside',
  'int', 'interface', 'intersect', 'join_any', 'join_none', 'local', 'logic',
  'longint', 'matches', 'modport', 'new', 'null', 'package', 'packed',
  'priority', 'program', 'property', 'protected', 'pure', 'rand', 'randc',
  'randcase', 'randsequence', 'ref', 'return', 'sequence', 'shortint',
  'shortreal', 'solve', 'static', 'string', 'struct', 'super', 'tagged',
  'this', 'throughout', 'timeprecision', 'timeunit', 'type', 'typedef',
  'union', 'unique', 'unique0', 'var', 'virtual', 'void', 'wait_order',
  'wildcard', 'with', 'within'
];

const SNIPPETS = [
  {
    label: 'module',
    insertText: 'module ${1:name} (\n\tinput wire ${2:clk},\n\toutput reg ${3:out}\n);\n\n\t${0}\n\nendmodule',
    documentation: 'Module declaration'
  },
  {
    label: 'always_ff',
    insertText: 'always_ff @(posedge ${1:clk} or negedge ${2:rst_n}) begin\n\tif (!${2:rst_n}) begin\n\t\t${3}\n\tend else begin\n\t\t${0}\n\tend\nend',
    documentation: 'Sequential logic block'
  },
  {
    label: 'always_comb',
    insertText: 'always_comb begin\n\t${0}\nend',
    documentation: 'Combinational logic block'
  },
  {
    label: 'initial',
    insertText: 'initial begin\n\t${0}\nend',
    documentation: 'Initial block'
  }
];

export function CodeEditor({ code, onChange, language }: CodeEditorProps) {
  const handleEditorWillMount = (monaco: Monaco) => {
    // Register completion provider for Verilog and SystemVerilog
    const provider = {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const suggestions = [
          ...SV_KEYWORDS.map(k => ({
            label: k,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: k,
            range
          })),
          ...SNIPPETS.map(s => ({
            label: s.label,
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: s.insertText,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: s.documentation,
            range
          }))
        ];

        return { suggestions };
      }
    };

    monaco.languages.registerCompletionItemProvider('verilog', provider);
    
    // Monaco might not have systemverilog built-in, so we map it to verilog
    // but if it does, we can register it there too.
    monaco.languages.registerCompletionItemProvider('systemverilog', provider);
  };

  return (
    <div className="w-full h-full">
      <Editor
        height="100%"
        language={language === 'systemverilog' ? 'verilog' : language}
        theme="vs-dark"
        value={code}
        onChange={(value) => onChange(value || '')}
        beforeMount={handleEditorWillMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          lineHeight: 24,
          padding: { top: 16 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          formatOnPaste: true,
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
        }}
      />
    </div>
  );
}
