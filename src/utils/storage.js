import { get, set } from 'idb-keyval';

const DB_NAME = 'SecurePortalDB';
const CADASTROS_STORE = 'cadastros';
const RATE_STORE = 'rateLimit';
const AUTH_STORE = 'auth';

export const storage = {
// Cadastros moved to MySQL API - local storage removed

  async getRateLimit() {
    try {
      const data = await get(RATE_STORE);
      return data || { count: 0, reset: Date.now() };
    } catch (e) {
      return { count: 0, reset: Date.now() };
    }
  },

  async updateRateLimit(count) {
    await set(RATE_STORE, { count, reset: Date.now() });
  },

  async getAuth() {
    try {
      return await get(AUTH_STORE);
    } catch (e) {
      return null;
    }
  },

  async setAuth(token) {
    await set(AUTH_STORE, token);
  },

  async clearAuth() {
    await set(AUTH_STORE, null);
  }
};

export default storage;

