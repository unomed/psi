
import { renderHook } from '@testing-library/react-hooks';
import { useAssessmentFormValidation } from '../useAssessmentFormValidation';

describe('Assessment Form Base Validation', () => {
  it('should initialize with empty form errors', () => {
    const { result } = renderHook(() => useAssessmentFormValidation());
    expect(result.current.formErrors).toEqual({});
  });

  it('should validate form and return true when all fields are valid', () => {
    const { result } = renderHook(() => useAssessmentFormValidation());
    
    const validData = {
      employeeId: '123',
      templateId: '456',
      scheduledDate: new Date(),
    };
    
    const isValid = result.current.validateForm(validData);
    
    expect(isValid).toBe(true);
    expect(result.current.formErrors).toEqual({});
  });
});
