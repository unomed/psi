
/**
 * Assessment services index
 * Re-exports all assessment-related functions
 */

// Core assessment operations
export * from './core';

// Assessment communication (email, sharing)
export { 
  generateAssessmentLink,
  updateAssessmentStatus,
  deleteAssessment
} from './communication';

// Named exports from links service
export * from './links';

// Results management
export * from './results';
