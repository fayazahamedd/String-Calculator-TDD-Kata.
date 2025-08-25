function add(numbers) {
  if (!numbers) return 0;

  let delimiters = [",", "\n"]; // Default delimiters
  let numString = numbers;

  // Check for custom delimiters
  if (numbers.startsWith("//")) {
    const delimiterSection = numbers.substring(2, numbers.indexOf("\n"));
    numString = numbers.substring(numbers.indexOf("\n") + 1);

    // Multiple delimiters or multi-char delimiters
    if (delimiterSection.startsWith("[")) {
      // Match all [delim] parts
      const regex = /\[(.*?)\]/g;
      delimiters = [];
      let match;
      while ((match = regex.exec(delimiterSection)) !== null) {
        delimiters.push(match[1]);
      }
    } else {
      delimiters = [delimiterSection];
    }
  }

  // Build regex for splitting by multiple delimiters
  const delimiterRegex = new RegExp(delimiters.map(d => escapeRegex(d)).join("|"), "g");

  // Split numbers
  const numList = numString.split(delimiterRegex).map(n => parseInt(n, 10));

  // Handle negatives
  const negatives = numList.filter(n => n < 0);
  if (negatives.length > 0) {
    throw new Error(`negatives not allowed: ${negatives.join(",")}`);
  }

  // Ignore numbers > 1000 and sum
  return numList.reduce((sum, n) => sum + (isNaN(n) || n > 1000 ? 0 : n), 0);
}

// Utility: escape regex special chars
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// --- Example Usage ---
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
// console.log(add("1,-2,3,-5"));      // throws "negatives not allowed: -2,-5"
