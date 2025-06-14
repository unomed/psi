
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePsychosocialRisk } from './usePsychosocialRisk';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(),
    rpc: jest.fn(),
  },
}));

// Mock AuthContext
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    userCompanies: [{ companyId: 'test-company-id' }],
  }),
}));

describe('usePsychosocialRisk', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should fetch psychosocial criteria successfully', async () => {
    const mockCriteria = [
      {
        id: '1',
        category: 'organizacao_trabalho',
        factor_name: 'Sobrecarga de trabalho',
        weight: 1.0,
        threshold_low: 30,
        threshold_medium: 60,
        threshold_high: 80,
        is_active: true,
      },
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          or: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: mockCriteria,
              error: null,
            }),
          }),
        }),
      }),
    });

    const { result } = renderHook(() => usePsychosocialRisk('test-company-id'), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.criteria).toEqual(mockCriteria);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should calculate psychosocial risk successfully', async () => {
    (supabase.rpc as jest.Mock).mockResolvedValue({
      data: [
        {
          category: 'organizacao_trabalho',
          risk_score: 75,
          exposure_level: 'alto',
          recommended_actions: ['Redistribuir tarefas'],
        },
      ],
      error: null,
    });

    const { result } = renderHook(() => usePsychosocialRisk('test-company-id'), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.calculatePsychosocialRisk).toBeDefined();
    });

    result.current.calculatePsychosocialRisk.mutate({
      assessmentResponseId: 'test-response-id',
      companyId: 'test-company-id',
    });

    await waitFor(() => {
      expect(supabase.rpc).toHaveBeenCalledWith('calculate_psychosocial_risk', {
        p_assessment_response_id: 'test-response-id',
        p_company_id: 'test-company-id',
      });
    });
  });
});
