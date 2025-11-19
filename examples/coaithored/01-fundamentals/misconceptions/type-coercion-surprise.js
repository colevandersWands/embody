// Misconception: "String + Number should give error"
// Reality: JavaScript does automatic type coercion

console.log('=== Type Coercion Surprises ===');

// Students expect these to fail or behave predictably
const a = '3';
const b = 4;
const c = 2;

console.log('a =', a, '(type:', typeof a, ')');
console.log('b =', b, '(type:', typeof b, ')');
console.log('c =', c, '(type:', typeof c, ')');

// Surprising results for beginners:
const result1 = a + b;        // '3' + 4 = '34' (string concatenation!)
const result2 = a - b;        // '3' - 4 = -1 (string to number conversion!)
const result3 = a + b + c;    // '3' + 4 + 2 = '342' (left to right)
const result4 = b + c + a;    // 4 + 2 + '3' = '63' (numbers first, then string)

console.log('a + b =', result1, '(type:', typeof result1, ')');
console.log('a - b =', result2, '(type:', typeof result2, ')');
console.log('a + b + c =', result3, '(type:', typeof result3, ')');
console.log('b + c + a =', result4, '(type:', typeof result4, ')');

// More surprising comparisons
console.log('== comparisons:');
console.log('a == b:', a == b);        // '3' == 4 → false
console.log('a == 3:', a == 3);        // '3' == 3 → true (coercion!)
console.log('a === 3:', a === 3);      // '3' === 3 → false (strict)

// Educational Analysis:
// - + operator: string present = concatenation
// - Other operators: convert strings to numbers
// - Order matters in mixed expressions
// - == allows coercion, === prevents it
// This is fundamental JavaScript behavior, not a bug!