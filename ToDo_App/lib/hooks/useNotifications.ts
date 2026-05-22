import { useCallback, useState } from 'react';

export function useNotifications() {
  const [enabled, setEnabled] = useState(false);

  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    const permission = await Notification.requestPermission();
    const ok = permission === 'granted';
    setEnabled(ok);
    return ok;
  }, []);

  return { enabled, requestPermission };
}
