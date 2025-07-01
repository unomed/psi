
import { renderHook } from '@testing-library/react';
import { usePermissionValidation } from '../usePermissionValidation';
import { useAuth } from '@/contexts/AuthContext';
import { useCheckPermission } from '@/hooks/useCheckPermission';

jest.mock('@/contexts/AuthContext');
jest.mock('@/hooks/useCheckPermission');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseCheckPermission = useCheckPermission as jest.MockedFunction<typeof useCheckPermission>;

describe('usePermissionValidation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should allow all permissions for superadmin', () => {
    mockUseAuth.mockReturnValue({
      userRole: 'superadmin',
      user: { id: 'test-user' },
      loading: false,
      userCompanies: []
    } as any);

    mockUseCheckPermission.mockReturnValue({
      hasPermission: jest.fn(),
      loadingPermission: false,
      permissions: {}
    });

    const { result } = renderHook(() => usePermissionValidation());

    expect(result.current.validatePermission('any_permission')).toBe(true);
    expect(result.current.validateRole(['admin', 'user'])).toBe(true);
    expect(result.current.validateMultiplePermissions(['perm1', 'perm2'])).toBe(true);
  });

  it('should validate specific permissions for regular users', () => {
    mockUseAuth.mockReturnValue({
      userRole: 'admin',
      user: { id: 'test-user' },
      loading: false,
      userCompanies: []
    } as any);

    const mockHasPermission = jest.fn()
      .mockImplementation((permission: string) => permission === 'view_dashboard');

    mockUseCheckPermission.mockReturnValue({
      hasPermission: mockHasPermission,
      loadingPermission: false,
      permissions: {}
    });

    const { result } = renderHook(() => usePermissionValidation());

    expect(result.current.validatePermission('view_dashboard')).toBe(true);
    expect(result.current.validatePermission('manage_users')).toBe(false);
  });

  it('should validate roles correctly', () => {
    mockUseAuth.mockReturnValue({
      userRole: 'admin',
      user: { id: 'test-user' },
      loading: false,
      userCompanies: []
    } as any);

    mockUseCheckPermission.mockReturnValue({
      hasPermission: jest.fn(),
      loadingPermission: false,
      permissions: {}
    });

    const { result } = renderHook(() => usePermissionValidation());

    expect(result.current.validateRole(['admin', 'user'])).toBe(true);
    expect(result.current.validateRole(['evaluator', 'profissionais'])).toBe(false);
  });

  it('should validate multiple permissions with requireAll=true', () => {
    mockUseAuth.mockReturnValue({
      userRole: 'admin',
      user: { id: 'test-user' },
      loading: false,
      userCompanies: []
    } as any);

    const mockHasPermission = jest.fn()
      .mockImplementation((permission: string) => 
        ['view_dashboard', 'view_users'].includes(permission)
      );

    mockUseCheckPermission.mockReturnValue({
      hasPermission: mockHasPermission,
      loadingPermission: false,
      permissions: {}
    });

    const { result } = renderHook(() => usePermissionValidation());

    // Todas as permissões necessárias
    expect(result.current.validateMultiplePermissions(
      ['view_dashboard', 'view_users'], true
    )).toBe(true);

    // Uma permissão em falta
    expect(result.current.validateMultiplePermissions(
      ['view_dashboard', 'manage_users'], true
    )).toBe(false);
  });

  it('should validate multiple permissions with requireAll=false', () => {
    mockUseAuth.mockReturnValue({
      userRole: 'admin',
      user: { id: 'test-user' },
      loading: false,
      userCompanies: []
    } as any);

    const mockHasPermission = jest.fn()
      .mockImplementation((permission: string) => permission === 'view_dashboard');

    mockUseCheckPermission.mockReturnValue({
      hasPermission: mockHasPermission,
      loadingPermission: false,
      permissions: {}
    });

    const { result } = renderHook(() => usePermissionValidation());

    // Pelo menos uma permissão presente
    expect(result.current.validateMultiplePermissions(
      ['view_dashboard', 'manage_users'], false
    )).toBe(true);

    // Nenhuma permissão presente
    expect(result.current.validateMultiplePermissions(
      ['manage_users', 'delete_companies'], false
    )).toBe(false);
  });
});
