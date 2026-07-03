// Temporary local admin credentials.
// This exists only until real backend authentication (JWT) is wired up.
// Do not treat this as a production auth strategy.
export const TEMP_ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
}

export const AUTH_STORAGE_KEY = 'gatemind_admin_session'
