
import { renderHook } from '@testing-library/react-hooks';
import { useAuth } from '@/hooks/useAuth';
import { usePermissionCheck } from '../usePermissionCheck';

// Mock the auth hook
jest.mock('@/hooks/useAuth');

describe('usePermissionCheck', () => {
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@example.com' } as any,
      userRole: 'admin' as any,
      userCompanies: [],
      isLoading: false,
      signIn: jest.fn(),
      signOut: jest.fn(),
    });
  });

  it('should return true for admin role', () => {
    const { result } = renderHook(() => usePermissionCheck());
    expect(result.current.hasPermission('admin')).toBe(true);
  });

  it('should return false for unauthorized role', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@example.com' } as any,
      userRole: 'user' as any,
      userCompanies: [],
      isLoading: false,
      signIn: jest.fn(),
      signOut: jest.fn(),
    });

    const { result } = renderHook(() => usePermissionCheck());
    expect(result.current.hasPermission('admin')).toBe(false);
  });
});
