
export interface EmployeeAuth {
  employeeId: string;
  employeeName: string;
  companyId: string;
  companyName: string;
  isValid: boolean;
}

export interface EmployeeSession {
  employee: EmployeeAuth;
  isAuthenticated: boolean;
}
