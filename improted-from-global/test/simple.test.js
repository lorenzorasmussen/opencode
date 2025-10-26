import { describe, it, expect } from 'vitest';

/**
 * Simple unit tests for basic functionality
 */

// Test basic arithmetic
describe('Basic Math', () => {
  it('should add numbers correctly', () => {
    expect(2 + 2).toBe(4);
    expect(5 + 3).toBe(8);
  });

  it('should multiply numbers correctly', () => {
    expect(3 * 4).toBe(12);
    expect(7 * 6).toBe(42);
  });
});

// Test string operations
describe('String Operations', () => {
  it('should concatenate strings', () => {
    expect('Hello' + ' ' + 'World').toBe('Hello World');
  });

  it('should get string length', () => {
    expect('test'.length).toBe(4);
    expect(''.length).toBe(0);
  });

  it('should convert to uppercase', () => {
    expect('hello'.toUpperCase()).toBe('HELLO');
    expect('WORLD'.toUpperCase()).toBe('WORLD');
  });
});

// Test array operations
describe('Array Operations', () => {
  it('should create arrays', () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr[0]).toBe(1);
    expect(arr[2]).toBe(3);
  });

  it('should push to arrays', () => {
    const arr = [1, 2];
    arr.push(3);
    expect(arr).toEqual([1, 2, 3]);
  });

  it('should map arrays', () => {
    const arr = [1, 2, 3];
    const doubled = arr.map(x => x * 2);
    expect(doubled).toEqual([2, 4, 6]);
  });
});

// Test object operations
describe('Object Operations', () => {
  it('should create objects', () => {
    const obj = { name: 'test', value: 42 };
    expect(obj.name).toBe('test');
    expect(obj.value).toBe(42);
  });

  it('should add properties', () => {
    const obj = { a: 1 };
    obj.b = 2;
    expect(obj).toEqual({ a: 1, b: 2 });
  });

  it('should check property existence', () => {
    const obj = { exists: true };
    expect('exists' in obj).toBe(true);
    expect('missing' in obj).toBe(false);
  });
});

// Test utility functions
describe('Utility Functions', () => {
  const add = (a, b) => a + b;
  const isEven = (num) => num % 2 === 0;
  const capitalize = (str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  const validateEmail = (email) => {
    if (!email || typeof email !== 'string') return false;
    // Simple email validation
    return email.includes('@') && email.includes('.') && email.length > 5;
  };

  it('should add numbers', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
  });

  it('should check even numbers', () => {
    expect(isEven(2)).toBe(true);
    expect(isEven(3)).toBe(false);
    expect(isEven(0)).toBe(true);
  });

  it('should capitalize strings', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('WORLD')).toBe('World');
    expect(capitalize('')).toBe('');
    expect(capitalize(null)).toBe(null);
  });

  it('should validate emails', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('')).toBe(false);
    expect(validateEmail(null)).toBe(false);
    expect(validateEmail('@.')).toBe(false);
  });
});

// Test async operations
describe('Async Operations', () => {
  it('should resolve promises', async () => {
    const result = await Promise.resolve(42);
    expect(result).toBe(42);
  });

  it('should handle promise rejections', async () => {
    await expect(Promise.reject(new Error('test error'))).rejects.toThrow('test error');
  });

  it('should work with async/await', async () => {
    const asyncAdd = async (a, b) => {
      await new Promise(resolve => setTimeout(resolve, 1));
      return a + b;
    };

    const result = await asyncAdd(3, 4);
    expect(result).toBe(7);
  });
});

// Test error handling
describe('Error Handling', () => {
  it('should throw errors', () => {
    expect(() => {
      throw new Error('test error');
    }).toThrow('test error');
  });

  it('should catch errors', () => {
    try {
      throw new Error('caught error');
    } catch (error) {
      expect(error.message).toBe('caught error');
    }
  });
});

// Test regular expressions
describe('Regular Expressions', () => {
  it('should match patterns', () => {
    const pattern = /\d+/;
    expect(pattern.test('123')).toBe(true);
    expect(pattern.test('abc')).toBe(false);
  });

  it('should extract matches', () => {
    const match = 'hello 123 world'.match(/\d+/);
    expect(match?.[0]).toBe('123');
    expect(match).toContain('123');
  });
});

// Test date operations
describe('Date Operations', () => {
  it('should create dates', () => {
    const date = new Date('2023-01-01');
    expect(date.getFullYear()).toBe(2023);
    expect(date.getMonth()).toBe(0); // January is 0
    expect(date.getDate()).toBe(1);
  });

  it('should get current timestamp', () => {
    const before = Date.now();
    // Small delay
    const after = Date.now();
    expect(after).toBeGreaterThanOrEqual(before);
  });
});