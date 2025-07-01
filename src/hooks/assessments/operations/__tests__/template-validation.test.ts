
import { renderHook } from '@testing-library/react-hooks';
import { useAssessmentFormValidation } from '../useAssessmentFormValidation';

describe('Assessment Form Template Validation', () => {
  it('should fail validation when template is missing', () => {
    const { result } = renderHook(() => useAssessmentFormValidation());
    
    const invalidData = {
      employeeId: '123',
      templateId: null,
      scheduledDate: new Date(),
    };
    
    const isValid = result.current.validateForm(invalidData);
    
    expect(isValid).toBe(false);
    expect(result.current.formErrors).toHaveProperty('template', true);
  });
});
