import { useEffect, useState } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { authService } from '@/services/auth.service';
import type { LoginRequest, UserData } from '@/types/auth.types';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<UserData | null>(
    authService.currentUserValue,
  );

  // Subscribe to auth state changes
  useEffect(() => {
    const subscription = authService.currentUser$.subscribe((user) => {
      setCurrentUser(user);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });

  // Current user query
  const { isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => {
      const userData = authService.currentUserValue;
      return userData;
    },
    enabled: false, // We use BehaviorSubject for real-time auth state
    initialData: authService.currentUserValue,
  });

  return {
    user: currentUser,
    isLoading,
    isAuthenticated: authService.isAuthenticated(),
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
    hasRole: (role: string) => authService.hasRole(role),
    hasAnyRole: (roles: string[]) => authService.hasAnyRole(roles),
  };
};
