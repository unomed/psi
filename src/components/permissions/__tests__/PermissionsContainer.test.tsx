
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PermissionsContainer } from '../PermissionsContainer';
import { Permission } from '@/hooks/usePermissions';
import { PermissionSetting } from '@/types/permissions';

const mockPermissionOperations = {
  newRoleName: '',
  setNewRoleName: jest.fn(),
  dialogOpen: false,
  setDialogOpen: jest.fn(),
  editDialogOpen: false,
  setEditDialogOpen: jest.fn(),
  deleteDialogOpen: false,
  setDeleteDialogOpen: jest.fn(),
  selectedRole: null,
  handleTogglePermission: jest.fn(),
  handleCreateRole: jest.fn(),
  handleEditRole: jest.fn(),
  handleDeleteRole: jest.fn(),
  onEditRole: jest.fn(),
  onDeleteRole: jest.fn(),
  getPermissionValue: jest.fn()
};

const mockPermissions: Permission[] = [
  {
    id: '1',
    role: 'admin',
    permissions: {
      view_dashboard: true,
      manage_users: false
    }
  },
  {
    id: '2',
    role: 'evaluator',
    permissions: {
      view_dashboard: true,
      manage_users: false
    }
  }
];

const mockPermissionSettings: PermissionSetting[] = [
  {
    id: 'view_dashboard',
    name: 'Visualizar Dashboard',
    description: 'Acesso ao dashboard',
    section: 'Dashboard'
  },
  {
    id: 'manage_users',
    name: 'Gerenciar Usuários',
    description: 'Permissão para gerenciar usuários',
    section: 'Configurações'
  }
];

const mockSections = ['Dashboard', 'Configurações'];

describe('PermissionsContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render permissions header', () => {
    render(
      <PermissionsContainer
        uniquePermissions={mockPermissions}
        permissionSettings={mockPermissionSettings}
        sections={mockSections}
        permissionOperations={mockPermissionOperations}
      />
    );

    expect(screen.getByText('Gerenciar Permissões')).toBeInTheDocument();
    expect(screen.getByText('2 Total')).toBeInTheDocument();
  });

  it('should render permission cards for each section', () => {
    render(
      <PermissionsContainer
        uniquePermissions={mockPermissions}
        permissionSettings={mockPermissionSettings}
        sections={mockSections}
        permissionOperations={mockPermissionOperations}
      />
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Configurações')).toBeInTheDocument();
  });

  it('should call onCreateRole when create button is clicked', () => {
    render(
      <PermissionsContainer
        uniquePermissions={mockPermissions}
        permissionSettings={mockPermissionSettings}
        sections={mockSections}
        permissionOperations={mockPermissionOperations}
      />
    );

    const createButton = screen.getByText('Criar Novo Perfil');
    fireEvent.click(createButton);

    expect(mockPermissionOperations.setDialogOpen).toHaveBeenCalledWith(true);
  });

  it('should render permission legend', () => {
    render(
      <PermissionsContainer
        uniquePermissions={mockPermissions}
        permissionSettings={mockPermissionSettings}
        sections={mockSections}
        permissionOperations={mockPermissionOperations}
      />
    );

    // Verificar se a legenda está presente (assumindo que ela tem algum texto específico)
    expect(screen.getByText(/permissões/i)).toBeInTheDocument();
  });

  it('should handle empty permissions gracefully', () => {
    render(
      <PermissionsContainer
        uniquePermissions={[]}
        permissionSettings={[]}
        sections={[]}
        permissionOperations={mockPermissionOperations}
      />
    );

    expect(screen.getByText('0 Total')).toBeInTheDocument();
  });
});
