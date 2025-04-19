
import { renderHook } from '@testing-library/react';
import { useAssessmentFormValidation } from '../useAssessmentFormValidation';

describe('useAssessmentFormValidation', () => {
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

