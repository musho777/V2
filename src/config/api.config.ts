/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */

export const API_CONFIG = {
  /**
   * Main API base URL
   * Used for most API endpoints
   */
  BASE_URL:
    process.env.NEXT_PUBLIC_API_URL || 'https://crm-dev-api.simplego.am',

  /**
   * Authentication API URL
   * Used specifically for authentication endpoints
   */
  AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL || 'http://46.182.174.39:7070',

  /**
   * TinyMCE API Key for rich text editor
   */
  TINYMCE_API_KEY:
    process.env.NEXT_PUBLIC_TINYMCE_API_KEY ||
    '14dhlnaamh5copp091np7prtcxyx6sqf45p16prxqpcyp7oy',
} as const;
