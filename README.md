# String-Calculator-TDD-Kata.

/**
 * String Calculator TDD Kata Implementation
 *
 * This function implements the rules of the classic String Calculator Kata.
 * It is built incrementally following TDD principles.
 *
 * Supported Features:
 *  1. Empty string returns 0
 *  2. A single number returns itself
 *  3. Two numbers (comma separated) return their sum
 *  4. Any amount of numbers are supported
 *  5. Newlines can also be used as delimiters
 *  6. Custom delimiters can be specified using the format: "//[delimiter]\n"
 *  7. Negative numbers throw an exception listing all negatives
 *  8. Numbers larger than 1000 are ignored
 *  9. Delimiters of any length supported using brackets (e.g. //[***]\n)
 * 10. Multiple delimiters supported (e.g. //[*][%]\n)
 * 11. Multiple delimiters of length > 1 supported (e.g. //[**][%%]\n)
 */

function add(numbers) {
  // Case 1: Empty string → return 0
  if (!numbers) return 0;

  // Default delimiters: comma or newline
  let delimiters = [",", "\n"];
  let numString = numbers;

  // Case 2: Custom delimiter defined at the beginning
  if (numbers.startsWith("//")) {
    // Extract the delimiter section (between "//" and the first "\n")
    const delimiterSection = numbers.substring(2, numbers.indexOf("\n"));
    // Extract the actual number string (after "\n")
    numString = numbers.substring(numbers.indexOf("\n") + 1);

    // Case 3: Multiple or multi-character delimiters
    if (delimiterSection.startsWith("[")) {
      // Match everything inside [ ... ]
      const regex = /\[(.*?)\]/g;
      delimiters = [];
      let match;
      while ((match = regex.exec(delimiterSection)) !== null) {
        delimiters.push(match[1]); // e.g., "***" or "%"
      }
    } else {
      // Case 4: Single character delimiter (e.g., ";")
      delimiters = [delimiterSection];
    }
  }

  // Build a regex that matches ANY of the delimiters
  const delimiterRegex = new RegExp(
    delimiters.map(d => escapeRegex(d)).join("|"),
    "g"
  );

  // Split the numbers string using the delimiters
  const numList = numString.split(delimiterRegex).map(n => parseInt(n, 10));

  // Case 5: Handle negative numbers
  const negatives = numList.filter(n => n < 0);
  if (negatives.length > 0) {
    throw new Error(`negatives not allowed: ${negatives.join(",")}`);
  }

  // Case 6: Ignore numbers > 1000 and sum the rest
  return numList.reduce((sum, n) => sum + (isNaN(n) || n > 1000 ? 0 : n), 0);
}

/**
 * Utility function: Escape regex special characters
 * Example: "*" → "\*"
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// -----------------------------------------------------------
// Example usage (can be used as quick manual tests)
// -----------------------------------------------------------
console.log(add(""));                  // 0
console.log(add("1"));                 // 1
console.log(add("1,2"));               // 3
console.log(add("1,2,3,4,5"));         // 15
console.log(add("1\n2,3"));            // 6
console.log(add("//;\n1;2"));          // 3
console.log(add("//[***]\n1***2***3"));// 6
console.log(add("//[*][%]\n1*2%3"));   // 6
console.log(add("//[**][%%]\n1**2%%3"));// 6
console.log(add("1001,2"));            // 2
// console.log(add("1,-2,3,-5"));      // Throws "negatives not allowed: -2,-5"

module.exports = { add };
