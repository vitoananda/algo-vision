import type { ExecutionStep, Problem } from '../types/algo';

export const PROBLEMS: Problem[] = [
  // 1. Two Sum
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Hash Map',
    companyTags: ['Google', 'Meta', 'Amazon', 'Apple', 'Microsoft'],
    summary: 'Find two indices in an array that add up to a target value.',
    problemStatement:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    defaultInput: {
      nums: [2, 7, 11, 15],
      target: 9,
    },
    inputSchema: [
      { name: 'nums', label: 'Array (nums)', type: 'array', defaultValue: [2, 7, 11, 15] },
      { name: 'target', label: 'Target', type: 'number', defaultValue: 9 },
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    algorithmBreakdown: [
      { phase: '1. Memory Storage', description: 'Maintain a hash map `seen` storing { value: index }.' },
      { phase: '2. Complement Look-up', description: 'For each number `x`, check if `target - x` is already in our map.' },
      { phase: '3. Immediate Return', description: 'If found, return [seen[target - x], currentIndex]. Otherwise store `x`.' },
    ],
    code: `function twoSum(nums, target) {
  const seen = {};
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    const complement = target - num;
    if (seen[complement] !== undefined) {
      return [seen[complement], i];
    }
    seen[num] = i;
  }
  return [];
}`,
    runTracer: (inputs) => {
      const nums: number[] = Array.isArray(inputs.nums) ? inputs.nums : [2, 7, 11, 15];
      const target: number = Number(inputs.target ?? 9);
      const steps: ExecutionStep[] = [];
      const seen: { [key: string]: number } = {};

      steps.push({
        stepNumber: steps.length + 1,
        lineNumber: 2,
        plainEnglish: 'Initialize an empty hash map `seen` to remember numbers and their indices as we visit them.',
        whyThisStep: 'Using a hash map allows instantaneous O(1) lookups instead of checking every pair with nested loops (O(N²)).',
        invariantOrRule: '`seen` contains every number examined so far.',
        variables: { seen: {}, target },
        visualState: {
          type: 'hash-map',
          array: [...nums],
          hashMap: {},
          customMessage: 'Ready to scan the array.',
        },
      });

      for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        const complement = target - num;

        // Step: inspect current element
        steps.push({
          stepNumber: steps.length + 1,
          lineNumber: 4,
          plainEnglish: `Inspect number at index ${i}: value is ${num}.`,
          whyThisStep: `We need to check what partner number is needed so that (${num} + partner = ${target}).`,
          invariantOrRule: `Partner needed is: ${target} - ${num} = ${complement}.`,
          variables: { i, num, complement, seen: { ...seen } },
          visualState: {
            type: 'hash-map',
            array: [...nums],
            pointers: { i },
            highlights: { [i]: 'primary' },
            hashMap: { ...seen },
            customMessage: `Target is ${target}. Current number is ${num}. Looking for partner ${complement}.`,
          },
        });

        // Step: check complement
        if (seen[complement] !== undefined) {
          const complementIndex = seen[complement];
          steps.push({
            stepNumber: steps.length + 1,
            lineNumber: 6,
            plainEnglish: `BINGO! Partner ${complement} was found in our map at index ${complementIndex}.`,
            whyThisStep: `Since nums[${complementIndex}] (${complement}) + nums[${i}] (${num}) = ${target}, our search is complete!`,
            invariantOrRule: `Solution found: pair at [${complementIndex}, ${i}].`,
            variables: { i, complementIndex, num, complement, result: [complementIndex, i] },
            visualState: {
              type: 'hash-map',
              array: [...nums],
              pointers: { 'seen[complement]': complementIndex, i },
              highlights: { [complementIndex]: 'success', [i]: 'success' },
              hashMap: { ...seen },
              returnValue: [complementIndex, i],
              customMessage: `Match found! nums[${complementIndex}] (${complement}) + nums[${i}] (${num}) = ${target}`,
            },
          });
          return steps;
        }

        // Step: store in map
        seen[num] = i;
        steps.push({
          stepNumber: steps.length + 1,
          lineNumber: 9,
          plainEnglish: `Partner ${complement} is not in the map yet. Save current number ${num} at index ${i} in the map and move to the next item.`,
          whyThisStep: 'Later numbers might need this number as their complement.',
          invariantOrRule: `Map now has key ${num} pointing to index ${i}.`,
          variables: { i, num, seen: { ...seen } },
          visualState: {
            type: 'hash-map',
            array: [...nums],
            pointers: { i },
            highlights: { [i]: 'secondary' },
            hashMap: { ...seen },
            customMessage: `Saved ${num} -> index ${i} in map.`,
          },
        });
      }

      steps.push({
        stepNumber: steps.length + 1,
        lineNumber: 11,
        plainEnglish: 'Finished scanning the entire array without finding any pair that sums to the target.',
        whyThisStep: 'No valid pair exists in the input.',
        variables: { seen },
        visualState: {
          type: 'hash-map',
          array: [...nums],
          hashMap: { ...seen },
          returnValue: [],
          customMessage: 'No pair found.',
        },
      });

      return steps;
    },
  },

  // 2. Best Time to Buy and Sell Stock
  {
    id: 'best-time-to-buy-and-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    category: 'Two Pointers / Greedy',
    companyTags: ['Amazon', 'Microsoft', 'Google', 'Apple', 'Meta'],
    summary: 'Find the maximum profit you can achieve from buying on one day and selling on a future day.',
    problemStatement:
      'You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve.',
    defaultInput: {
      prices: [7, 1, 5, 3, 6, 4],
    },
    inputSchema: [
      { name: 'prices', label: 'Prices', type: 'array', defaultValue: [7, 1, 5, 3, 6, 4] },
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    algorithmBreakdown: [
      { phase: '1. Greedy Tracking', description: 'Keep track of the minimum buy price seen so far (`minPrice`).' },
      { phase: '2. Profit Calculation', description: 'For every price, calculate potential profit: `price - minPrice`.' },
      { phase: '3. Max Update', description: 'Update `maxProfit` whenever a higher profit is possible.' },
    ],
    code: `function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;
  for (let i = 0; i < prices.length; i++) {
    const price = prices[i];
    if (price < minPrice) {
      minPrice = price;
    } else {
      const profit = price - minPrice;
      maxProfit = Math.max(maxProfit, profit);
    }
  }
  return maxProfit;
}`,
    runTracer: (inputs) => {
      const prices: number[] = Array.isArray(inputs.prices) ? inputs.prices : [7, 1, 5, 3, 6, 4];
      const steps: ExecutionStep[] = [];
      let minPrice = Infinity;
      let minPriceIdx = -1;
      let maxProfit = 0;

      steps.push({
        stepNumber: steps.length + 1,
        lineNumber: 2,
        plainEnglish: 'Initialize `minPrice = Infinity` (looking for cheapest buy day) and `maxProfit = 0`.',
        whyThisStep: 'We want to find the lowest price to buy first, then check each subsequent day for selling profit.',
        variables: { minPrice: 'Infinity', maxProfit: 0 },
        visualState: {
          type: 'two-pointers',
          array: [...prices],
          customMessage: 'Ready to evaluate stock prices day by day.',
        },
      });

      for (let i = 0; i < prices.length; i++) {
        const price = prices[i];

        if (price < minPrice) {
          minPrice = price;
          minPriceIdx = i;
          steps.push({
            stepNumber: steps.length + 1,
            lineNumber: 6,
            plainEnglish: `Day ${i} has price $${price}, which is the cheapest we have seen! We record this as our new best day to buy.`,
            whyThisStep: 'Buying at a lower price gives us the greatest chance of a huge profit on later days.',
            invariantOrRule: `Cheapest buy price is now $${minPrice}.`,
            variables: { day: i, price, minPrice, maxProfit },
            visualState: {
              type: 'two-pointers',
              array: [...prices],
              pointers: { buy: i },
              highlights: { [i]: 'warning' },
              customMessage: `New minimum buy price found: $${minPrice} on Day ${i}.`,
            },
          });
        } else {
          const profit = price - minPrice;
          const oldMax = maxProfit;
          maxProfit = Math.max(maxProfit, profit);
          const isNewMax = maxProfit > oldMax;

          steps.push({
            stepNumber: steps.length + 1,
            lineNumber: 9,
            plainEnglish: `Day ${i} price is $${price}. If we bought at $${minPrice} (Day ${minPriceIdx}) and sell today, profit is $${profit} ($${price} - $${minPrice}).`,
            whyThisStep: isNewMax
              ? `This beats our previous best profit of $${oldMax}! Updating max profit to $${maxProfit}.`
              : `Current profit ($${profit}) does not beat our previous best of $${maxProfit}.`,
            invariantOrRule: `Max profit so far: $${maxProfit}.`,
            variables: { day: i, price, buyPrice: minPrice, potentialProfit: profit, maxProfit },
            visualState: {
              type: 'two-pointers',
              array: [...prices],
              pointers: { buy: minPriceIdx, sell: i },
              highlights: { [minPriceIdx]: 'warning', [i]: isNewMax ? 'success' : 'secondary' },
              customMessage: `Buy on Day ${minPriceIdx} ($${minPrice}), Sell on Day ${i} ($${price}) -> Profit: $${profit}. Best: $${maxProfit}`,
            },
          });
        }
      }

      steps.push({
        stepNumber: steps.length + 1,
        lineNumber: 13,
        plainEnglish: `Finished checking all days. The maximum possible profit is $${maxProfit}.`,
        whyThisStep: 'We scanned every day in single pass O(N) time with zero backtracking.',
        variables: { maxProfit },
        visualState: {
          type: 'two-pointers',
          array: [...prices],
          returnValue: maxProfit,
          customMessage: `Final Result: Maximum profit is $${maxProfit}.`,
        },
      });

      return steps;
    },
  },

  // 3. Valid Palindrome (Two Pointers)
  {
    id: 'valid-palindrome',
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    category: 'Two Pointers',
    companyTags: ['Meta', 'Microsoft', 'Amazon', 'Apple'],
    summary: 'Determine if a string reads the same forward and backward after filtering non-alphanumeric chars.',
    problemStatement:
      'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.',
    defaultInput: {
      s: 'A man, a plan, a canal: Panama',
    },
    inputSchema: [
      { name: 's', label: 'Input String', type: 'string', defaultValue: 'A man, a plan, a canal: Panama' },
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    algorithmBreakdown: [
      { phase: '1. Clean String', description: 'Convert to lowercase and remove non-alphanumeric characters.' },
      { phase: '2. Two Pointers', description: 'Place `left` at index 0 and `right` at the last index.' },
      { phase: '3. Compare & Move Inward', description: 'Check chars at both pointers. If they match, move inward. If mismatch, return false.' },
    ],
    code: `function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0;
  let right = clean.length - 1;
  while (left < right) {
    if (clean[left] !== clean[right]) {
      return false;
    }
    left++;
    right--;
  }
  return true;
}`,
    runTracer: (inputs) => {
      const rawStr = String(inputs.s ?? 'A man, a plan, a canal: Panama');
      const clean = rawStr.toLowerCase().replace(/[^a-z0-9]/g, '');
      const chars = clean.split('');
      const steps: ExecutionStep[] = [];

      steps.push({
        stepNumber: steps.length + 1,
        lineNumber: 2,
        plainEnglish: `Clean string by lowercasing and stripping punctuation. Cleaned string is "${clean}" (length: ${clean.length}).`,
        whyThisStep: 'Palindromes ignore spaces, punctuation, and capitalization.',
        variables: { raw: rawStr, clean },
        visualState: {
          type: 'two-pointers',
          array: chars,
          customMessage: `Sanitized string: "${clean}"`,
        },
      });

      let left = 0;
      let right = chars.length - 1;

      steps.push({
        stepNumber: steps.length + 1,
        lineNumber: 3,
        plainEnglish: `Set two pointers: \`left\` at start (index 0, char '${chars[left]}') and \`right\` at end (index ${right}, char '${chars[right]}').`,
        whyThisStep: 'Two pointers allow us to compare opposite ends simultaneously.',
        variables: { left, right },
        visualState: {
          type: 'two-pointers',
          array: chars,
          pointers: { left, right },
          highlights: { [left]: 'primary', [right]: 'secondary' },
          customMessage: `Left at 0 ('${chars[left]}'), Right at ${right} ('${chars[right]}')`,
        },
      });

      while (left < right) {
        const match = chars[left] === chars[right];
        steps.push({
          stepNumber: steps.length + 1,
          lineNumber: 6,
          plainEnglish: `Compare left char '${chars[left]}' with right char '${chars[right]}'. ${match ? 'They MATCH!' : 'They DO NOT match!'}`,
          whyThisStep: match
            ? 'Since these opposite characters are identical, this part of the string satisfies the palindrome condition.'
            : 'If any pair of mirrored characters differs, the whole string is immediately disqualified.',
          invariantOrRule: match ? 'Symmetry holds so far.' : 'Symmetry broken.',
          variables: { left, right, leftChar: chars[left], rightChar: chars[right], match },
          visualState: {
            type: 'two-pointers',
            array: chars,
            pointers: { left, right },
            highlights: { [left]: match ? 'success' : 'danger', [right]: match ? 'success' : 'danger' },
            customMessage: match
              ? `'${chars[left]}' matches '${chars[right]}'. Keep going!`
              : `'${chars[left]}' does not match '${chars[right]}'. Not a palindrome!`,
          },
        });

        if (!match) {
          steps.push({
            stepNumber: steps.length + 1,
            lineNumber: 7,
            plainEnglish: `Return false because chars at index ${left} and ${right} are different.`,
            whyThisStep: 'A single mismatch invalidates the palindrome property.',
            variables: { result: false },
            visualState: {
              type: 'two-pointers',
              array: chars,
              pointers: { left, right },
              highlights: { [left]: 'danger', [right]: 'danger' },
              returnValue: false,
              customMessage: 'Result: false',
            },
          });
          return steps;
        }

        left++;
        right--;
      }

      steps.push({
        stepNumber: steps.length + 1,
        lineNumber: 12,
        plainEnglish: 'Both pointers met or crossed in the middle without any mismatches. The string is a VALID PALINDROME!',
        whyThisStep: 'All opposite character pairs matched perfectly.',
        variables: { result: true },
        visualState: {
          type: 'two-pointers',
          array: chars,
          returnValue: true,
          customMessage: 'Result: true (Valid Palindrome)',
        },
      });

      return steps;
    },
  },

  // 4. Container With Most Water (Two Pointers)
  {
    id: 'container-with-most-water',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    category: 'Two Pointers',
    companyTags: ['Google', 'Meta', 'Amazon', 'Apple', 'Goldman Sachs'],
    summary: 'Find two lines that together with the x-axis form a container holding the most water.',
    problemStatement:
      'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.',
    defaultInput: {
      height: [1, 8, 6, 2, 5, 4, 8, 3, 7],
    },
    inputSchema: [
      { name: 'height', label: 'Heights', type: 'array', defaultValue: [1, 8, 6, 2, 5, 4, 8, 3, 7] },
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    algorithmBreakdown: [
      { phase: '1. Widest Width First', description: 'Start with pointers at both extremes: `left = 0`, `right = n - 1`.' },
      { phase: '2. Area Calculation', description: 'Area = `(right - left) * min(height[left], height[right])`.' },
      { phase: '3. Greedy Pointer Step', description: 'The shorter line limits the height. Moving the taller line can never increase water. Therefore, move the shorter pointer inward.' },
    ],
    code: `function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let maxWater = 0;
  while (left < right) {
    const width = right - left;
    const h = Math.min(height[left], height[right]);
    const area = width * h;
    maxWater = Math.max(maxWater, area);
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return maxWater;
}`,
    runTracer: (inputs) => {
      const height: number[] = Array.isArray(inputs.height) ? inputs.height : [1, 8, 6, 2, 5, 4, 8, 3, 7];
      const steps: ExecutionStep[] = [];
      let left = 0;
      let right = height.length - 1;
      let maxWater = 0;

      steps.push({
        stepNumber: steps.length + 1,
        lineNumber: 2,
        plainEnglish: `Start with the widest container: \`left = 0\` (height ${height[0]}) and \`right = ${right}\` (height ${height[right]}).`,
        whyThisStep: 'Starting at maximum width gives the largest possible base. Now we greedily search for taller walls.',
        variables: { left, right, maxWater: 0 },
        visualState: {
          type: 'two-pointers',
          array: [...height],
          pointers: { left, right },
          highlights: { [left]: 'primary', [right]: 'secondary' },
          customMessage: 'Initial container set across the entire array.',
        },
      });

      while (left < right) {
        const width = right - left;
        const h = Math.min(height[left], height[right]);
        const area = width * h;
        const prevMax = maxWater;
        maxWater = Math.max(maxWater, area);
        const isRecord = maxWater > prevMax;

        steps.push({
          stepNumber: steps.length + 1,
          lineNumber: 7,
          plainEnglish: `Current container: width = ${width}, limiting height = min(${height[left]}, ${height[right]}) = ${h}. Water trapped = ${width} × ${h} = ${area}.`,
          whyThisStep: isRecord
            ? `New maximum water record: ${maxWater} units!`
            : `Current water ${area} is less than our record ${maxWater}.`,
          invariantOrRule: `Limiting height is always the shorter wall (${h}).`,
          variables: { left, right, width, limitingHeight: h, currentArea: area, maxWater },
          visualState: {
            type: 'two-pointers',
            array: [...height],
            pointers: { left, right },
            highlights: { [left]: isRecord ? 'success' : 'primary', [right]: isRecord ? 'success' : 'secondary' },
            customMessage: `Width: ${width}, Height: ${h} -> Water Area: ${area}. Best: ${maxWater}`,
          },
        });

        if (height[left] < height[right]) {
          const oldLeft = left;
          left++;
          steps.push({
            stepNumber: steps.length + 1,
            lineNumber: 10,
            plainEnglish: `Left wall (${height[oldLeft]}) is shorter than right wall (${height[right]}). Shift left pointer inward from ${oldLeft} to ${left}.`,
            whyThisStep: 'Keeping the shorter wall can never produce more water as width shrinks, so our only hope is finding a taller left wall.',
            variables: { left, right, maxWater },
            visualState: {
              type: 'two-pointers',
              array: [...height],
              pointers: { left, right },
              highlights: { [oldLeft]: 'dimmed', [left]: 'primary', [right]: 'secondary' },
              customMessage: `Discarded shorter left wall (${height[oldLeft]}), advancing left to ${left}.`,
            },
          });
        } else {
          const oldRight = right;
          right--;
          steps.push({
            stepNumber: steps.length + 1,
            lineNumber: 12,
            plainEnglish: `Right wall (${height[oldRight]}) is shorter than or equal to left wall (${height[left]}). Shift right pointer inward from ${oldRight} to ${right}.`,
            whyThisStep: 'Keeping the shorter right wall cannot increase area as width shrinks. We move right inward hoping for a taller wall.',
            variables: { left, right, maxWater },
            visualState: {
              type: 'two-pointers',
              array: [...height],
              pointers: { left, right },
              highlights: { [oldRight]: 'dimmed', [left]: 'primary', [right]: 'secondary' },
              customMessage: `Discarded shorter right wall (${height[oldRight]}), retreating right to ${right}.`,
            },
          });
        }
      }

      steps.push({
        stepNumber: steps.length + 1,
        lineNumber: 15,
        plainEnglish: `Pointers met. All viable containers have been inspected. The maximum water container holds ${maxWater} units.`,
        whyThisStep: 'O(N) single-pass greedy scan successfully evaluated all maximum-area potentials.',
        variables: { maxWater },
        visualState: {
          type: 'two-pointers',
          array: [...height],
          returnValue: maxWater,
          customMessage: `Final Answer: Maximum water is ${maxWater}.`,
        },
      });

      return steps;
    },
  },

  // 5. Sliding Window: Longest Substring Without Repeating Characters
  {
    id: 'longest-substring-without-repeating-characters',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'Sliding Window',
    companyTags: ['Amazon', 'Microsoft', 'Bloomberg', 'Google', 'Meta'],
    summary: 'Find the length of the longest substring containing all unique characters.',
    problemStatement:
      'Given a string s, find the length of the longest substring without duplicate characters.',
    defaultInput: {
      s: 'abcabcbb',
    },
    inputSchema: [
      { name: 's', label: 'Input String', type: 'string', defaultValue: 'abcabcbb' },
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(min(N, M))',
    algorithmBreakdown: [
      { phase: '1. Sliding Window', description: 'Expand the window by advancing `right` pointer one character at a time.' },
      { phase: '2. Duplicate Detection', description: 'Track characters in a Set or Map. If a duplicate is encountered, shrink from `left`.' },
      { phase: '3. Max Length Tracking', description: 'Window length is `right - left + 1`. Track maximum length seen.' },
    ],
    code: `function lengthOfLongestSubstring(s) {
  let left = 0;
  let maxLen = 0;
  const seenChars = new Set();
  for (let right = 0; right < s.length; right++) {
    while (seenChars.has(s[right])) {
      seenChars.delete(s[left]);
      left++;
    }
    seenChars.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
    runTracer: (inputs) => {
      const s = String(inputs.s ?? 'abcabcbb');
      const chars = s.split('');
      const steps: ExecutionStep[] = [];
      const seen = new Set<string>();
      let left = 0;
      let maxLen = 0;

      steps.push({
        stepNumber: steps.length + 1,
        lineNumber: 2,
        plainEnglish: 'Initialize `left = 0`, `maxLen = 0`, and an empty Set `seenChars` for our sliding window.',
        whyThisStep: 'A sliding window dynamically expands when safe and shrinks when duplicates occur.',
        variables: { left: 0, maxLen: 0, seen: [] },
        visualState: {
          type: 'sliding-window',
          array: chars,
          window: { left: 0, right: 0 },
          customMessage: 'Ready to expand window.',
        },
      });

      for (let right = 0; right < chars.length; right++) {
        const char = chars[right];

        // Shrink while duplicate
        while (seen.has(char)) {
          steps.push({
            stepNumber: steps.length + 1,
            lineNumber: 6,
            plainEnglish: `Character '${char}' at index ${right} is ALREADY inside our window! Shrink from the left by removing '${chars[left]}' and moving left pointer.`,
            whyThisStep: 'The problem requires substrings with ZERO duplicate characters. We must evict old characters until the duplicate is gone.',
            invariantOrRule: `Evicting chars until '${char}' is no longer in set.`,
            variables: { left, right, duplicateChar: char, evictedChar: chars[left], set: Array.from(seen) },
            visualState: {
              type: 'sliding-window',
              array: chars,
              window: { left, right },
              pointers: { left, right },
              highlights: { [left]: 'warning', [right]: 'danger' },
              customMessage: `Duplicate '${char}' detected! Evicting '${chars[left]}' at left index ${left}.`,
            },
          });
          seen.delete(chars[left]);
          left++;
        }

        seen.add(char);
        const currentLen = right - left + 1;
        const prevMax = maxLen;
        maxLen = Math.max(maxLen, currentLen);
        const isNewMax = maxLen > prevMax;

        steps.push({
          stepNumber: steps.length + 1,
          lineNumber: 10,
          plainEnglish: `Added '${char}' to window. Valid unique window is "${chars.slice(left, right + 1).join('')}" (length ${currentLen}).`,
          whyThisStep: isNewMax
            ? `New record length: ${maxLen} characters!`
            : `Current window size is ${currentLen}, best so far is ${maxLen}.`,
          invariantOrRule: 'Every character inside window [left...right] is 100% unique.',
          variables: { left, right, windowString: chars.slice(left, right + 1).join(''), windowLength: currentLen, maxLen, set: Array.from(seen) },
          visualState: {
            type: 'sliding-window',
            array: chars,
            window: { left, right },
            pointers: { left, right },
            highlights: { [right]: isNewMax ? 'success' : 'primary' },
            customMessage: `Window [${left}..${right}]: "${chars.slice(left, right + 1).join('')}" | Length: ${currentLen} | Max: ${maxLen}`,
          },
        });
      }

      steps.push({
        stepNumber: steps.length + 1,
        lineNumber: 13,
        plainEnglish: `Finished scanning string. The longest substring with unique characters has length ${maxLen}.`,
        whyThisStep: 'Each character was added once and removed at most once: overall O(N) linear time.',
        variables: { maxLen },
        visualState: {
          type: 'sliding-window',
          array: chars,
          returnValue: maxLen,
          customMessage: `Final Answer: Longest unique substring length is ${maxLen}.`,
        },
      });

      return steps;
    },
  },

  // 6. Valid Parentheses (Stack)
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stack',
    companyTags: ['Meta', 'Amazon', 'Bloomberg', 'Google', 'Apple', 'LinkedIn'],
    summary: 'Determine if an input string of brackets is valid using a LIFO Stack.',
    problemStatement:
      'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid. Open brackets must be closed by the same type of brackets, and in the correct order.',
    defaultInput: {
      s: '()[]{[()]}',
    },
    inputSchema: [
      { name: 's', label: 'Bracket String', type: 'string', defaultValue: '()[]{[()]}' },
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    algorithmBreakdown: [
      { phase: '1. Open Bracket', description: 'When encountering an opening bracket `(`, `{`, `[`, push it onto the stack.' },
      { phase: '2. Close Bracket Match', description: 'When encountering a closing bracket, pop the top of the stack and ensure it matches.' },
      { phase: '3. Empty Stack Check', description: 'At the end, if the stack is completely empty, all pairs matched correctly.' },
    ],
    code: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      const top = stack.pop();
      if (top !== map[char]) {
        return false;
      }
    }
  }
  return stack.length === 0;
}`,
    runTracer: (inputs) => {
      const s = String(inputs.s ?? '()[]{[()]}');
      const chars = s.split('');
      const steps: ExecutionStep[] = [];
      const stack: string[] = [];
      const map: { [key: string]: string } = { ')': '(', '}': '{', ']': '[' };

      steps.push({
        stepNumber: steps.length + 1,
        lineNumber: 2,
        plainEnglish: 'Initialize an empty Stack to track pending open brackets in Last-In-First-Out (LIFO) order.',
        whyThisStep: 'A stack ensures the most recently opened bracket is closed first.',
        variables: { stack: [] },
        visualState: {
          type: 'stack',
          array: chars,
          stack: [],
          customMessage: 'Empty stack ready.',
        },
      });

      for (let i = 0; i < chars.length; i++) {
        const char = chars[i];

        if (char === '(' || char === '{' || char === '[') {
          stack.push(char);
          steps.push({
            stepNumber: steps.length + 1,
            lineNumber: 6,
            plainEnglish: `Found open bracket '${char}' at position ${i}. Push it onto the stack.`,
            whyThisStep: 'We must wait for a matching closing bracket in future steps.',
            invariantOrRule: `Top of stack is now '${char}'.`,
            variables: { i, char, stack: [...stack] },
            visualState: {
              type: 'stack',
              array: chars,
              pointers: { i },
              highlights: { [i]: 'primary' },
              stack: [...stack],
              customMessage: `Pushed '${char}' onto stack. Stack depth: ${stack.length}`,
            },
          });
        } else {
          const top = stack.pop();
          const expected = map[char];
          const matches = top === expected;

          steps.push({
            stepNumber: steps.length + 1,
            lineNumber: 8,
            plainEnglish: `Found closing bracket '${char}' at position ${i}. Pop top of stack (got '${top || 'EMPTY'}'). Does it match expected '${expected}'? ${matches ? 'YES' : 'NO'}`,
            whyThisStep: matches
              ? `The bracket pair ${top}...${char} is cleanly resolved and cancelled out.`
              : `Mismatched brackets! Expected open '${expected}', but top was '${top || 'empty stack'}'.`,
            invariantOrRule: matches ? 'Enclosure valid so far.' : 'Bracket hierarchy violated.',
            variables: { i, char, popped: top, expectedOpen: expected, match: matches, stack: [...stack] },
            visualState: {
              type: 'stack',
              array: chars,
              pointers: { i },
              highlights: { [i]: matches ? 'success' : 'danger' },
              stack: [...stack],
              customMessage: matches
                ? `Matched pair '${top}' with '${char}'.`
                : `Mismatch! '${char}' doesn't match popped '${top || 'none'}'.`,
            },
          });

          if (!matches) {
            steps.push({
              stepNumber: steps.length + 1,
              lineNumber: 10,
              plainEnglish: `Return false immediately due to bracket mismatch at position ${i}.`,
              whyThisStep: 'Invalid bracket ordering detected.',
              variables: { result: false },
              visualState: {
                type: 'stack',
                array: chars,
                pointers: { i },
                highlights: { [i]: 'danger' },
                stack: [...stack],
                returnValue: false,
                customMessage: 'Result: false (Invalid Brackets)',
              },
            });
            return steps;
          }
        }
      }

      const isValid = stack.length === 0;
      steps.push({
        stepNumber: steps.length + 1,
        lineNumber: 14,
        plainEnglish: isValid
          ? 'Finished checking all characters and stack is empty. All brackets opened and closed in perfect order!'
          : `Finished checking string, but ${stack.length} opening bracket(s) were never closed.`,
        whyThisStep: isValid ? 'Valid string satisfied.' : 'Dangling open brackets remain.',
        variables: { result: isValid, leftoverStack: [...stack] },
        visualState: {
          type: 'stack',
          array: chars,
          stack: [...stack],
          returnValue: isValid,
          customMessage: isValid ? 'Result: true (Valid Parentheses)' : 'Result: false (Unclosed brackets remaining)',
        },
      });

      return steps;
    },
  },

  // 7. Binary Search
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    category: 'Binary Search',
    companyTags: ['Google', 'Meta', 'Amazon', 'Apple', 'Microsoft'],
    summary: 'Search for a target value inside a sorted array in logarithmic O(log N) time.',
    problemStatement:
      'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.',
    defaultInput: {
      nums: [-1, 0, 3, 5, 9, 12, 16, 20, 25],
      target: 9,
    },
    inputSchema: [
      { name: 'nums', label: 'Sorted Array', type: 'array', defaultValue: [-1, 0, 3, 5, 9, 12, 16, 20, 25] },
      { name: 'target', label: 'Target', type: 'number', defaultValue: 9 },
    ],
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(1)',
    algorithmBreakdown: [
      { phase: '1. Search Range', description: 'Initialize `low = 0` and `high = nums.length - 1`.' },
      { phase: '2. Midpoint Check', description: 'Compute `mid = Math.floor((low + high) / 2)`. If `nums[mid] === target`, return `mid`.' },
      { phase: '3. Halve Search Space', description: 'If `nums[mid] < target`, discard left half (`low = mid + 1`). Otherwise discard right half (`high = mid - 1`).' },
    ],
    code: `function search(nums, target) {
  let low = 0;
  let high = nums.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return -1;
}`,
    runTracer: (inputs) => {
      const nums: number[] = Array.isArray(inputs.nums) ? inputs.nums : [-1, 0, 3, 5, 9, 12, 16, 20, 25];
      const target: number = Number(inputs.target ?? 9);
      const steps: ExecutionStep[] = [];
      let low = 0;
      let high = nums.length - 1;

      steps.push({
        stepNumber: steps.length + 1,
        lineNumber: 2,
        plainEnglish: `Set search boundaries: \`low = 0\` and \`high = ${high}\`. Target to find is ${target}.`,
        whyThisStep: 'Since the array is sorted, our target must lie between low and high if it exists.',
        variables: { low, high, target },
        visualState: {
          type: 'two-pointers',
          array: [...nums],
          pointers: { low, high },
          highlights: { [low]: 'primary', [high]: 'secondary' },
          customMessage: `Search range [${low} .. ${high}] covering ${nums.length} elements.`,
        },
      });

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const midVal = nums[mid];

        // Step: inspect mid
        steps.push({
          stepNumber: steps.length + 1,
          lineNumber: 5,
          plainEnglish: `Calculate midpoint: index mid = floor((${low} + ${high}) / 2) = ${mid}. Value at mid is nums[${mid}] = ${midVal}.`,
          whyThisStep: 'By checking the exact center, we can eliminate half of the remaining items in a single comparison.',
          invariantOrRule: `Examining nums[${mid}] (${midVal}) against target (${target}).`,
          variables: { low, high, mid, midVal, target },
          visualState: {
            type: 'two-pointers',
            array: [...nums],
            pointers: { low, mid, high },
            highlights: {
              ...Object.fromEntries(
                nums.map((_, idx) => [idx, idx < low || idx > high ? 'dimmed' : idx === mid ? 'primary' : 'secondary'])
              ),
            },
            customMessage: `Inspecting middle element nums[${mid}] = ${midVal}.`,
          },
        });

        if (midVal === target) {
          steps.push({
            stepNumber: steps.length + 1,
            lineNumber: 7,
            plainEnglish: `FOUND TARGET! nums[${mid}] (${midVal}) matches target ${target} exactly. Return index ${mid}.`,
            whyThisStep: 'Search criteria met.',
            variables: { result: mid },
            visualState: {
              type: 'two-pointers',
              array: [...nums],
              pointers: { found: mid },
              highlights: { [mid]: 'success' },
              returnValue: mid,
              customMessage: `Target ${target} located at index ${mid}!`,
            },
          });
          return steps;
        } else if (midVal < target) {
          const oldLow = low;
          low = mid + 1;
          steps.push({
            stepNumber: steps.length + 1,
            lineNumber: 9,
            plainEnglish: `nums[${mid}] (${midVal}) is LESS than target (${target}). Because the array is sorted, no value before index ${mid} can be our target. Discard entire left half and shift low to ${low}.`,
            whyThisStep: `Eliminated elements from index ${oldLow} to ${mid} in one step!`,
            variables: { low, high, target },
            visualState: {
              type: 'two-pointers',
              array: [...nums],
              pointers: { low, high },
              highlights: {
                ...Object.fromEntries(
                  nums.map((_, idx) => [idx, idx < low || idx > high ? 'dimmed' : 'primary'])
                ),
              },
              customMessage: `Discarded left half. New active search range is [${low} .. ${high}].`,
            },
          });
        } else {
          const oldHigh = high;
          high = mid - 1;
          steps.push({
            stepNumber: steps.length + 1,
            lineNumber: 11,
            plainEnglish: `nums[${mid}] (${midVal}) is GREATER than target (${target}). Because array is sorted, no value after index ${mid} can be our target. Discard right half and shift high to ${high}.`,
            whyThisStep: `Eliminated elements from index ${mid} to ${oldHigh} in one step!`,
            variables: { low, high, target },
            visualState: {
              type: 'two-pointers',
              array: [...nums],
              pointers: { low, high },
              highlights: {
                ...Object.fromEntries(
                  nums.map((_, idx) => [idx, idx < low || idx > high ? 'dimmed' : 'primary'])
                ),
              },
              customMessage: `Discarded right half. New active search range is [${low} .. ${high}].`,
            },
          });
        }
      }

      steps.push({
        stepNumber: steps.length + 1,
        lineNumber: 14,
        plainEnglish: `Search space exhausted (low > high). Target ${target} does not exist in array. Return -1.`,
        whyThisStep: 'All possible candidate indices were systematically ruled out.',
        variables: { result: -1 },
        visualState: {
          type: 'two-pointers',
          array: [...nums],
          returnValue: -1,
          customMessage: 'Result: -1 (Target not found)',
        },
      });

      return steps;
    },
  },

  // 8. Trapping Rain Water (Hard)
  {
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    category: 'Two Pointers / Simulation',
    companyTags: ['Google', 'Meta', 'Amazon', 'Apple', 'Goldman Sachs', 'Uber'],
    summary: 'Compute how much water can be trapped between elevation map bars after raining.',
    problemStatement:
      'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    defaultInput: {
      height: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
    },
    inputSchema: [
      {
        name: 'height',
        label: 'Elevation Heights',
        type: 'array',
        defaultValue: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
      },
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    algorithmBreakdown: [
      {
        phase: '1. Two Pointers & Max Walls',
        description:
          'Place `left` at 0, `right` at end. Track `leftMax` and `rightMax` bounding walls.',
      },
      {
        phase: '2. Bottleneck Principle',
        description:
          'Water trapped above any position is strictly determined by the shorter barrier: `min(leftMax, rightMax) - height[i]`.',
      },
      {
        phase: '3. Inward Advance',
        description:
          'If `leftMax < rightMax`, the left side is guaranteed to be the limiting bottleneck. Process `left` and advance. Otherwise process `right` and retreat.',
      },
    ],
    code: `function trap(height) {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let totalWater = 0;

  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) {
        leftMax = height[left];
      } else {
        totalWater += leftMax - height[left];
      }
      left++;
    } else {
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        totalWater += rightMax - height[right];
      }
      right--;
    }
  }
  return totalWater;
}`,
    runTracer: (inputs) => {
      const height: number[] = Array.isArray(inputs.height)
        ? inputs.height
        : [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
      const steps: ExecutionStep[] = [];
      let left = 0;
      let right = height.length - 1;
      let leftMax = 0;
      let rightMax = 0;
      let totalWater = 0;

      steps.push({
        stepNumber: steps.length + 1,
        lineNumber: 2,
        plainEnglish: `Set boundaries: \`left = 0\` (elevation ${height[0]}), \`right = ${right}\` (elevation ${height[right]}). Initialize \`leftMax = 0\`, \`rightMax = 0\`, \`totalWater = 0\`.`,
        whyThisStep:
          'Trapping rain water requires knowing the tallest barriers to both the left and right of every bar. The two-pointer approach finds this in O(1) space!',
        variables: { left, right, leftMax, rightMax, totalWater },
        visualState: {
          type: 'two-pointers',
          array: [...height],
          pointers: { left, right },
          highlights: { [left]: 'primary', [right]: 'secondary' },
          customMessage: `Starting 2-pointer scan. Total water = 0.`,
        },
      });

      while (left < right) {
        if (height[left] < height[right]) {
          const curH = height[left];
          if (curH >= leftMax) {
            leftMax = curH;
            steps.push({
              stepNumber: steps.length + 1,
              lineNumber: 11,
              plainEnglish: `Bar at left index ${left} has height ${curH}, which is >= our current leftMax (${leftMax}). Update leftMax to ${curH}.`,
              whyThisStep:
                'Since this bar is a new peak on the left, water cannot pool on top of it without spilling over. It becomes a new retaining wall.',
              invariantOrRule: `leftMax is now ${leftMax}. Bottleneck is still the left side because height[left] (${curH}) < height[right] (${height[right]}).`,
              variables: { left, right, leftMax, rightMax, totalWater },
              visualState: {
                type: 'two-pointers',
                array: [...height],
                pointers: { left, right },
                highlights: { [left]: 'warning', [right]: 'secondary' },
                customMessage: `New left peak: leftMax = ${leftMax}. No water trapped on top of peak.`,
              },
            });
          } else {
            const trapped = leftMax - curH;
            totalWater += trapped;
            steps.push({
              stepNumber: steps.length + 1,
              lineNumber: 13,
              plainEnglish: `Bar at left index ${left} is ${curH} tall, but leftMax is ${leftMax}. Because rightMax (${rightMax || height[right]}) is even taller, water traps here! Trapped: ${leftMax} - ${curH} = +${trapped} units.`,
              whyThisStep:
                `Water is trapped up to the shorter barrier (leftMax = ${leftMax}). Total water is now ${totalWater}.`,
              invariantOrRule: `Trapped water at index ${left} = min(leftMax, rightMax) - height[left] = ${leftMax} - ${curH} = ${trapped}.`,
              variables: { left, right, curHeight: curH, leftMax, trappedHere: trapped, totalWater },
              visualState: {
                type: 'two-pointers',
                array: [...height],
                pointers: { left, right },
                highlights: { [left]: 'success', [right]: 'secondary' },
                customMessage: `💧 Trapped ${trapped} unit(s) of water at index ${left}! Total water = ${totalWater}`,
              },
            });
          }
          left++;
        } else {
          const curH = height[right];
          if (curH >= rightMax) {
            rightMax = curH;
            steps.push({
              stepNumber: steps.length + 1,
              lineNumber: 18,
              plainEnglish: `Bar at right index ${right} has height ${curH}, which is >= our current rightMax (${rightMax}). Update rightMax to ${curH}.`,
              whyThisStep:
                'This bar is a new peak on the right side. It acts as a new retaining wall holding water to its left.',
              invariantOrRule: `rightMax is now ${rightMax}. Right side is currently the shorter or equal barrier.`,
              variables: { left, right, leftMax, rightMax, totalWater },
              visualState: {
                type: 'two-pointers',
                array: [...height],
                pointers: { left, right },
                highlights: { [left]: 'primary', [right]: 'warning' },
                customMessage: `New right peak: rightMax = ${rightMax}.`,
              },
            });
          } else {
            const trapped = rightMax - curH;
            totalWater += trapped;
            steps.push({
              stepNumber: steps.length + 1,
              lineNumber: 20,
              plainEnglish: `Bar at right index ${right} is ${curH} tall, but rightMax is ${rightMax}. Water traps here! Trapped: ${rightMax} - ${curH} = +${trapped} units.`,
              whyThisStep:
                `Water is trapped up to the shorter barrier (rightMax = ${rightMax}). Total water is now ${totalWater}.`,
              invariantOrRule: `Trapped water at index ${right} = min(leftMax, rightMax) - height[right] = ${rightMax} - ${curH} = ${trapped}.`,
              variables: { left, right, curHeight: curH, rightMax, trappedHere: trapped, totalWater },
              visualState: {
                type: 'two-pointers',
                array: [...height],
                pointers: { left, right },
                highlights: { [left]: 'primary', [right]: 'success' },
                customMessage: `💧 Trapped ${trapped} unit(s) of water at index ${right}! Total water = ${totalWater}`,
              },
            });
          }
          right--;
        }
      }

      steps.push({
        stepNumber: steps.length + 1,
        lineNumber: 24,
        plainEnglish: `Both pointers met at index ${left}. All dips and peaks have been inspected. Total trapped rain water is ${totalWater} units.`,
        whyThisStep:
          'Processed the entire elevation array in a single O(N) pass using O(1) auxiliary space without extra arrays!',
        variables: { totalWater },
        visualState: {
          type: 'two-pointers',
          array: [...height],
          returnValue: totalWater,
          customMessage: `Result: ${totalWater} units of rainwater trapped!`,
        },
      });

      return steps;
    },
  },

  // 9. Median of Two Sorted Arrays (Hard)
  {
    id: 'median-of-two-sorted-arrays',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    category: 'Binary Search / Partitioning',
    companyTags: ['Google', 'Amazon', 'Microsoft', 'Apple', 'Meta', 'Uber'],
    summary: 'Find the median of two sorted arrays in logarithmic O(log(min(m, n))) time.',
    problemStatement:
      'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).',
    defaultInput: {
      nums1: [1, 3, 8],
      nums2: [7, 9, 10, 11],
    },
    inputSchema: [
      { name: 'nums1', label: 'First Sorted Array (nums1)', type: 'array', defaultValue: [1, 3, 8] },
      { name: 'nums2', label: 'Second Sorted Array (nums2)', type: 'array', defaultValue: [7, 9, 10, 11] },
    ],
    timeComplexity: 'O(log(min(m, n)))',
    spaceComplexity: 'O(1)',
    algorithmBreakdown: [
      {
        phase: '1. Binary Search on Shorter Array',
        description: 'Binary search cut i in nums1 (low = 0, high = m). This guarantees O(log(min(m, n))) performance.',
      },
      {
        phase: '2. Complementary Cut j',
        description: 'Derive j = floor((m + n + 1) / 2) - i. Together, left partitions of both arrays contain half the elements.',
      },
      {
        phase: '3. Partition Balance & Median',
        description: 'If leftA <= rightB and leftB <= rightA, the cut is perfect! If total count is odd: max(leftA, leftB). If even: average of max(left) and min(right).',
      },
    ],
    code: `var findMedianSortedArrays = function(nums1, nums2) {
  if (nums1.length > nums2.length) {
    return findMedianSortedArrays(nums2, nums1);
  }

  const m = nums1.length;
  const n = nums2.length;
  let low = 0;
  let high = m;

  while (low <= high) {
    const i = Math.floor((low + high) / 2);
    const j = Math.floor((m + n + 1) / 2) - i;

    const leftA = i === 0 ? -Infinity : nums1[i - 1];
    const rightA = i === m ? Infinity : nums1[i];

    const leftB = j === 0 ? -Infinity : nums2[j - 1];
    const rightB = j === n ? Infinity : nums2[j];

    if (leftA <= rightB && leftB <= rightA) {
      if ((m + n) % 2 === 0) {
        return (Math.max(leftA, leftB) + Math.min(rightA, rightB)) / 2;
      }
      return Math.max(leftA, leftB);
    }

    if (leftA > rightB) {
      high = i - 1;
    } else {
      low = i + 1;
    }
  }
};`,
    runTracer: (inputs) => {
      let nums1: number[] = Array.isArray(inputs.nums1) ? inputs.nums1 : [1, 3, 8];
      let nums2: number[] = Array.isArray(inputs.nums2) ? inputs.nums2 : [7, 9, 10, 11];
      const steps: ExecutionStep[] = [];

      // Step 1: Check length
      steps.push({
        stepNumber: steps.length + 1,
        lineNumber: 2,
        plainEnglish: `Check lengths: nums1 has length ${nums1.length}, nums2 has length ${nums2.length}.`,
        whyThisStep:
          'We must ensure nums1 is the shorter array so binary search runs in O(log(min(m, n))) and j never goes negative.',
        invariantOrRule: nums1.length <= nums2.length ? 'nums1 is shorter or equal. Ready to proceed.' : 'nums1 is longer. Swapping arrays.',
        variables: { len1: nums1.length, len2: nums2.length },
        visualState: {
          type: 'two-pointers',
          array: [...nums1],
          customMessage: `nums1: [${nums1.join(', ')}] | nums2: [${nums2.join(', ')}]`,
        },
      });

      if (nums1.length > nums2.length) {
        const temp = nums1;
        nums1 = nums2;
        nums2 = temp;
      }

      const m = nums1.length;
      const n = nums2.length;
      let low = 0;
      let high = m;

      steps.push({
        stepNumber: steps.length + 1,
        lineNumber: 8,
        plainEnglish: `Initialize binary search boundaries on shorter array nums1: low = 0, high = ${m}. Combined total size is ${m + n}.`,
        whyThisStep: 'We search for the exact partition line i in nums1 that balances with partition line j in nums2.',
        variables: { low, high, m, n, total: m + n },
        visualState: {
          type: 'two-pointers',
          array: [...nums1],
          pointers: { low, high },
          customMessage: `Binary search space in nums1: [${low} .. ${high}]`,
        },
      });

      while (low <= high) {
        const i = Math.floor((low + high) / 2);
        const j = Math.floor((m + n + 1) / 2) - i;

        const leftA = i === 0 ? -Infinity : nums1[i - 1];
        const rightA = i === m ? Infinity : nums1[i];

        const leftB = j === 0 ? -Infinity : nums2[j - 1];
        const rightB = j === n ? Infinity : nums2[j];

        steps.push({
          stepNumber: steps.length + 1,
          lineNumber: 13,
          plainEnglish: `Cut partition: i = ${i} in nums1, j = ${j} in nums2. Left boundary values are leftA = ${leftA}, leftB = ${leftB}. Right values are rightA = ${rightA}, rightB = ${rightB}.`,
          whyThisStep:
            'i + j = half of total items. We must check if max(leftA, leftB) <= min(rightA, rightB).',
          invariantOrRule: `Left partition contains ${i + j} elements across both arrays.`,
          variables: { i, j, leftA: leftA === -Infinity ? '-∞' : leftA, rightA: rightA === Infinity ? '+∞' : rightA, leftB: leftB === -Infinity ? '-∞' : leftB, rightB: rightB === Infinity ? '+∞' : rightB },
          visualState: {
            type: 'two-pointers',
            array: [...nums1],
            pointers: { cutA: i },
            highlights: { ...(i > 0 ? { [i - 1]: 'primary' } : {}), ...(i < m ? { [i]: 'secondary' } : {}) },
            customMessage: `nums1 cut at ${i} (left: ${leftA}, right: ${rightA}) | nums2 cut at ${j} (left: ${leftB}, right: ${rightB})`,
          },
        });

        if (leftA <= rightB && leftB <= rightA) {
          const isEven = (m + n) % 2 === 0;
          const median = isEven
            ? (Math.max(leftA, leftB) + Math.min(rightA, rightB)) / 2
            : Math.max(leftA, leftB);

          steps.push({
            stepNumber: steps.length + 1,
            lineNumber: 22,
            plainEnglish: `PERFECT PARTITION FOUND! leftA (${leftA}) <= rightB (${rightB}) and leftB (${leftB}) <= rightA (${rightA}). Total length (${m + n}) is ${isEven ? 'EVEN' : 'ODD'}. Median = ${median}.`,
            whyThisStep:
              isEven
                ? `Even total elements: average the max of left half (${Math.max(leftA, leftB)}) and min of right half (${Math.min(rightA, rightB)}).`
                : `Odd total elements: median is the maximum element in the left half: ${median}.`,
            invariantOrRule: `Valid median partition solved in O(log(min(m, n))) time!`,
            variables: { median, isEven, totalElements: m + n },
            visualState: {
              type: 'two-pointers',
              array: [...nums1],
              pointers: { medianIndex: i },
              returnValue: median,
              customMessage: `Result: Median is ${median}`,
            },
          });

          return steps;
        }

        if (leftA > rightB) {
          const oldHigh = high;
          high = i - 1;
          steps.push({
            stepNumber: steps.length + 1,
            lineNumber: 30,
            plainEnglish: `leftA (${leftA}) is greater than rightB (${rightB}). Cut i in nums1 is too far right! Shift high from ${oldHigh} to ${high}.`,
            whyThisStep:
              'We picked too many big elements from nums1. Move binary search window LEFT in nums1.',
            variables: { low, high, i },
            visualState: {
              type: 'two-pointers',
              array: [...nums1],
              pointers: { low, high },
              customMessage: `Cut i was too large. Shifting high to ${high}.`,
            },
          });
        } else {
          const oldLow = low;
          low = i + 1;
          steps.push({
            stepNumber: steps.length + 1,
            lineNumber: 32,
            plainEnglish: `leftB (${leftB}) is greater than rightA (${rightA}). Cut i in nums1 is too far left! Shift low from ${oldLow} to ${low}.`,
            whyThisStep:
              'We picked too few elements from nums1. Move binary search window RIGHT in nums1.',
            variables: { low, high, i },
            visualState: {
              type: 'two-pointers',
              array: [...nums1],
              pointers: { low, high },
              customMessage: `Cut i was too small. Shifting low to ${low}.`,
            },
          });
        }
      }

      return steps;
    },
  },
];
