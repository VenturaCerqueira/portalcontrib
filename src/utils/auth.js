import CryptoJS from 'crypto-js';
import storage from './storage.js';

const SECRET_KEY = 'PortalContribSecure2024!'; // In prod, derive from pass
const TOKEN_EXPIRY = 30 * 60 * 1000; // 30min

export const encrypt = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decrypt = (encrypted) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (e) {
    console.error('Decrypt error:', e);
    return null;
  }
};

export const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
};

export const isAuthenticated = async () => {
  const auth = await storage.getAuth();
  if (!auth) return false;
  return Date.now() - auth.timestamp < TOKEN_EXPIRY;
};

export const login = async (email, password) => {
  const hashed = await hashPassword(password);
  // Simple mock user - in prod, fetch from secure store
  const mockUserHash = await hashPassword('admin@portal.gov'); // Mock
  if (email === 'user@portal.gov' && hashed === mockUserHash) {
    const token = { timestamp: Date.now(), user: email };
    await storage.setAuth(token);
    return true;
  }
  return false;
};

export const logout = async () => {
  await storage.clearAuth();
};

export const encryptSensitive = (data) => {
  const sensitiveFields = ['cpf', 'rg', 'nit', 'telContato', 'celular', 'cep', 'logradouro', 'endereco', 'bairro', 'cnpjEmpresa', 'cpfInformal', 'cnpjMEI', 'empresaTel'];
  const encryptedData = { ...data };
  sensitiveFields.forEach(field => {
    if (data[field]) {
      encryptedData[field] = encrypt(data[field]);
    }
  });
  return encryptedData;
};

export const decryptCadastro = (cadastro) => {
  const decrypted = { ...cadastro };
  const sensitiveFields = ['cpf', 'rg', 'nit', 'telContato', 'celular', 'cep', 'logradouro', 'endereco', 'bairro', 'cnpjEmpresa', 'cpfInformal', 'cnpjMEI', 'empresaTel'];
  sensitiveFields.forEach(field => {
    if (cadastro[field]) {
      decrypted[field] = decrypt(cadastro[field]);
    }
  });
  return decrypted;
};

