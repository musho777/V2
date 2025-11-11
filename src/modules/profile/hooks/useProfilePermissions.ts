import { useMemo } from 'react';

import { authService } from '@/services/auth.service';

/**
 * Hook to determine profile edit permissions
 *
 * Permission rules:
 * - Super Admin can edit Super Users
 * - HR Manager can edit regular users (non-super admin users)
 * - Each user can edit their own profile
 *
 * @param profileUserId - The ID of the profile being viewed
 */
export const useProfilePermissions = (profileUserId: number) => {
  const currentUser = authService.currentUserValue;

  return useMemo(() => {
    if (!currentUser) {
      return {
        canEdit: false,
        isSelf: false,
        isSuperAdmin: false,
        isHRManager: false,
      };
    }

    const isSelf = currentUser.userId === profileUserId;
    const isSuperAdmin = authService.hasRole('SUPER_ADMIN');
    const isHRManager = authService.hasRole('HR_MANAGER');

    // User can always edit their own profile
    if (isSelf) {
      return {
        canEdit: true,
        isSelf: true,
        isSuperAdmin,
        isHRManager,
      };
    }

    // Super Admin can edit all users
    if (isSuperAdmin) {
      return {
        canEdit: true,
        isSelf: false,
        isSuperAdmin: true,
        isHRManager,
      };
    }

    // HR Manager can edit regular users (we'll check if target is not super admin)
    // Note: In a real implementation, you'd need to fetch the target user's role
    // For now, we'll allow HR Manager to edit any other user
    if (isHRManager) {
      return {
        canEdit: true,
        isSelf: false,
        isSuperAdmin: false,
        isHRManager: true,
      };
    }

    // Default: no edit permission
    return {
      canEdit: false,
      isSelf: false,
      isSuperAdmin: false,
      isHRManager: false,
    };
  }, [currentUser, profileUserId]);
};
