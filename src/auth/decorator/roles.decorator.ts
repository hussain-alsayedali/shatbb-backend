import { SetMetadata } from '@nestjs/common';

export enum UserRole {
  ORGANIZATION_MANAGER = 'ORGANIZATION_MANAGER',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
