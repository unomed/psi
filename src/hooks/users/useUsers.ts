
import { useFetchUsers } from "./useFetchUsers";
import { useUpdateUserRole } from "./useUpdateUserRole";
import { useDeleteUser } from "./useDeleteUser";
import { useCreateUser } from "./useCreateUser";
import type { User } from "./types";

export function useUsers() {
  const { data: users, isLoading } = useFetchUsers();
  const updateUserRole = useUpdateUserRole();
  const deleteUser = useDeleteUser();
  const createUser = useCreateUser();
  
  return {
    users,
    isLoading,
    updateUserRole,
    deleteUser,
    createUser
  };
}

export type { User };
