/**
 * Copy model interface
 * Represents a physical copy of a book in the library
 */
export interface Copy {
  CopyID: string;
  BookID: string;
  Status: CopyStatus;
  Condition: CopyCondition;
  AcquisitionDate: Date;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

/**
 * Copy validation interface
 * Defines validation state for copy objects
 */
export interface CopyValidation {
  isValid: boolean;
  errors: { [field: string]: string[] };
  warnings: { [field: string]: string[] };
}

/**
 * Copy status enumeration
 * Defines the current status of a book copy
 */
export enum CopyStatus {
  Available = 'Available',
  Borrowed = 'Borrowed',
  Damaged = 'Damaged',
  Lost = 'Lost',
  Reserved = 'Reserved'
}

/**
 * Copy condition enumeration
 * Defines the physical condition of a book copy
 */
export enum CopyCondition {
  New = 'New',
  Good = 'Good',
  Fair = 'Fair',
  Poor = 'Poor',
  Damaged = 'Damaged'
}

/**
 * Input type for creating a new copy
 * Used when accepting user input for copy creation
 */
export interface CreateCopyInput {
  CopyID?: string; // Optional, can be auto-generated
  BookID: string;
  Status?: CopyStatus; // Optional, defaults to Available
  Condition: CopyCondition;
  AcquisitionDate: Date;
}

/**
 * Input type for updating an existing copy
 * All fields are optional for partial updates
 */
export interface UpdateCopyInput {
  Status?: CopyStatus;
  Condition?: CopyCondition;
  AcquisitionDate?: Date;
}

/**
 * Copy with book information
 * Used for displaying copies with their associated book details
 */
export interface CopyWithBook extends Copy {
  Book: {
    ID: string;
    Title: string;
    Author: string;
    ISBN: string;
  };
}

/**
 * Copy statistics interface
 * Used for analytics and reporting
 */
export interface CopyStatistics {
  totalCopies: number;
  availableCopies: number;
  borrowedCopies: number;
  damagedCopies: number;
  lostCopies: number;
  reservedCopies: number;
}

/**
 * API Response types for copy operations
 */
export interface CopyResponse {
  success: boolean;
  data?: Copy;
  message?: string;
  error?: string;
}

export interface CopiesListResponse {
  success: boolean;
  data?: Copy[];
  total?: number;
  message?: string;
  error?: string;
}

export interface CopyWithBookResponse {
  success: boolean;
  data?: CopyWithBook[];
  total?: number;
  message?: string;
  error?: string;
}

/**
 * Copy query parameters for API endpoints
 */
export interface CopyQueryParams {
  bookId?: string;
  status?: CopyStatus;
  condition?: CopyCondition;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Copy status update request
 */
export interface UpdateCopyStatusInput {
  status: CopyStatus;
  reason?: string;
}

/**
 * Bulk copy operations
 */
export interface BulkCopyOperation {
  copyIds: string[];
  operation: 'update-status' | 'update-condition' | 'delete';
  data?: {
    status?: CopyStatus;
    condition?: CopyCondition;
  };
}