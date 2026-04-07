const BACKEND_URL = import.meta.env.DEV 
  ? '/api' 
  : 'https://portalcontrib-backend.onrender.com/api';  // ✅ Render backend URL hardcoded

class ApiService {
  static async validateCPF(rawCPF) {
    try {
      const response = await fetch(`${BACKEND_URL}/validate-cpf/${rawCPF}`);
      
      if (!response.ok) {
        if (response.status
