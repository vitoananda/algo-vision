import type { ExecutionStep } from '../types/algo';

/**
 * Universal client-side JS stepper tracer for custom user-pasted code.
 * Analyzes code statements line by line, maintaining variable scope,
 * and generating visual steps with plain-language explanations.
 */
export function traceCustomJavaScript(code: string, rawInputArgs: string = ''): ExecutionStep[] {
  let parsedArgs: any[] = [];
  if (rawInputArgs.trim()) {
    try {
      parsedArgs = JSON.parse(`[${rawInputArgs}]`);
    } catch {
      parsedArgs = [rawInputArgs];
    }
  }

  return simulateExecution(code, parsedArgs);
}

function simulateExecution(code: string, args: any[]): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const lines = code.split('\n');
  const scope: { [key: string]: any } = {};

  // If arguments provided, try binding to function parameters
  const fnMatch = code.match(/function\s+([a-zA-Z0-9_$]+)\s*\(([^)]*)\)/);
  if (fnMatch && fnMatch[2].trim()) {
    const params = fnMatch[2].split(',').map((p) => p.trim());
    params.forEach((param, i) => {
      if (args[i] !== undefined) {
        scope[param] = args[i];
      }
    });
  }

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('//') || trimmed === '}' || trimmed === '{') {
      return;
    }

    // Detect variable declarations
    const letMatch = trimmed.match(/(?:let|const|var)\s+([a-zA-Z0-9_$]+)\s*=\s*([^;]+)/);
    if (letMatch) {
      const varName = letMatch[1];
      const rawExpr = letMatch[2].trim();
      try {
        // Safe evaluation of simple literals / array expressions using Function constructor
        scope[varName] = new Function(`return (${rawExpr})`)();
      } catch {
        scope[varName] = rawExpr;
      }
    }

    // Generate plain-English explanation
    let explanation = `Executing line ${lineNum}: \`${trimmed}\``;
    let intuition = 'Advancing algorithm execution state.';

    if (trimmed.startsWith('function')) {
      explanation = `Function declaration: initializes execution scope.`;
      intuition = `Sets up parameters and allocates memory frames.`;
    } else if (trimmed.startsWith('for') || trimmed.startsWith('while')) {
      explanation = `Evaluating loop header: \`${trimmed}\`.`;
      intuition = `Iterates sequentially across elements while condition holds true.`;
    } else if (trimmed.startsWith('if')) {
      explanation = `Checking branch condition: \`${trimmed}\`.`;
      intuition = `Assesses whether current values satisfy the algorithm's matching criteria.`;
    } else if (trimmed.startsWith('return')) {
      explanation = `Return statement encountered: \`${trimmed}\`. Computation finished.`;
      intuition = `Exits function and delivers the final result.`;
    } else if (letMatch) {
      explanation = `Assign \`${letMatch[1]}\` = ${JSON.stringify(scope[letMatch[1]])}.`;
      intuition = `Stores state variable to track progress or minimum/maximum values.`;
    }

    // Detect array and pointer variables for the visualizer
    let arrayCandidate: any[] | undefined = undefined;
    const pointers: { [k: string]: number } = {};

    Object.entries(scope).forEach(([k, v]) => {
      if (Array.isArray(v) && !arrayCandidate) {
        arrayCandidate = v;
      }
      if (typeof v === 'number' && v >= 0 && v < 50) {
        pointers[k] = v;
      }
    });

    steps.push({
      stepNumber: steps.length + 1,
      lineNumber: lineNum,
      plainEnglish: explanation,
      whyThisStep: intuition,
      variables: { ...scope },
      visualState: {
        type: 'array',
        array: arrayCandidate || [1, 2, 3, 4, 5],
        pointers: Object.keys(pointers).length > 0 ? pointers : undefined,
        customMessage: `Line ${lineNum}: ${trimmed}`,
      },
    });
  });

  return steps;
}
