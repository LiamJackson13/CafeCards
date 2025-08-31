/**
 * Debug script to test reward calculation
 * I'm just leaving this here in case you wanted to see evidence of testing
 * 
 * I made a silly mistake calculating the redeemable rewards a user had and it took
 * me like 5 hours of debugging to figure it out.
 */

const calculateRewards = (totalStamps) => {
  const availableRewards = Math.floor(totalStamps / 10);
  const currentStamps = totalStamps % 10;
  return { currentStamps, availableRewards };
};

// Test cases
console.log("Testing calculateRewards function:");
console.log("Input: 9 stamps ->", calculateRewards(9));
console.log("Input: 10 stamps ->", calculateRewards(10));
console.log("Input: 19 stamps ->", calculateRewards(19));
console.log("Input: 20 stamps ->", calculateRewards(20));
console.log("Input: 29 stamps ->", calculateRewards(29));
console.log("Input: 30 stamps ->", calculateRewards(30));

console.log("Card starts with 9 stamps, 0 rewards");
console.log("Expected: totalStamps = 9");
console.log("Calculate from totalStamps=9:", calculateRewards(9));
console.log("\nAfter adding 1 stamp:");
console.log("Expected: totalStamps = 10");
console.log("Calculate from totalStamps=10:", calculateRewards(10));

console.log("\nBut if the issue is totalStamps was actually 29:");
console.log("Calculate from totalStamps=29:", calculateRewards(29));
console.log("After adding 1 stamp (totalStamps=30):");
console.log("Calculate from totalStamps=30:", calculateRewards(30));
