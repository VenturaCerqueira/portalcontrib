const BACKEND_URL = 'http://localhost:3001';

class ApiService {
  static async validateCPF(rawCPF) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/validate-cpf/${rawCPF}`);
      return await response.json();
    } catch (error) {
      console.error('CPF validation error:', error);
      throw new Error('Erro ao consultar CPF');
    }
  }

  static async submitCadastro(data) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/cadastros`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro no servidor');
      }

      return await response.json();
    } catch (error) {
      console.error('Submit error:', error);
      throw new Error(`Erro ao enviar: ${error.message}`);
    }
  }

  static async healthCheck() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export default ApiService;

