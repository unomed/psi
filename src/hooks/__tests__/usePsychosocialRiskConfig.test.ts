
import { renderHook } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePsychosocialRiskConfig } from '../usePsychosocialRiskConfig';
import { PsychosocialRiskConfigService } from '@/services/riskManagement/psychosocialRiskConfig';
import React from 'react';

// Mock the service
jest.mock('@/services/riskManagement/psychosocialRiskConfig');

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

describe('usePsychosocialRiskConfig', () => {
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

  it('should fetch config successfully', async () => {
    const mockConfig = {
      id: '1',
      company_id: 'test-company-id',
      threshold_low: 25,
      threshold_medium: 50,
      threshold_high: 75,
      periodicidade_dias: 180,
      prazo_acao_critica_dias: 7,
      prazo_acao_alta_dias: 30,
      auto_generate_plans: true,
      notification_enabled: true,
    };

    (PsychosocialRiskConfigService.getConfig as jest.Mock).mockResolvedValue(mockConfig);

    const { result } = renderHook(() => usePsychosocialRiskConfig('test-company-id'), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.config).toEqual(mockConfig);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should update config successfully', async () => {
    const mockConfig = {
      id: '1',
      company_id: 'test-company-id',
      threshold_low: 30,
      threshold_medium: 55,
      threshold_high: 80,
      periodicidade_dias: 180,
      prazo_acao_critica_dias: 7,
      prazo_acao_alta_dias: 30,
      auto_generate_plans: true,
      notification_enabled: true,
    };

    (PsychosocialRiskConfigService.getConfig as jest.Mock).mockResolvedValue(mockConfig);
    (PsychosocialRiskConfigService.updateConfig as jest.Mock).mockResolvedValue(mockConfig);

    const { result } = renderHook(() => usePsychosocialRiskConfig('test-company-id'), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.config).toBeDefined();
    });

    result.current.updateConfig.mutate(mockConfig);

    await waitFor(() => {
      expect(PsychosocialRiskConfigService.updateConfig).toHaveBeenCalledWith(mockConfig);
    });
  });

  it('should validate config correctly', () => {
    const invalidConfig = {
      threshold_low: 80,
      threshold_medium: 50,
      threshold_high: 75,
    };

    const { result } = renderHook(() => usePsychosocialRiskConfig('test-company-id'), {
      wrapper,
    });

    const errors = result.current.validateConfig(invalidConfig);
    expect(errors).toContain('Threshold baixo deve ser menor que o médio');
  });
});
