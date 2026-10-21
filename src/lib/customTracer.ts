import type { ExecutionStep } from '../types/algo';

/**
 * Enhanced client-side JS stepper tracer for custom algorithms.
 * Dynamically binds arguments (e.g. nums1, nums2), evaluates expressions,
 * identifies algorithmic invariants (like median partition cuts),
 * and produces deep, line-by-line plain English explanations.
 */
export function traceCustomJavaScript(code: string, rawInputArgs: string = ''): ExecutionStep[] {
  let parsedArgs: any[] = [];
  if (rawInputArgs.trim()) {
    try {
      parsedArgs = JSON.parse(`[${rawInputArgs}]`);
    } catch {
      try {
        parsedArgs = new Function(`return [${rawInputArgs}]`)();
      } catch {
        parsedArgs = [[1, 3], [2]];
      }
    }
  } else {
    parsedArgs = [[1, 3], [2]];
  }

  // If user passed a single array wrapping multiple arrays e.g. [[1,4,5], [1,3,4], [2,6]]
  // Unwrap if the first item is an array of arrays and parameters expect multiple
  if (parsedArgs.length === 1 && Array.isArray(parsedArgs[0]) && Array.isArray(parsedArgs[0][0])) {
    parsedArgs = parsedArgs[0];
  }

  return simulateExecution(code, parsedArgs);
}

