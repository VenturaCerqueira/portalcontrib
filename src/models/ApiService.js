const BACKEND_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001') + '/api';

class ApiService {
  static async validateCPF(rawCPF) {
    try {
      const response = await fetch(`${BACKEND_URL}validate-cpf/${rawCPF}`);
      
      if (!response.ok) {
        // Handle rate limit (429) and other errors gracefully
        if (response.status === 429) {
          throw new Error('Muitas requisições. Aguarde 15s e tente novamente.');
        }
        const errorText = await response.text();
        throw new Error(`Servidor: ${response.status} - ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {      throw new Error('Erro ao consultar CPF');    }
  }

  static async submitCadastro(data) {
    try {
      const response = await fetch(`${BACKEND_URL}cadastros`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro no servidor');
      }

      return await response.json();
    } catch (error) {      throw new Error(`Erro ao enviar: ${error.message}`);   }
  }

  static async getContribuinte(id) {
    try {
      // Use consistent BACKEND_URL (works local + Render)
      const response = await fetch(`${BACKEND_URL}/contribuinte/${id}`);
      
      if (!response.ok) {
        let errorText = 'Unknown error';
        try {
          errorText = await response.text();
        } catch {}
        if (response.status === 429) {
          throw new Error('Rate limit. Wait 15s.');
        }
        throw new Error(`Server ${response.status}: ${errorText.substring(0, 200)}`);
      }
      
      // Check content-type before JSON
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await response.text();
        console.error('Expected JSON but got:', contentType, text.substring(0, 300));
        throw new Error(`Invalid response type: ${contentType || 'none'}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('getContribuinte error details:', error);
      throw new Error(`Erro ao buscar contribuinte: ${error.message}`);
    }
  }

  static async healthCheck() {
    try {
      const response = await fetch(`${BACKEND_URL}health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export default ApiService;

