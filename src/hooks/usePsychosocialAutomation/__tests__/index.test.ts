
import { renderHook } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePsychosocialAutomation } from '../index';
import { supabase } from '@/integrations/supabase/client';
import React from 'react';

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

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('usePsychosocialAutomation', () => {
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

  const wrapper = ({ children }: { children: React.ReactNode }) => 
    React.createElement(QueryClientProvider, { client: queryClient }, children);

  it('should fetch automation config successfully', async () => {
    const mockConfig = {
      id: '1',
      company_id: 'test-company-id',
      auto_process_enabled: true,
      auto_generate_action_plans: true,
      notification_enabled: true,
    };

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: mockConfig,
            error: null,
          }),
        }),
      }),
    });

    const { result } = renderHook(() => usePsychosocialAutomation('test-company-id'), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.config).toEqual(mockConfig);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should fetch processing logs successfully', async () => {
    const mockLogs = [
      {
        id: '1',
        assessment_response_id: 'resp-1',
        status: 'completed',
        processing_stage: 'finished',
      },
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue({
              data: mockLogs,
              error: null,
            }),
          }),
        }),
      }),
    });

    const { result } = renderHook(() => usePsychosocialAutomation('test-company-id'), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.processingLogs).toEqual(mockLogs);
    });
  });

  it('should fetch processing stats successfully', async () => {
    const mockStats = {
      total_processed: 10,
      successful_processed: 8,
      failed_processed: 2,
      critical_risk_found: 1,
    };

    (supabase.rpc as jest.Mock).mockResolvedValue({
      data: [mockStats],
      error: null,
    });

    const { result } = renderHook(() => usePsychosocialAutomation('test-company-id'), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.stats).toEqual(mockStats);
    });
  });
});
