import FingerprintJS from '@fingerprintjs/fingerprintjs';

let cachedDeviceId: string | null = null;

export async function getDeviceId(): Promise<string> {
  // Return cached ID if available
  if (cachedDeviceId) {
    return cachedDeviceId;
  }

  // Check if we have a stored ID from previous visits
  const storedId = localStorage.getItem('townhall_device_id');
  if (storedId) {
    cachedDeviceId = storedId;
    return storedId;
  }

  // Generate a new device ID if none exists
  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const newDeviceId = result.visitorId;
    
    // Save to localStorage for future visits
    localStorage.setItem('townhall_device_id', newDeviceId);
    cachedDeviceId = newDeviceId;
    return newDeviceId;
  } catch (error) {
    console.error('Error generating device fingerprint:', error);
    // Fallback to a random ID with timestamp
    const fallbackId = `fallback-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    localStorage.setItem('townhall_device_id', fallbackId);
    cachedDeviceId = fallbackId;
    return fallbackId;
  }
}

export async function getUserIP(): Promise<string | null> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
    return null;
  }
}
