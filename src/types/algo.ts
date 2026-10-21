export type DataStructureType = 'array' | 'two-pointers' | 'sliding-window' | 'stack' | 'linked-list' | 'binary-tree' | 'hash-map';

export interface VisualState {
  type: DataStructureType;
  array?: (number | string)[];
  highlights?: { [index: number]: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'dimmed' };
  pointers?: { [name: string]: number };
  stack?: (number | string)[];
  window?: { left: number; right: number };
  hashMap?: { [key: string]: any };
  customMessage?: string;
  returnValue?: any;
}

export interface ExecutionStep {
  stepNumber: number;
  lineNumber: number;
  plainEnglish: string;
  whyThisStep: string;
  invariantOrRule?: string;
  variables: { [key: string]: any };
  visualState: VisualState;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  companyTags: string[];
  summary: string;
  problemStatement: string;
  defaultInput: { [key: string]: any };
  inputSchema: {
    name: string;
    label: string;
    type: 'array' | 'number' | 'string';
    defaultValue: any;
  }[];
  code: string;
  algorithmBreakdown: {
    phase: string;
    description: string;
  }[];
  timeComplexity: string;
  spaceComplexity: string;
  runTracer: (inputs: any) => ExecutionStep[];
}
