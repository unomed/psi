
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePsychosocialRisk } from '../usePsychosocialRisk';
import { supabase } from '@/integrations/supabase/client';
import React from 'react';

// Mock Supabase
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          or: jest.fn(() => ({
            order: jest.fn(() => ({
              data: [],
              error: null
            }))
          }))
        }))
      }))
    })),
    rpc: jest.fn()
  }
}));

// Mock Auth Context
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    userCompanies: [{ companyId: 'test-company-id' }]
  })
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('usePsychosocialRisk', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch psychosocial criteria successfully', async () => {
    const mockCriteria = [
      {
        id: '1',
        category: 'organizacao_trabalho',
        factor_name: 'Test Factor',
        weight: 1.0,
        threshold_low: 30,
        threshold_medium: 60,
        threshold_high: 80,
        is_active: true
      }
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          or: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: mockCriteria,
              error: null
            })
          })
        })
      })
    });

    const { result } = renderHook(() => usePsychosocialRisk('test-company-id'), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.criteria).toEqual(mockCriteria);
    expect(result.current.error).toBeNull();
  });

  it('should calculate psychosocial risk correctly', async () => {
    const mockRpcResponse = { success: true, risk_analysis_id: 'test-id' };

    (supabase.rpc as jest.Mock).mockResolvedValue({
      data: mockRpcResponse,
      error: null
    });

    const { result } = renderHook(() => usePsychosocialRisk('test-company-id'), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await result.current.calculatePsychosocialRisk.mutateAsync({
      assessmentResponseId: 'test-assessment-id',
      companyId: 'test-company-id'
    });

    expect(supabase.rpc).toHaveBeenCalledWith('calculate_psychosocial_risk', {
      p_assessment_response_id: 'test-assessment-id',
      p_company_id: 'test-company-id'
    });
  });

  it('should handle errors gracefully', async () => {
    const mockError = new Error('Database error');

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          or: jest.fn().mockReturnValue({
            order: jest.fn().mockRejectedValue(mockError)
          })
        })
      })
    });

    const { result } = renderHook(() => usePsychosocialRisk('test-company-id'), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
  });
});
