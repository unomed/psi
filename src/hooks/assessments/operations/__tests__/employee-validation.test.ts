
import { renderHook } from '@testing-library/react-hooks';
import { useAssessmentFormValidation } from '../useAssessmentFormValidation';

describe('Assessment Form Employee Validation', () => {
  it('should fail validation when employee is missing', () => {
    const { result } = renderHook(() => useAssessmentFormValidation());
    
    const invalidData = {
      employeeId: null,
      templateId: '456',
      scheduledDate: new Date(),
    };
    
    const isValid = result.current.validateForm(invalidData);
    
    expect(isValid).toBe(false);
    expect(result.current.formErrors).toHaveProperty('employee', true);
  });
});
