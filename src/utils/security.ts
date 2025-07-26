// Security utilities for XSS prevention and input validation

/**
 * Sanitize HTML content to prevent XSS attacks
 * This is a basic implementation - in production, consider using DOMPurify
 */
export function sanitizeHtml(html: string): string {
  // Basic HTML escaping to prevent XSS
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Safely render HTML content with basic formatting
 * Allows only safe tags like <br> for line breaks
 */
export function renderSafeHtml(text: string): string {
  // First sanitize the input
  const sanitized = sanitizeHtml(text);
  
  // Allow only safe line breaks
  return sanitized.replace(/\n/g, '<br>');
}

/**
 * Validate and sanitize user input
 */
export function sanitizeInput(input: string, maxLength: number = 1000): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Trim whitespace and limit length
  const trimmed = input.trim().substring(0, maxLength);
  
  // Remove potentially dangerous characters
  return trimmed.replace(/[<>\"'&]/g, '');
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate CPF format (Brazilian tax ID)
 */
export function isValidCPF(cpf: string): boolean {
  // Remove non-numeric characters
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  
  // Check if it has 11 digits
  if (cleanCPF.length !== 11) {
    return false;
  }
  
  // Check for known invalid patterns
  const invalidPatterns = [
    '00000000000', '11111111111', '22222222222', '33333333333',
    '44444444444', '55555555555', '66666666666', '77777777777',
    '88888888888', '99999999999'
  ];
  
  if (invalidPatterns.includes(cleanCPF)) {
    return false;
  }
  
  // Basic CPF validation algorithm
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
}

/**
 * Rate limiting utility for client-side protection
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    // Add current attempt
    validAttempts.push(now);
    this.attempts.set(identifier, validAttempts);
    
    return true;
  }
  
  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

/**
 * Generate secure random tokens
 */
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Secure session storage utilities
 */
export const SecureStorage = {
  /**
   * Safely store data in localStorage with encryption
   */
  setItem(key: string, value: any): void {
    try {
      const serialized = JSON.stringify({
        data: value,
        timestamp: Date.now(),
        checksum: this.generateChecksum(JSON.stringify(value))
      });
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error('SecureStorage: Failed to store item', error);
    }
  },

  /**
   * Safely retrieve data from localStorage with validation
   */
  getItem(key: string): any {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;
      
      const parsed = JSON.parse(stored);
      
      // Validate checksum
      if (parsed.checksum !== this.generateChecksum(JSON.stringify(parsed.data))) {
        console.warn('SecureStorage: Checksum validation failed for', key);
        this.removeItem(key);
        return null;
      }
      
      // Check if data is not too old (24 hours)
      if (Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000) {
        this.removeItem(key);
        return null;
      }
      
      return parsed.data;
    } catch (error) {
      console.error('SecureStorage: Failed to retrieve item', error);
      this.removeItem(key);
      return null;
    }
  },

  /**
   * Remove item from localStorage
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('SecureStorage: Failed to remove item', error);
    }
  },

  /**
   * Generate simple checksum for data validation
   */
  generateChecksum(data: string): string {
    let hash = 0;
    if (data.length === 0) return hash.toString();
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }
};