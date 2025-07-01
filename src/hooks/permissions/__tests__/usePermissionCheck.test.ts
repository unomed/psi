
import { renderHook, waitFor } from '@testing-library/react';
import { usePermissionCheck } from '../usePermissionCheck';
import { useAuth } from '@/contexts/AuthContext';
import { PermissionService } from '@/services/permissions/permissionService';
import { getAllPermissions, getDefaultPermissionsForRole } from '@/utils/permissions/defaultPermissions';

// Mock das dependências
jest.mock('@/contexts/AuthContext');
jest.mock('@/services/permissions/permissionService');
jest.mock('@/utils/permissions/defaultPermissions');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockPermissionService = PermissionService.fetchUserPermissions as jest.MockedFunction<typeof PermissionService.fetchUserPermissions>;
const mockGetAllPermissions = getAllPermissions as jest.MockedFunction<typeof getAllPermissions>;
const mockGetDefaultPermissionsForRole = getDefaultPermissionsForRole as jest.MockedFunction<typeof getDefaultPermissionsForRole>;

describe('usePermissionCheck', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should grant all permissions for superadmin', async () => {
    mockUseAuth.mockReturnValue({
      userRole: 'superadmin',
      user: { id: 'test-user' },
      loading: false,
      userCompanies: []
    } as any);

    const allPermissions = { view_dashboard: true, manage_users: true };
    mockGetAllPermissions.mockReturnValue(allPermissions);

    const { result } = renderHook(() => usePermissionCheck());

    await waitFor(() => {
      expect(result.current.loadingPermission).toBe(false);
    });

    expect(result.current.hasPermission('view_dashboard')).toBe(true);
    expect(result.current.hasPermission('manage_users')).toBe(true);
    expect(result.current.permissions).toEqual(allPermissions);
  });

  it('should use fetched permissions for regular users', async () => {
    mockUseAuth.mockReturnValue({
      userRole: 'admin',
      user: { id: 'test-user' },
      loading: false,
      userCompanies: []
    } as any);

    const fetchedPermissions = { view_dashboard: true, manage_users: false };
    mockPermissionService.mockResolvedValue(fetchedPermissions);

    const { result } = renderHook(() => usePermissionCheck());

    await waitFor(() => {
      expect(result.current.loadingPermission).toBe(false);
    });

    expect(result.current.hasPermission('view_dashboard')).toBe(true);
    expect(result.current.hasPermission('manage_users')).toBe(false);
    expect(result.current.permissions).toEqual(fetchedPermissions);
  });

  it('should use default permissions when fetch fails', async () => {
    mockUseAuth.mockReturnValue({
      userRole: 'evaluator',
      user: { id: 'test-user' },
      loading: false,
      userCompanies: []
    } as any);

    mockPermissionService.mockResolvedValue(null);
    const defaultPermissions = { view_dashboard: true, manage_users: false };
    mockGetDefaultPermissionsForRole.mockReturnValue(defaultPermissions);

    const { result } = renderHook(() => usePermissionCheck());

    await waitFor(() => {
      expect(result.current.loadingPermission).toBe(false);
    });

    expect(result.current.permissions).toEqual(defaultPermissions);
    expect(mockGetDefaultPermissionsForRole).toHaveBeenCalledWith('evaluator');
  });

  it('should return false for permissions while loading', () => {
    mockUseAuth.mockReturnValue({
      userRole: 'admin',
      user: { id: 'test-user' },
      loading: false,
      userCompanies: []
    } as any);

    const { result } = renderHook(() => usePermissionCheck());

    // Durante o carregamento, deve retornar false
    expect(result.current.loadingPermission).toBe(true);
    expect(result.current.hasPermission('view_dashboard')).toBe(false);
  });

  it('should handle missing user role gracefully', async () => {
    mockUseAuth.mockReturnValue({
      userRole: null,
      user: null,
      loading: false,
      userCompanies: []
    } as any);

    const { result } = renderHook(() => usePermissionCheck());

    await waitFor(() => {
      expect(result.current.loadingPermission).toBe(false);
    });

    expect(result.current.permissions).toEqual({});
    expect(result.current.hasPermission('view_dashboard')).toBe(false);
  });
});
