
import { renderHook } from '@testing-library/react-hooks';
import { useAuth } from '@/hooks/useAuth';
import { usePermissionValidation } from '../usePermissionValidation';

// Mock the auth hook
jest.mock('@/hooks/useAuth');

describe('usePermissionValidation', () => {
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@example.com' } as any,
      userRole: 'admin' as any,
      userCompanies: [],
      loading: false,
      session: { user: { id: '1', email: 'test@example.com' } as any, isAuthenticated: true },
      signIn: jest.fn(),
      signOut: jest.fn(),
      hasRole: jest.fn(),
      hasCompanyAccess: jest.fn(),
    });
  });

  it('should validate admin permissions correctly', () => {
    const { result } = renderHook(() => usePermissionValidation());
    expect(result.current.hasPermission('admin')).toBe(true);
  });

  it('should validate user permissions correctly', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@example.com' } as any,
      userRole: 'user' as any,
      userCompanies: [],
      loading: false,
      session: { user: { id: '1', email: 'test@example.com' } as any, isAuthenticated: true },
      signIn: jest.fn(),
      signOut: jest.fn(),
      hasRole: jest.fn(),
      hasCompanyAccess: jest.fn(),
    });

    const { result } = renderHook(() => usePermissionValidation());
    expect(result.current.hasPermission('user')).toBe(true);
  });
});
