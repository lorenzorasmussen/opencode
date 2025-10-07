export default () => ({
  name: "env-protection",
  description: "Prevent exposure of environment secrets",
  hooks: {
    beforeWrite: (path: string, content: string) => {
      // Scan for potential secrets
      const secretPatterns = [
        /api[_-]?key[_-]?=.*/i,
        /secret[_-]?=.*/i,
        /password[_-]?=.*/i,
        /token[_-]?=.*/i,
        /[a-zA-Z0-9]{32,}/  // Long random strings
      ];
      
      for (const pattern of secretPatterns) {
        if (pattern.test(content)) {
          throw new Error(`Potential secret detected in ${path}. Use environment variables instead.`);
        }
      }
    }
  }
});