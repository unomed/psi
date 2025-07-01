
import { PermissionService } from '../permissionService';
import { supabase } from '@/integrations/supabase/client';

jest.mock('@/integrations/supabase/client');

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('PermissionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch user permissions successfully', async () => {
    const mockPermissions = {
      view_dashboard: true,
      manage_users: false,
      view_companies: true
    };

    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          maybeSingle: jest.fn().mockResolvedValue({
            data: { permissions: mockPermissions },
            error: null
          })
        })
      })
    } as any);

    const result = await PermissionService.fetchUserPermissions('admin');

    expect(result).toEqual(mockPermissions);
    expect(mockSupabase.from).toHaveBeenCalledWith('permission_settings');
  });

  it('should return null when no permissions found', async () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          maybeSingle: jest.fn().mockResolvedValue({
            data: null,
            error: null
          })
        })
      })
    } as any);

    const result = await PermissionService.fetchUserPermissions('admin');

    expect(result).toBeNull();
  });

  it('should handle database errors gracefully', async () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          maybeSingle: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error' }
          })
        })
      })
    } as any);

    const result = await PermissionService.fetchUserPermissions('admin');

    expect(result).toBeNull();
  });

  it('should handle invalid permissions format', async () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          maybeSingle: jest.fn().mockResolvedValue({
            data: { permissions: 'invalid_format' },
            error: null
          })
        })
      })
    } as any);

    const result = await PermissionService.fetchUserPermissions('admin');

    expect(result).toBeNull();
  });

  it('should handle exceptions', async () => {
    mockSupabase.from.mockImplementation(() => {
      throw new Error('Connection error');
    });

    const result = await PermissionService.fetchUserPermissions('admin');

    expect(result).toBeNull();
  });
});
