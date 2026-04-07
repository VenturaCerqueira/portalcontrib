const BACKEND_URL = import.meta.env.DEV 
  ? '/api' 
  : (import.meta.env.VITE_API_URL || 'https://portalcontrib-backend.onrender.com/api');

class ApiService {
  static async validateCPF(rawCPF) {
    try {
      const response = await fetch(`${BACKEND_URL}/validate-cpf/${rawCPF}`);
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Muitas requisições. Aguarde 15s.');
        }
        const errorText = await response.text();
        throw new Error(`Servidor: ${response.status} - ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      throw new Error('Erro ao consultar CPF');
    }
  }

  // ✅ UPDATED: FormData multipart for photo upload
  static async submitCadastro(formData) {
    try {
      const response = await fetch(`${BACKEND_URL}/cadastros`, {
        method: 'POST',
        body: formData // No Content-Type - browser sets multipart/form-data + boundary
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro servidor: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('submitCadastro error:', error);
      throw new Error(`Erro ao enviar cadastro: ${error.message}`);
    }
  }

  static async getContribuinte(id) {
    try {
      const response = await fetch(`${BACKEND_URL}/contribuinte/${id}`);
      
      if (!response.ok) {
        let errorText = 'Unknown error';
        try { errorText = await response.text(); } catch {}
        if (response.status === 429) throw new Error('Rate limit. Aguarde 15s.');
        throw new Error(`Servidor ${response.status}: ${errorText.substring(0, 200)}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await response.text();
        console.error('Expected JSON:', contentType, text.substring(0, 300));
        throw new Error(`Resposta inválida: ${contentType || 'none'}`);
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(`Erro contribuinte: ${error.message}`);
    }
  }

  static async healthCheck() {
    try {
      const response = await fetch(`${BACKEND_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }

  // 🆕 Check if ambulante cadastro exists
  static async checkAmbulante(rawCPF) {
    try {
      const response = await fetch(`${BACKEND_URL}/check-ambulante/${rawCPF}`);
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Muitas requisições. Aguarde 15s.');
        }
        const errorText = await response.text();
        throw new Error(`Servidor: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      throw new Error('Erro ao consultar cadastro ambulante');
    }
  }
}

export default ApiService;