function simulateExecution(code: string, args: any[]): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const lines = code.split('\n');
  const scope: { [key: string]: any } = {};

  // Extract function parameters (e.g. nums1, nums2 or nums, target)
  const fnMatch =
    code.match(/function\s*([a-zA-Z0-9_$]*)\s*\(([^)]*)\)/) ||
    code.match(/(?:var|let|const)\s+([a-zA-Z0-9_$]+)\s*=\s*function\s*\(([^)]*)\)/) ||
    code.match(/(?:var|let|const)\s+([a-zA-Z0-9_$]+)\s*=\s*\(([^)]*)\)\s*=>/);

  if (fnMatch && fnMatch[2]?.trim()) {
    const params = fnMatch[2].split(',').map((p) => p.trim());
    params.forEach((param, i) => {
      if (args[i] !== undefined) {
        scope[param] = args[i];
      }
    });
  } else {
    // Fallback defaults for common 2-array signature
    if (args.length >= 2) {
      scope['nums1'] = args[0];
      scope['nums2'] = args[1];
    } else if (args.length === 1) {
      scope['nums'] = args[0];
    }
  }

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('//') || trimmed === '}' || trimmed === '{') {
      return;
    }

    // Evaluate variable assignments
    const varDeclMatch = trimmed.match(/(?:let|const|var)\s+([a-zA-Z0-9_$]+)\s*=\s*([^;]+)/);
    const assignMatch = !varDeclMatch && trimmed.match(/^([a-zA-Z0-9_$]+)\s*=\s*([^;]+)/);

    const activeVarName = varDeclMatch ? varDeclMatch[1] : assignMatch ? assignMatch[1] : null;
    const activeExpr = varDeclMatch ? varDeclMatch[2].trim() : assignMatch ? assignMatch[2].trim() : null;

    if (activeVarName && activeExpr) {
      try {
        // Construct sandbox evaluator with current scope variables
        const scopeKeys = Object.keys(scope);
        const scopeVals = Object.values(scope);
        const evalFn = new Function(...scopeKeys, `return (${activeExpr});`);
        scope[activeVarName] = evalFn(...scopeVals);
      } catch {
        // Fallback literal assignment
        scope[activeVarName] = activeExpr;
      }
    }

    // Synthesize rich, contextual plain English & intuition
    let plainEnglish = `Executing line ${lineNum}: \`${trimmed}\``;
    let whyThisStep = 'Processing algorithm state logic.';
    let invariantOrRule: string | undefined = undefined;

    // Pattern-specific explanations: Median of Two Sorted Arrays
    if (trimmed.includes('nums1.length > nums2.length')) {
      plainEnglish = `Checking if first array nums1 (length ${scope['nums1']?.length ?? 'm'}) is longer than nums2 (length ${scope['nums2']?.length ?? 'n'}).`;
      whyThisStep = `We MUST guarantee binary search runs on the SHORTER array so we achieve optimal O(log(min(m, n))) runtime instead of O(log(max(m, n))).`;
      invariantOrRule = 'Always binary search on smaller sequence.';
    } else if (trimmed.includes('Math.floor((low + high) / 2)')) {
      const cutA = scope['i'] !== undefined ? scope['i'] : 'mid';
      plainEnglish = `Calculate partition cut in nums1: i = floor((low + high) / 2) = ${cutA}.`;
      whyThisStep = `Cut i divides nums1 into a left part [0..${Number(cutA) - 1}] and right part [${cutA}..end].`;
      invariantOrRule = `Binary search partition: low=${scope['low']}, high=${scope['high']}.`;
    } else if (trimmed.includes('(m + n + 1) / 2') || trimmed.includes('- i')) {
      const cutB = scope['j'] !== undefined ? scope['j'] : 'partition2';
      plainEnglish = `Derive dependent partition cut in nums2: j = floor((m + n + 1) / 2) - i = ${cutB}.`;
      whyThisStep = `Ensures the combined left halves of nums1 and nums2 together contain EXACTLY half of the total elements across both arrays.`;
      invariantOrRule = 'Left total size == Right total size (or +1 if odd total).';
    } else if (trimmed.includes('leftA') && trimmed.includes('nums1')) {
      plainEnglish = `Find boundary values around cut i: leftA = ${scope['leftA']}, rightA = ${scope['rightA']}.`;
      whyThisStep = `If cut is at index 0, left is -Infinity (no left elements). If at end, right is +Infinity.`;
    } else if (trimmed.includes('leftB') && trimmed.includes('nums2')) {
      plainEnglish = `Find boundary values around cut j: leftB = ${scope['leftB']}, rightB = ${scope['rightB']}.`;
      whyThisStep = `Inspects the elements immediately adjacent to the partition seam in nums2.`;
    } else if (trimmed.includes('leftA <= rightB && leftB <= rightA')) {
      const validCut = scope['leftA'] <= scope['rightB'] && scope['leftB'] <= scope['rightA'];
      plainEnglish = `Validate partition balance: Does leftA (${scope['leftA']}) ≤ rightB (${scope['rightB']}) AND leftB (${scope['leftB']}) ≤ rightA (${scope['rightA']})? ${validCut ? 'YES! PERFECT CUT!' : 'NO - Cut needs adjustment.'}`;
      whyThisStep = validCut
        ? 'All elements in the combined left partitions are smaller than all elements in the combined right partitions. Median found!'
        : 'The arrays are not yet balanced across the partition line.';
      invariantOrRule = 'max(left elements) <= min(right elements).';
    } else if (trimmed.includes('(m + n) % 2 === 0')) {
      plainEnglish = `Total combined count is ${(scope['m'] || 0) + (scope['n'] || 0)}. Is it EVEN or ODD?`;
      whyThisStep = `Even totals require averaging the two middle numbers: (max(left) + min(right)) / 2. Odd totals take the single maximum on the left side.`;
    } else if (trimmed.includes('high = i - 1')) {
      plainEnglish = `leftA (${scope['leftA']}) is too big (> rightB ${scope['rightB']}). Shift high boundary to ${Number(scope['i']) - 1}.`;
      whyThisStep = `We took too many elements from nums1. We must search LEFT to pick fewer elements from nums1.`;
    } else if (trimmed.includes('low = i + 1')) {
      plainEnglish = `leftB is too big (> rightA). Shift low boundary to ${Number(scope['i']) + 1}.`;
      whyThisStep = `We took too few elements from nums1. We must search RIGHT to include more elements from nums1.`;
    } else if (trimmed.startsWith('function') || trimmed.includes('function(')) {
      plainEnglish = `Initialize function with parameters: ${Object.keys(scope).map((k) => `${k}=${JSON.stringify(scope[k])}`).join(', ')}.`;
      whyThisStep = 'Sets up the call frame and binds array inputs.';
    } else if (trimmed.startsWith('return')) {
      plainEnglish = `Return computed result: \`${trimmed}\`.`;
      whyThisStep = 'Delivers the median value and completes algorithm execution.';
    } else if (activeVarName) {
      plainEnglish = `Assign \`${activeVarName}\` = ${JSON.stringify(scope[activeVarName])}.`;
      whyThisStep = `Tracks pointer or length invariant in memory.`;
    }

    // Determine visual state
    let arrayCandidate: any[] | undefined = undefined;
    const pointers: { [k: string]: number } = {};

    Object.entries(scope).forEach(([k, v]) => {
      if (Array.isArray(v) && !arrayCandidate) {
        arrayCandidate = v;
      }
      if (typeof v === 'number' && v >= 0 && v < 50 && (k === 'low' || k === 'high' || k === 'i' || k === 'j' || k === 'mid')) {
        pointers[k] = v;
      }
    });

    // If both nums1 and nums2 exist in scope, provide clean multiArray visualization
    let multiArray: { label: string; items: any[]; pointers?: { [k: string]: number } }[] | undefined = undefined;
    if (Array.isArray(scope['nums1']) && Array.isArray(scope['nums2'])) {
      multiArray = [
        {
          label: 'nums1',
          items: scope['nums1'],
          pointers: {
            ...(scope['i'] !== undefined ? { cutA: scope['i'] } : {}),
            ...(scope['low'] !== undefined ? { low: scope['low'] } : {}),
            ...(scope['high'] !== undefined ? { high: scope['high'] } : {}),
          },
        },
        {
          label: 'nums2',
          items: scope['nums2'],
          pointers: {
            ...(scope['j'] !== undefined ? { cutB: scope['j'] } : {}),
          },
        },
      ];
    }

    steps.push({
      stepNumber: steps.length + 1,
      lineNumber: lineNum,
      plainEnglish,
      whyThisStep,
      invariantOrRule,
      variables: { ...scope },
      visualState: {
        type: 'two-pointers',
        array: arrayCandidate || (scope['nums1'] ? [...scope['nums1'], ...scope['nums2']] : [1, 2, 3, 4, 5]),
        multiArray,
        pointers: Object.keys(pointers).length > 0 ? pointers : undefined,
        customMessage: `Line ${lineNum}: ${trimmed}`,
      },
    });
  });

  return steps;
}
