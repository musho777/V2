'use client';

import { use, useEffect, useState } from 'react';

import ProfilePage from '@/modules/profile/pages/ProfilePage';

interface ProfileRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UserProfileRoute({ params }: ProfileRouteProps) {
  const { id } = use(params);
  const userId = parseInt(id, 10);
  const [canEdit, setCanEdit] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== 'undefined' && !isNaN(userId)) {
      // Try to get permissions from sessionStorage
      const permissionsStr = sessionStorage.getItem(
        `user_${userId}_permissions`,
      );

      if (permissionsStr) {
        try {
          const permissions = JSON.parse(permissionsStr);
          setCanEdit(permissions.accessToAction ?? false);
        } catch (e) {
          console.error('Failed to parse user permissions:', e);
          setCanEdit(false);
        }
      } else {
        // No permissions found, default to false (read-only)
        setCanEdit(false);
      }
    }
  }, [userId]);

  if (isNaN(userId)) {
    return (
      <div style={{ padding: '24px' }}>
        <p>Invalid user ID</p>
      </div>
    );
  }

  // Wait for permissions to be loaded
  if (canEdit === undefined) {
    return (
      <div style={{ padding: '24px' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return <ProfilePage userId={userId} canEdit={canEdit} />;
}
