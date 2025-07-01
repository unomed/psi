
import { usePermissionCheck } from './permissions/usePermissionCheck';

interface PermissionItem {
  resource?: string;
  actions?: string[];
}

export function useCheckPermission() {
  return usePermissionCheck();
}
