
import React from 'react';
import { useEmployeeAuthNative, EmployeeAuthNativeProvider } from '@/contexts/EmployeeAuthNative';

// Re-exportar o provider nativo
export { EmployeeAuthNativeProvider as EmployeeAuthProvider };

// Re-exportar o hook nativo
export { useEmployeeAuthNative as useEmployeeAuth };
