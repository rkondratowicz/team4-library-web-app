/**
 * Copy model interface
 * This defines the structure of a Copy entity across all layers
 */
export interface Copy {
  CopyID: string;
  BookID: string;
  Status: 'Available' | 'Borrowed';
  CreatedAt: string;
  UpdatedAt: string;
}

/**
 * Input type for creating a new copy
 * Used when accepting user input for copy creation
 */
export interface CreateCopyInput {
  BookID: string;
  Status?: 'Available' | 'Borrowed'; // Default to 'Available'
}

/**
 * Input type for updating an existing copy
 * Used when accepting user input for copy updates
 */
export interface UpdateCopyInput {
  Status?: 'Available' | 'Borrowed';
}