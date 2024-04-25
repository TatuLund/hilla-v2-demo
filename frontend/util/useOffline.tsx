import { ConnectionState, ConnectionStateStore } from '@vaadin/common-frontend';
import { useEffect, useState } from 'react';

/**
 * Represents the offline hook.
 */
type OfflineHook = {
  offline: boolean;
  isOffline: () => boolean;
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

  useEffect(() => setupOfflineListener(), []);

  return { offline: offline, isOffline: isOffline };
}
