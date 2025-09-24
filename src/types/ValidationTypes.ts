/**
 * Validation types and constraints for book and copy models
 * This file defines validation rules, constraints, and error types
 */

/**
 * Book validation constraints
 */
export const BOOK_CONSTRAINTS = {
  ID: {
    minLength: 1,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9-_]+$/
  },
  Title: {
    minLength: 1,
    maxLength: 255,
    required: true
  },
  Author: {
    minLength: 1,
    maxLength: 255,
    required: true
  },
  ISBN: {
    minLength: 10,
    maxLength: 17,
    pattern: /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/,
    required: true
  },
  Genre: {
    minLength: 1,
    maxLength: 100,
    required: true
  },
  PublicationYear: {
    min: 1000,
    max: new Date().getFullYear() + 1,
    required: true
  },
  Description: {
    minLength: 0,
    maxLength: 2000
  }
} as const;

/**
 * Copy validation constraints
 */
export const COPY_CONSTRAINTS = {
  CopyID: {
    minLength: 1,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9-_]+$/
  },
  BookID: {
    minLength: 1,
    maxLength: 50,
    required: true
  },
  Status: {
    allowedValues: ['Available', 'Borrowed', 'Damaged', 'Lost', 'Reserved'],
    required: true
  },
  Condition: {
    allowedValues: ['New', 'Good', 'Fair', 'Poor', 'Damaged'],
    required: true
  },
  AcquisitionDate: {
    min: new Date('1800-01-01'),
    max: new Date(),
    required: true
  }
} as const;

/**
 * Validation error types
 */
export interface ValidationError {
  field: string;
  message: string;
  code: ValidationErrorCode;
  value?: any;
}

export enum ValidationErrorCode {
  REQUIRED = 'REQUIRED',
  MIN_LENGTH = 'MIN_LENGTH',
  MAX_LENGTH = 'MAX_LENGTH',
  INVALID_PATTERN = 'INVALID_PATTERN',
  INVALID_VALUE = 'INVALID_VALUE',
  MIN_VALUE = 'MIN_VALUE',
  MAX_VALUE = 'MAX_VALUE',
  DUPLICATE_VALUE = 'DUPLICATE_VALUE',
  INVALID_DATE = 'INVALID_DATE',
  INVALID_ENUM = 'INVALID_ENUM'
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Book validation rules interface
 */
export interface BookValidationRules {
  validateRequired?: boolean;
  validateLength?: boolean;
  validatePattern?: boolean;
  validateISBN?: boolean;
  validatePublicationYear?: boolean;
  checkDuplicateISBN?: boolean;
  customRules?: ((book: any) => ValidationError[])[];
}

/**
 * Copy validation rules interface
 */
export interface CopyValidationRules {
  validateRequired?: boolean;
  validateLength?: boolean;
  validatePattern?: boolean;
  validateEnums?: boolean;
  validateDates?: boolean;
  validateBookExists?: boolean;
  customRules?: ((copy: any) => ValidationError[])[];
}

/**
 * Business rule validation
 */
export interface BusinessRuleValidation {
  name: string;
  description: string;
  validate: (data: any, context?: any) => ValidationResult;
}

/**
 * Common validation patterns
 */
export const VALIDATION_PATTERNS = {
  ID: /^[a-zA-Z0-9-_]+$/,
  ISBN_10: /^(?:[0-9]{9}X|[0-9]{10})$/,
  ISBN_13: /^(?:97[89])[0-9]{10}$/,
  YEAR: /^[12][0-9]{3}$/,
  NAME: /^[a-zA-Z\s\-'.]+$/,
  ALPHANUMERIC: /^[a-zA-Z0-9\s]+$/
} as const;

/**
 * Field-specific validation functions
 */
export interface FieldValidators {
  validateISBN: (isbn: string) => ValidationResult;
  validatePublicationYear: (year: number) => ValidationResult;
  validateBookID: (id: string) => ValidationResult;
  validateCopyID: (id: string) => ValidationResult;
  validateStatus: (status: string) => ValidationResult;
  validateCondition: (condition: string) => ValidationResult;
}

/**
 * Sanitization options
 */
export interface SanitizationOptions {
  trimStrings?: boolean;
  normalizeISBN?: boolean;
  capitalizeNames?: boolean;
  removeExtraSpaces?: boolean;
}

/**
 * Data transformation types
 */
export interface DataTransformation<T> {
  sanitize: (data: T, options?: SanitizationOptions) => T;
  validate: (data: T, rules?: any) => ValidationResult;
  normalize: (data: T) => T;
}