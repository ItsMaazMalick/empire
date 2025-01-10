module.exports = {
  extends: ["next/core-web-vitals", "next/typescript"],
  rules: {
    "@typescript-eslint/no-unused-vars": "off", // Disable the unused-vars rule
    "@typescript-eslint/no-explicit-any": "off", // Disable the no-explicit-any rule
  },
};
