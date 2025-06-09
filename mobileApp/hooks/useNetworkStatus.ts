import { useState, useEffect } from 'react';
import { storageService } from '@/services/storage';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // In a real app, you would use @react-native-community/netinfo
    // For this demo, we'll simulate network status
    const checkNetworkStatus = async () => {
      const offlineStatus = await storageService.getOfflineStatus();
      setIsOnline(!offlineStatus);
    };

    checkNetworkStatus();
  }, []);

  return { isOnline };
};