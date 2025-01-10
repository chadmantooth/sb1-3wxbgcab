export function checkRequiredEnvVars() {
  const required = ['OTX_API_KEY'];

  const missing = required.filter(key => !process.env[key] || process.env[key].trim() === '');
  
  if (missing.length > 0) {
    throw new Error('Security API key not configured. Please check your environment variables.');
  }
}