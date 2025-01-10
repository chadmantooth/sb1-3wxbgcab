import { validateBraces } from '../braceValidator';

describe('validateBraces', () => {
  test('should validate empty string', () => {
    const result = validateBraces('');
    expect(result.isValid).toBe(false);
    expect(result.error?.message).toBe('Invalid input: code must be a non-empty string');
  });

  test('should validate matching braces', () => {
    const code = `
      function test() {
        if (true) {
          console.log('test');
        }
      }
    `;
    const result = validateBraces(code);
    expect(result.isValid).toBe(true);
  });

  test('should ignore braces in strings', () => {
    const code = `
      const str = "{ not a brace }";
      function test() {
        console.log(str);
      }
    `;
    const result = validateBraces(code);
    expect(result.isValid).toBe(true);
  });

  test('should ignore braces in comments', () => {
    const code = `
      // { this is a comment }
      function test() {
        /* {
           multiline comment
           } */
        console.log('test');
      }
    `;
    const result = validateBraces(code);
    expect(result.isValid).toBe(true);
  });

  test('should detect unclosed brace', () => {
    const code = `
      function test() {
        if (true) {
          console.log('test');
        
      }
    `;
    const result = validateBraces(code);
    expect(result.isValid).toBe(false);
    expect(result.error?.message).toBe('Unclosed brace');
  });

  test('should detect unexpected closing brace', () => {
    const code = `
      function test() {
        if (true) {
          console.log('test');
        }}
      }
    `;
    const result = validateBraces(code);
    expect(result.isValid).toBe(false);
    expect(result.error?.message).toBe('Unexpected closing brace');
  });
});