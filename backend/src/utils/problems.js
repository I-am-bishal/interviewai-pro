/**
 * Static problem bank
 * Production: move to MongoDB with admin CRUD panel
 */
const PROBLEMS = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'easy',
    tags: ['array', 'hash-map'],
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target. Each input has exactly one solution.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Only one valid answer exists.'],
    starterCode: {
      javascript: 'function twoSum(nums, target) {\n  // Your solution\n}',
      python: 'def two_sum(nums, target):\n    # Your solution\n    pass',
      java: 'public int[] twoSum(int[] nums, int target) {\n    // Your solution\n}',
      cpp: 'vector<int> twoSum(vector<int>& nums, int target) {\n    // Your solution\n}',
    },
    testCases: [
      { input: '[2,7,11,15], 9', expectedOutput: '[0,1]' },
      { input: '[3,2,4], 6', expectedOutput: '[1,2]' },
      { input: '[3,3], 6', expectedOutput: '[0,1]' },
    ],
    hints: ['Try using a hash map to store visited numbers', 'For each number, check if its complement exists in the map'],
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'easy',
    tags: ['stack', 'string'],
    description: 'Given a string containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.',
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only'],
    starterCode: {
      javascript: 'function isValid(s) {\n  // Your solution\n}',
      python: 'def is_valid(s: str) -> bool:\n    pass',
      java: 'public boolean isValid(String s) {\n    // Your solution\n}',
      cpp: 'bool isValid(string s) {\n    // Your solution\n}',
    },
    testCases: [
      { input: '"()"', expectedOutput: 'true' },
      { input: '"()[]{}"', expectedOutput: 'true' },
      { input: '"(]"', expectedOutput: 'false' },
    ],
    hints: ['A stack is perfect for this problem', 'Push opening brackets, pop and compare for closing brackets'],
  },
  {
    id: 'longest-substring',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'medium',
    tags: ['sliding-window', 'hash-map', 'string'],
    description: 'Given a string `s`, find the length of the longest substring without repeating characters.',
    examples: [
      { input: 's = "abcabcbb"', output: '3 (abc)' },
      { input: 's = "bbbbb"', output: '1 (b)' },
    ],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces'],
    starterCode: {
      javascript: 'function lengthOfLongestSubstring(s) {\n  // Sliding window approach\n}',
      python: 'def length_of_longest_substring(s: str) -> int:\n    pass',
      java: 'public int lengthOfLongestSubstring(String s) {\n    // Your solution\n}',
      cpp: 'int lengthOfLongestSubstring(string s) {\n    // Your solution\n}',
    },
    testCases: [
      { input: '"abcabcbb"', expectedOutput: '3' },
      { input: '"bbbbb"', expectedOutput: '1' },
      { input: '"pwwkew"', expectedOutput: '3' },
    ],
    hints: ['Use a sliding window with two pointers', 'Track the last seen index of each character'],
  },
  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'medium',
    tags: ['array', 'sorting', 'intervals'],
    description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals and return an array of the non-overlapping intervals.',
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' },
    ],
    constraints: ['1 <= intervals.length <= 10^4'],
    starterCode: {
      javascript: 'function merge(intervals) {\n  // Sort and merge\n}',
      python: 'def merge(intervals):\n    pass',
      java: 'public int[][] merge(int[][] intervals) {\n    // Your solution\n}',
      cpp: 'vector<vector<int>> merge(vector<vector<int>>& intervals) {\n    // Your solution\n}',
    },
    testCases: [
      { input: '[[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]' },
      { input: '[[1,4],[4,5]]', expectedOutput: '[[1,5]]' },
    ],
    hints: ['Sort intervals by start time first', 'Compare end of current with start of next'],
  },
  {
    id: 'lru-cache',
    title: 'LRU Cache',
    difficulty: 'hard',
    tags: ['design', 'hash-map', 'doubly-linked-list'],
    description: 'Design a data structure that follows the Least Recently Used (LRU) cache constraint. Implement `get` and `put` with O(1) time complexity.',
    examples: [
      { input: 'LRUCache(2), put(1,1), put(2,2), get(1)=1, put(3,3), get(2)=-1', output: '-1 (evicted)' },
    ],
    constraints: ['1 <= capacity <= 3000', '0 <= key <= 10^4', 'At most 2 * 10^5 calls to get and put'],
    starterCode: {
      javascript: 'class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    // Use Map to maintain insertion order\n  }\n\n  get(key) {}\n\n  put(key, value) {}\n}',
      python: 'class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n\n    def get(self, key: int) -> int:\n        pass\n\n    def put(self, key: int, value: int) -> None:\n        pass',
      java: 'class LRUCache {\n    public LRUCache(int capacity) {}\n    public int get(int key) { return -1; }\n    public void put(int key, int value) {}\n}',
      cpp: 'class LRUCache {\npublic:\n    LRUCache(int capacity) {}\n    int get(int key) { return -1; }\n    void put(int key, int value) {}\n};',
    },
    testCases: [
      { input: 'capacity=2, ops=[[put,1,1],[put,2,2],[get,1],[put,3,3],[get,2],[get,3]]', expectedOutput: '[null,null,1,null,-1,3]' },
    ],
    hints: ['Combine HashMap with a Doubly Linked List', 'HashMap gives O(1) access, DLL gives O(1) move-to-front'],
  },
];

module.exports = PROBLEMS;
