
export const connectionUtils = {
  async testConnection(): Promise<boolean> {
    // Always return true for localStorage mode
    console.log('localStorage mode: connection test successful');
    return true;
  }
};
