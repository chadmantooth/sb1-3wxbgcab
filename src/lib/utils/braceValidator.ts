interface ValidationResult {
  isValid: boolean;
  error?: {
    line: number;
    position: number;
    message: string;
  };
}

/**
 * Validates matching curly braces in a code string
 * @param code The code string to validate
 * @returns ValidationResult indicating if braces are balanced and any error details
 */
export function validateBraces(code: string): ValidationResult {
  if (!code || typeof code !== 'string') {
    return {
      isValid: false,
      error: {
        line: 0,
        position: 0,
        message: 'Invalid input: code must be a non-empty string'
      }
    };
  }

  const stack: Array<{ char: string; line: number; position: number }> = [];
  const lines = code.split('\n');
  let inString = false;
  let inComment = false;
  let stringChar = '';

  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const line = lines[lineNum];
    
    for (let pos = 0; pos < line.length; pos++) {
      const char = line[pos];
      const prevChar = pos > 0 ? line[pos - 1] : '';

      // Handle string literals
      if ((char === '"' || char === "'") && !inComment && prevChar !== '\\') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
        }
        continue;
      }

      // Handle single-line comments
      if (char === '/' && line[pos + 1] === '/' && !inString && !inComment) {
        break; // Skip rest of the line
      }

      // Handle multi-line comments
      if (char === '/' && line[pos + 1] === '*' && !inString && !inComment) {
        inComment = true;
        pos++; // Skip next character
        continue;
      }
      if (char === '*' && line[pos + 1] === '/' && inComment) {
        inComment = false;
        pos++; // Skip next character
        continue;
      }

      // Skip if we're in a string or comment
      if (inString || inComment) continue;

      // Handle braces
      if (char === '{') {
        stack.push({ char, line: lineNum + 1, position: pos + 1 });
      } else if (char === '}') {
        if (stack.length === 0) {
          return {
            isValid: false,
            error: {
              line: lineNum + 1,
              position: pos + 1,
              message: 'Unexpected closing brace'
            }
          };
        }
        stack.pop();
      }
    }
  }

  if (stack.length > 0) {
    const lastBrace = stack[stack.length - 1];
    return {
      isValid: false,
      error: {
        line: lastBrace.line,
        position: lastBrace.position,
        message: 'Unclosed brace'
      }
    };
  }

  return { isValid: true };
}

/**
 * Helper function to get line and column information for a position in code
 * @param code The code string
 * @param position The character position in the code
 * @returns Object containing line and column numbers
 */
export function getLineAndColumn(code: string, position: number): { line: number; column: number } {
  const lines = code.substring(0, position).split('\n');
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1
  };
}