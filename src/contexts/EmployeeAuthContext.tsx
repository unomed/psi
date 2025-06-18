
import React from 'react';
import { EmployeeAuthContext, useEmployeeAuthProvider } from '@/hooks/useEmployeeAuth';

export function EmployeeAuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useEmployeeAuthProvider();
  
  return (
    <EmployeeAuthContext.Provider value={auth}>
      {children}
    </EmployeeAuthContext.Provider>
  );
}

export { useEmployeeAuth } from '@/hooks/useEmployeeAuth';
