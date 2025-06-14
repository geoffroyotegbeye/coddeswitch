import Cookies from 'js-cookie';

// Durée de vie des cookies en jours
const TOKEN_EXPIRY = 7;
const USER_EXPIRY = 7;

// Noms des cookies
const TOKEN_KEY = 'codeswitch_token';
const USER_KEY = 'codeswitch_user';

// Options de sécurité pour les cookies
const cookieOptions = {
  expires: TOKEN_EXPIRY,
  secure: process.env.NODE_ENV === 'production', // Secure en production uniquement
  sameSite: 'strict' as const,
  // httpOnly ne peut pas être défini côté client pour des raisons de sécurité
  // Il faudrait le configurer côté serveur
};

/**
 * Service pour gérer les cookies d'authentification
 */
class CookieService {
  /**
   * Stocke le token JWT dans un cookie
   */
  setToken(token: string): void {
    Cookies.set(TOKEN_KEY, token, cookieOptions);
  }

  /**
   * Récupère le token JWT depuis les cookies
   */
  getToken(): string | undefined {
    return Cookies.get(TOKEN_KEY);
  }

  /**
   * Stocke les données utilisateur dans un cookie
   */
  setUser(user: any): void {
    Cookies.set(USER_KEY, JSON.stringify(user), cookieOptions);
  }

  /**
   * Récupère les données utilisateur depuis les cookies
   */
  getUser(): any {
    const userStr = Cookies.get(USER_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Erreur lors du parsing des données utilisateur:', error);
      return null;
    }
  }

  /**
   * Supprime tous les cookies d'authentification
   */
  clearAll(): void {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(USER_KEY);
  }
}

export default new CookieService();
