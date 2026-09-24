export interface BugQuestion {
  id: string;
  stage: number;
  language: 'Python' | 'JavaScript';
  code: readonly string[];
  buggyLine: number;
  fix?: { options: readonly [string, string, string]; correct: 0 | 1 | 2 };
  expectedOutput?: string;
}

export const BUG_HUNT_ROUNDS = 10;

// Two runnable, single-bug variants per stage. Stages advance from basic state
// updates to boundary conditions and algorithm invariants.
export const BUG_QUESTIONS: readonly BugQuestion[] = [
  {
    id: 'sum',
    stage: 1,
    language: 'Python',
    code: [
      'numbers = [2, 3, 5]',
      'total = 0',
      'for number in numbers:',
      '    total = number',
      'print(total)',
    ],
    buggyLine: 4,
  },
  {
    id: 'count',
    stage: 1,
    language: 'Python',
    code: [
      'words = ["sun", "sea", "sky"]',
      'count = 0',
      'for word in words:',
      '    if word.startswith("s"): count -= 1',
      'print(count)',
    ],
    buggyLine: 4,
  },
  {
    id: 'even',
    stage: 2,
    language: 'JavaScript',
    code: [
      'const numbers = [1, 2, 3, 4];',
      'const evens = numbers.filter(n => n % 2 === 1);',
      'console.log(evens);',
    ],
    buggyLine: 2,
    fix: {
      options: [
        'const evens = numbers.filter(n => n % 2 === 0);',
        'const evens = numbers.filter(n => n % 2 !== 0);',
        'const evens = numbers.filter(n => n % 2 === 2);',
      ],
      correct: 0,
    },
  },
  {
    id: 'positive',
    stage: 2,
    language: 'Python',
    code: [
      'values = [-2, 0, 3, 5]',
      'positives = []',
      'for value in values:',
      '    if value >= 0: positives.append(value)',
      'print(positives)',
    ],
    buggyLine: 4,
    fix: {
      options: [
        '    if value != 0: positives.append(value)',
        '    if value >= -2: positives.append(value)',
        '    if value > 0: positives.append(value)',
      ],
      correct: 2,
    },
  },
  {
    id: 'range',
    stage: 3,
    language: 'Python',
    code: [
      'start = 2',
      'stop = 11',
      'step = 3',
      'numbers = []',
      'for number in range(start, stop, step):',
      '    numbers.append(number)',
      'print(numbers)',
    ],
    buggyLine: 5,
    fix: {
      options: [
        'for number in range(start, stop + 1, step):',
        'for number in range(start, stop, step + 1):',
        'for number in range(start + 1, stop + 1, step):',
      ],
      correct: 0,
    },
  },
  {
    id: 'slice',
    stage: 3,
    language: 'JavaScript',
    code: [
      'const numbers = [10, 20, 30, 40, 50];',
      'const start = 1;',
      'const count = 3;',
      'const selected = numbers.slice(start, count);',
      'console.log(selected);',
    ],
    buggyLine: 4,
    fix: {
      options: [
        'const selected = numbers.slice(start, start + count - 1);',
        'const selected = numbers.slice(start, start + count);',
        'const selected = numbers.slice(start + 1, start + count);',
      ],
      correct: 1,
    },
  },
  {
    id: 'maximum',
    stage: 4,
    language: 'Python',
    code: [
      'values = [4, 9, 2, 9, 7]',
      'maximum = values[0]',
      'first_index = 0',
      'for index, value in enumerate(values):',
      '    if value >= maximum:',
      '        maximum = value',
      '        first_index = index',
      'print(first_index)',
    ],
    buggyLine: 5,
    fix: {
      options: ['    if value > maximum:', '    if value < maximum:', '    if value == maximum:'],
      correct: 0,
    },
  },
  {
    id: 'search',
    stage: 4,
    language: 'JavaScript',
    code: [
      'const items = ["x", "a", "b", "a", "c"];',
      'let foundAt = -1;',
      'for (let index = 0; index < items.length; index++) {',
      '  if (items[index] === "a") foundAt = index;',
      '}',
      'console.log(foundAt);',
    ],
    buggyLine: 4,
    fix: {
      options: [
        '  if (items[index] === "a" && foundAt !== -1) foundAt = index;',
        '  if (items[index] === "a" && foundAt === -1) foundAt = index;',
        '  if (items[index] === "a" || foundAt === -1) foundAt = index;',
      ],
      correct: 1,
    },
  },
  {
    id: 'average',
    stage: 5,
    language: 'JavaScript',
    code: [
      'const marks = [',
      '  { score: 4, weight: 1 },',
      '  { score: 8, weight: 2 },',
      '  { score: 10, weight: 1 },',
      '];',
      'const weightedSum = marks.reduce((sum, mark) => sum + mark.score * mark.weight, 0);',
      'const totalWeight = marks.reduce((sum, mark) => sum + mark.weight, 0);',
      'const average = weightedSum / marks.length;',
      'console.log(average);',
    ],
    buggyLine: 8,
    fix: {
      options: [
        'const average = weightedSum / (totalWeight + 1);',
        'const average = weightedSum / totalWeight;',
        'const average = weightedSum / (marks.length - 1);',
      ],
      correct: 1,
    },
  },
  {
    id: 'factorial',
    stage: 5,
    language: 'Python',
    code: [
      'numbers = [3, 4, 5]',
      'results = []',
      'for number in numbers:',
      '    factorial = 1',
      '    for value in range(2, number + 1):',
      '        factorial *= number',
      '    results.append(factorial)',
      'print(results)',
    ],
    buggyLine: 6,
    fix: {
      options: [
        '        factorial *= value',
        '        factorial += value',
        '        factorial *= number - 1',
      ],
      correct: 0,
    },
  },
  {
    id: 'contains',
    stage: 6,
    language: 'JavaScript',
    code: [
      'const names = ["Ali", "Vali", "Salim"];',
      'const targets = ["Zarina", "Vali", "ali"];',
      'const found = targets.map(target =>',
      '  names.some(name => name.toLowerCase() !== target.toLowerCase())',
      ');',
      'console.log(found);',
    ],
    buggyLine: 4,
    fix: {
      options: [
        '  names.every(name => name.toLowerCase() === target.toLowerCase())',
        '  names.some(name => name.toLowerCase() === target.toLowerCase())',
        '  names.some(name => name === target)',
      ],
      correct: 1,
    },
    expectedOutput: '[false, true, true]',
  },
  {
    id: 'any_all',
    stage: 6,
    language: 'JavaScript',
    code: [
      'const classes = [[72, 45, 88], [63, 54], [31, 41, 20]];',
      'const needsHelp = classes.map(scores =>',
      '  scores.every(score => score < 50)',
      ');',
      'console.log(needsHelp);',
    ],
    buggyLine: 3,
    fix: {
      options: [
        '  scores.some(score => score > 50)',
        '  scores.some(score => score < 40)',
        '  scores.some(score => score < 50)',
      ],
      correct: 2,
    },
    expectedOutput: '[true, false, true]',
  },
  {
    id: 'reverse',
    stage: 7,
    language: 'Python',
    code: [
      'values = ["a", "b", "c", "d", "e", "f"]',
      'left = 0',
      'right = len(values) - 1',
      'while left < right:',
      '    values[left], values[right] = values[right], values[left]',
      '    left += 1',
      '    right -= 2',
      'print(values)',
    ],
    buggyLine: 7,
    fix: {
      options: ['    right -= 3', '    right -= 1', '    right = left'],
      correct: 1,
    },
    expectedOutput: "['f', 'e', 'd', 'c', 'b', 'a']",
  },
  {
    id: 'palindrome',
    stage: 7,
    language: 'Python',
    code: [
      'words = ["level", "abca", "noon", "radar"]',
      'results = []',
      'for word in words:',
      '    matches = True',
      '    for index in range(len(word) // 2):',
      '        if word[index] != word[-index]:',
      '            matches = False',
      '    results.append(matches)',
      'print(results)',
    ],
    buggyLine: 6,
    fix: {
      options: [
        '        if word[index] != word[-index - 1]:',
        '        if word[index] != word[-index - 2]:',
        '        if word[index] != word[index + 1]:',
      ],
      correct: 0,
    },
    expectedOutput: '[True, False, True, True]',
  },
  {
    id: 'sort',
    stage: 8,
    language: 'JavaScript',
    code: [
      'const jobs = [',
      '  { id: "A", priority: 2, time: 12 },',
      '  { id: "B", priority: 1, time: 8 },',
      '  { id: "C", priority: 2, time: 5 },',
      '  { id: "D", priority: 1, time: 3 },',
      '  { id: "E", priority: 2, time: 5 },',
      '];',
      'jobs.sort((a, b) => a.priority - b.priority || b.time - a.time || a.id.localeCompare(b.id));',
      'console.log(jobs.map(job => job.id));',
    ],
    buggyLine: 8,
    fix: {
      options: [
        'jobs.sort((a, b) => a.time - b.time || a.priority - b.priority || a.id.localeCompare(b.id));',
        'jobs.sort((a, b) => a.priority - b.priority || a.time - b.time || b.id.localeCompare(a.id));',
        'jobs.sort((a, b) => a.priority - b.priority || a.time - b.time || a.id.localeCompare(b.id));',
      ],
      correct: 2,
    },
    expectedOutput: '["D", "B", "C", "E", "A"]',
  },
  {
    id: 'prefix',
    stage: 8,
    language: 'Python',
    code: [
      'numbers = [4, -1, 7, 2, -3, 5]',
      'prefix = [0]',
      'for value in numbers:',
      '    prefix.append(prefix[-1] + value)',
      'queries = [(0, 3), (1, 5), (2, 6)]',
      'answers = []',
      'for left, right in queries:',
      '    answers.append(prefix[right] - prefix[left + 1])',
      'print(answers)',
    ],
    buggyLine: 8,
    fix: {
      options: [
        '    answers.append(prefix[right] - prefix[left])',
        '    answers.append(prefix[right - 1] - prefix[left])',
        '    answers.append(prefix[right] - prefix[left] + numbers[left])',
      ],
      correct: 0,
    },
    expectedOutput: '[10, 5, 11]',
  },
  {
    id: 'unique',
    stage: 9,
    language: 'Python',
    code: [
      'names = [" Ada ", "ada", "BOB", " bob ", "Eve", "ADA"]',
      'seen = set()',
      'unique = []',
      'for name in names:',
      '    key = name.strip().lower()',
      '    if key not in seen:',
      '        unique.append(name.strip())',
      '        seen.add(name)',
      'print(unique)',
    ],
    buggyLine: 8,
    fix: {
      options: [
        '        seen.add(name[0])',
        '        seen.add(key)',
        '        seen.add(str(len(name)))',
      ],
      correct: 1,
    },
    expectedOutput: "['Ada', 'BOB', 'Eve']",
  },
  {
    id: 'frequency',
    stage: 9,
    language: 'JavaScript',
    code: [
      'const orders = [',
      '  { city: " Tashkent ", status: "paid" },',
      '  { city: "tashkent", status: "pending" },',
      '  { city: "TASHKENT", status: "paid" },',
      '  { city: "Samarkand", status: "paid" },',
      '  { city: " samarkand ", status: "paid" },',
      '  { city: "Bukhara", status: "pending" },',
      '  { city: "tashkent", status: "paid" },',
      '];',
      'const counts = new Map();',
      'for (const order of orders) {',
      '  if (order.status !== "paid") continue;',
      '  const city = order.city.trim().toLowerCase();',
      '  counts.set(city, (counts.get(order.city) ?? 0) + 1);',
      '}',
      'console.log(Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0])));',
    ],
    buggyLine: 14,
    fix: {
      options: [
        '  counts.set(city, (counts.get(city) ?? 1) + 1);',
        '  counts.set(city, (counts.get(order.city.trim()) ?? 0) + 1);',
        '  counts.set(city, (counts.get(city) ?? 0) + 1);',
      ],
      correct: 2,
    },
    expectedOutput: '[["samarkand", 2], ["tashkent", 3]]',
  },
  {
    id: 'window',
    stage: 10,
    language: 'Python',
    code: [
      'values = [2, -4, 1, 7, 3, -2, 6, 0, 5, -1]',
      'width = 3',
      'current = sum(values[:width])',
      'best = current',
      'best_start = 0',
      'for right in range(width, len(values)):',
      '    current += values[right] - values[right - width + 1]',
      '    if current > best:',
      '        best = current',
      '        best_start = right - width + 1',
      'print([best, best_start])',
    ],
    buggyLine: 7,
    fix: {
      options: [
        '    current += values[right] - values[right - width - 1]',
        '    current += values[right] - values[right - width]',
        '    current += values[right] + values[right - width]',
      ],
      correct: 1,
    },
    expectedOutput: '[11, 2]',
  },
  {
    id: 'lower_bound',
    stage: 10,
    language: 'JavaScript',
    code: [
      'const values = [1, 3, 3, 3, 6, 8, 8, 11, 15, 19];',
      'function firstAtLeast(target) {',
      '  let left = 0, right = values.length;',
      '  while (left < right) {',
      '    const mid = Math.floor((left + right) / 2);',
      '    if (values[mid] <= target) left = mid + 1;',
      '    else right = mid;',
      '  }',
      '  return left;',
      '}',
      'console.log([firstAtLeast(7), firstAtLeast(8), firstAtLeast(20)]);',
    ],
    buggyLine: 6,
    fix: {
      options: [
        '  if (values[mid] < target) left = mid + 1;',
        '  if (values[mid] > target) left = mid + 1;',
        '  if (values[mid] >= target) left = mid + 1;',
      ],
      correct: 0,
    },
    expectedOutput: '[5, 5, 10]',
  },
];

export function bugHuntOutputMatches(answer: string, expected: string): boolean {
  const normalize = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9,.-]/g, '');
  return normalize(answer) === normalize(expected);
}

export function bugHuntQuestions(start: number): BugQuestion[] {
  const variant = ((Math.floor(start) % 2) + 2) % 2;
  return Array.from({ length: BUG_HUNT_ROUNDS }, (_, index) => {
    const stage = index + 1;
    const questions = BUG_QUESTIONS.filter((question) => question.stage === stage);
    const question = questions[(variant + index) % questions.length];
    if (!question.fix) return question;
    const shift = (((Math.floor(start / 2) + index) % 3) + 3) % 3;
    const options = question.fix.options.map(
      (_, optionIndex) => question.fix!.options[(optionIndex + shift) % 3],
    ) as [string, string, string];
    return {
      ...question,
      fix: { options, correct: ((question.fix.correct - shift + 3) % 3) as 0 | 1 | 2 },
    };
  });
}

export function bugHuntScore(correct: number): number {
  return Math.min(1000, Math.max(0, Math.floor(correct)) * 100);
}
