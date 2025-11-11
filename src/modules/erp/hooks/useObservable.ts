import { useCallback, useEffect, useRef, useState } from 'react';

import type { Observable, Subscription } from 'rxjs';

export interface UseObservableState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface UseObservableOptions<T> {
  initialData?: T | null;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  immediate?: boolean;
}

/**
 * Custom hook for managing Observable subscriptions
 * Handles loading, data, and error states automatically
 */
export function useObservable<T>(
  observableFactory: () => Observable<T>,
  options: UseObservableOptions<T> = {},
): [UseObservableState<T>, () => void, () => void] {
  const { initialData = null, onSuccess, onError, immediate = false } = options;

  const [state, setState] = useState<UseObservableState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const subscriptionRef = useRef<Subscription | null>(null);
  const isMountedRef = useRef(true);

  const execute = useCallback(() => {
    // Cancel previous subscription if exists
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    const observable = observableFactory();
    subscriptionRef.current = observable.subscribe({
      next: (data) => {
        if (isMountedRef.current) {
          setState({
            data,
            loading: false,
            error: null,
          });
          onSuccess?.(data);
        }
      },
      error: (error) => {
        if (isMountedRef.current) {
          setState({
            data: null,
            loading: false,
            error,
          });
          onError?.(error);
        }
      },
    });
  }, [observableFactory, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
    });
  }, [initialData]);

  useEffect(() => {
    if (immediate) {
      execute();
    }

    return () => {
      isMountedRef.current = false;
      subscriptionRef.current?.unsubscribe();
    };
  }, [immediate, execute]);

  return [state, execute, reset];
}

/**
 * Simplified hook for one-time Observable execution
 */
export function useObservableOnce<T>(
  observableFactory: () => Observable<T>,
  dependencies: any[] = [],
): UseObservableState<T> {
  const [state, setState] = useState<UseObservableState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let subscription: Subscription | null = null;
    let isMounted = true;

    const observable = observableFactory();
    subscription = observable.subscribe({
      next: (data) => {
        if (isMounted) {
          setState({
            data,
            loading: false,
            error: null,
          });
        }
      },
      error: (error) => {
        if (isMounted) {
          setState({
            data: null,
            loading: false,
            error,
          });
        }
      },
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, dependencies);

  return state;
}

/**
 * Hook for lazy Observable execution with manual trigger
 */
export function useObservableLazy<T, P = void>(
  observableFactory: (params: P) => Observable<T>,
): [(params: P) => void, UseObservableState<T>] {
  const [state, setState] = useState<UseObservableState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const subscriptionRef = useRef<Subscription | null>(null);

  const execute = useCallback(
    (params: P) => {
      // Cancel previous subscription if exists
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }

      setState({
        data: null,
        loading: true,
        error: null,
      });

      const observable = observableFactory(params);
      subscriptionRef.current = observable.subscribe({
        next: (data) => {
          setState({
            data,
            loading: false,
            error: null,
          });
        },
        error: (error) => {
          setState({
            data: null,
            loading: false,
            error,
          });
        },
      });
    },
    [observableFactory],
  );

  useEffect(() => {
    return () => {
      subscriptionRef.current?.unsubscribe();
    };
  }, []);

  return [execute, state];
}
