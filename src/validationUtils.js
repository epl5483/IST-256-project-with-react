/**
 * Validation Utilities
 * 
 * CONVERTED FROM: Functions spread across attendee.js and session.js
 * - validateField() - validated individual form fields
 * - validateForm() - looped through form and validated all inputs
 * 
 * NEW APPROACH: Extracted into reusable utility functions
 * - validateEmail() - helper for email validation
 * - validateField() - returns object {isValid, errorMessage}
 * - validateAttendeeForm() - validates entire attendee form
 * - validateSessionForm() - validates entire session form
 * 
 * Benefits:
 * - Functions are pure (no side effects)
 * - Can be tested independently
 * - Can be reused across components
 * - Easier to maintain validation rules in one place
 */

// Validate email format using regex pattern
export const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

/**
 * Validate a single form field
 * 
 * OLD CODE: validateField(form) in attendee.js/session.js
 * - Took DOM element as input
 * - Modified DOM classes (is-valid, is-invalid)
 * - Updated error element textContent
 * - Returned boolean
 * 
 * NEW CODE: validateField(fieldId, value)
 * - Takes field ID and value as input
 * - Returns {isValid: boolean, errorMessage: string}
 * - Component decides how to display errors
 * 
 * This makes it "pure" - same input always gives same output, no side effects
 */
export const validateField = (fieldId, value) => {
  let isValid = true;
  let errorMessage = "";

  // Check if field is empty (required)
  if (!value || value.trim() === '') {
    isValid = false;
    errorMessage = 'This is a required field';
    return { isValid, errorMessage };
  }

  // Field-specific validation rules
  switch (fieldId) {
    case 'fullName':
      if (value.length < 2) {
        isValid = false;
        errorMessage = 'Name must be at least 2 characters';
      }
      break;

    case 'email':
      if (!validateEmail(value)) {
        isValid = false;
        errorMessage = 'Invalid email format';
      }
      break;

    case 'contactNumber':
      // Contact number is optional, but if provided must be 10 digits
      if (value && value.length !== 10) {
        isValid = false;
        errorMessage = 'Number must be 10 digits';
      }
      break;

    case 'sessionID':
      if (value.length < 4) {
        isValid = false;
        errorMessage = 'Session ID must be at least 4 characters';
      }
      break;

    case 'sessionTitle':
      if (value.length < 4) {
        isValid = false;
        errorMessage = 'Title must be at least 4 characters';
      }
      break;

    case 'workshop':
      if (value.length < 4) {
        isValid = false;
        errorMessage = 'Workshop must be at least 4 characters';
      }
      break;

    case 'duration':
      if (value.length < 1) {
        isValid = false;
        errorMessage = 'Duration must be at least 1 character';
      }
      break;

    case 'registrationFee':
      if (value.length < 2) {
        isValid = false;
        errorMessage = 'Registration Fee must be at least 2 characters';
      }
      break;

    case 'speaker':
      if (value.length < 4) {
        isValid = false;
        errorMessage = 'Speaker must be at least 4 characters';
      }
      break;

    default:
      break;
  }

  // Return validation result as object (better than boolean for debugging)
  return { isValid, errorMessage };
};

/**
 * Validate entire attendee form
 * 
 * OLD CODE: validateForm() in attendee.js used querySelectorAll on DOM
 * NEW CODE: Takes form data object and returns validation results
 * 
 * Returns: {isValid: boolean, errors: {fieldName: errMessage}}
 * Components use this to display errors next to each field
 */
export const validateAttendeeForm = (data) => {
  const errors = {};
  let isValid = true;

  // Validate required fields
  const requiredFields = ['fullName', 'email', 'gradeLevel', 'institution'];
  
  requiredFields.forEach(field => {
    const { isValid: fieldValid, errorMessage } = validateField(field, data[field]);
    if (!fieldValid) {
      errors[field] = errorMessage;
      isValid = false;
    }
  });

  // Validate optional contact number (only if provided)
  if (data.contactNumber) {
    const { isValid: fieldValid, errorMessage } = validateField('contactNumber', data.contactNumber);
    if (!fieldValid) {
      errors.contactNumber = errorMessage;
      isValid = false;
    }
  }

  return { isValid, errors };
};

/**
 * Validate entire session form
 * 
 * Similar to validateAttendeeForm but for session creation
 * All session fields are required
 */
export const validateSessionForm = (data) => {
  const errors = {};
  let isValid = true;

  // All session fields are required
  const requiredFields = ['sessionID', 'sessionTitle', 'workshop', 'duration', 'registrationFee', 'speaker'];
  
  requiredFields.forEach(field => {
    const { isValid: fieldValid, errorMessage } = validateField(field, data[field]);
    if (!fieldValid) {
      errors[field] = errorMessage;
      isValid = false;
    }
  });

  return { isValid, errors };
};
