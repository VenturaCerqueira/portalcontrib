const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (import.meta.env.DEV ? 'http://localhost:3001' : 'https://backend.onrender.com'); // Adjust prod URL as needed

class ApiService {
  static async getContribuinte(id) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/contribuinte/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('ApiService.getContribuinte error:', error);
      return { success: false, error: error.message };
    }
  }

  static async checkAmbulante(cpf) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/ambulante/check/${cpf}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      return data; // {found: bool, data or message}
    } catch (error) {
      console.error('ApiService.checkAmbulante error:', error);
      return { found: false, message: error.message };
    }
  }
}

export default ApiService;
