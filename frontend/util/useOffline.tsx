import { ConnectionState, ConnectionStateStore } from '@vaadin/common-frontend';
import { useEffect, useState } from 'react';

/**
 * Represents the offline hook.
 */
type OfflineHook = {
  offline: boolean;
  isOffline: () => boolean;
  clearCache: () => void;
  store: (key: string, value: any) => void;
  get: (key: string) => any;
};

/**
 * Represents a callback function that is invoked when the offline status changes.
 * @param offline - A boolean value indicating whether the user is offline or not.
 */
type OfflineChangedListener = (offline: boolean) => void;

/**
 * Represents the props for the Offline component.
 */
type OfflineProps = {
  onOfflineChange?: OfflineChangedListener;
  cacheName?: string;
};

/**
 * Custom hook to handle offline state in the application.
 * @param {OfflineProps} props - Optional props for the hook. Use { onOfflineChange : OfflineChangedListener } a callback function that is invoked when the offline status changes.
 * @returns {OfflineHook} An object containing the offline state and a function to check if the application is offline.
 */
export function useOffline(props?: OfflineProps): OfflineHook {
  const [offline, setOffline] = useState(false);
  var connectionStateStore: ConnectionStateStore | undefined;
  var internalState = isOffline();
  const CACHE_NAME = props?.cacheName || 'offline-cache';

  // Listen connection state changes
  const connectionStateListener = () => {
    const newState = isOffline();
    const changed = newState != internalState ? true : false;
    setOffline(newState);
    internalState = newState;
    if (changed) {
      props?.onOfflineChange?.(internalState);
    }
  };

  useEffect(() => {
    setupOfflineListener();
    // Cleanup
    return () => connectionStateStore?.removeStateChangeListener(connectionStateListener);
  }, []);

  /**
   * Checks if the application is currently offline.
   * @returns {boolean} Returns true if the application is offline, otherwise false.
   */
  function isOffline() {
    return connectionStateStore?.state === ConnectionState.CONNECTION_LOST;
  }

  /**
   * Sets up an offline listener to handle changes in the connection state.
   */
  function setupOfflineListener() {
    const $wnd = window as any;
    if ($wnd.Vaadin?.connectionState) {
      connectionStateStore = $wnd.Vaadin.connectionState as ConnectionStateStore;
      connectionStateStore.addStateChangeListener(connectionStateListener);
      connectionStateListener();
    }
  }

  /**
   * Stores a value in the cache with the specified key.
   *
   * @param key - The key to store the value under.
   * @param value - The value to store.
   */
  function store(key: string, value: any) {
    const cache = getCache();
    cache[key] = value;
    localStorage.setItem(CACHE_NAME, JSON.stringify(cache));
  }

  /**
   * Retrieves the value associated with the specified key from the cache.
   *
   * @param key - The key of the value to retrieve.
   * @returns The value associated with the specified key, or undefined if the key does not exist in the cache.
   */
  function get(key: string): any {
    const cache = getCache();
    return cache[key];
  }

  function getCache(): any {
    const cache = localStorage.getItem(CACHE_NAME) || '{}';
    return JSON.parse(cache);
  }

  /**
   * Clears the cache by removing the item with the specified cache name from the local storage.
   */
  function clearCache() {
    localStorage.removeItem(CACHE_NAME);
  }

  return { offline: offline, isOffline: isOffline, clearCache: clearCache, store: store, get: get };
}
