
import { renderHook } from '@testing-library/react-hooks';
import { useAssessmentFormValidation } from '../useAssessmentFormValidation';

describe('Assessment Form Date Validation', () => {
  it('should fail validation when date is missing', () => {
    const { result } = renderHook(() => useAssessmentFormValidation());
    
    const invalidData = {
      employeeId: '123',
      templateId: '456',
      scheduledDate: undefined,
    };
    
    const isValid = result.current.validateForm(invalidData);
    
    expect(isValid).toBe(false);
    expect(result.current.formErrors).toHaveProperty('date', true);
  });

  it('should fail validation when all fields are missing', () => {
    const { result } = renderHook(() => useAssessmentFormValidation());
    
    const invalidData = {
      employeeId: null,
      templateId: null,
      scheduledDate: undefined,
    };
    
    const isValid = result.current.validateForm(invalidData);
    
    expect(isValid).toBe(false);
    expect(result.current.formErrors).toEqual({
      employee: true,
      template: true,
      date: true,
    });
  });
});
