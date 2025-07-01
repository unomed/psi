
/**
 * Assessment services index
 * Re-exports all assessment-related functions
 */

// Core assessment operations
export * from './core';

// Assessment communication (email, sharing)
export { 
  generateAssessmentLinkFromId,
  sendAssessmentEmail
} from './communication';

// Named exports from links service
export {
  generateAssessmentLink,
  updateAssessmentStatus,
  deleteAssessment,
  checkLinkValidity,
  markLinkAsUsed,
  sendAssessmentEmail as sendEmail
} from './links';

// Results management
export * from './results';
