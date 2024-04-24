import { ConnectionState, ConnectionStateStore } from '@vaadin/common-frontend';
import { useEffect, useState } from 'react';

type OfflineHook = {
  offline: boolean;
  isOffline: () => boolean;
};

export function useOffline() : OfflineHook {
  const [offline, setOffline] = useState(false);
  var connectionStateStore: ConnectionStateStore | undefined;

  // Listen connection state changes
  const connectionStateListener = () => {
    setOffline(isOffline());
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
