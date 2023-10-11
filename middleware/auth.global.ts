function validateToken() {
  if (process.client) {
    const storedState = localStorage.getItem('authStore');
    const parsedState = JSON.parse(storedState || '{}');
    return !!parsedState?.token; // Retorna verdadeiro se o token existir
  }
  return false; // Retorna falso como padrão, você pode adicionar lógica de servidor aqui se necessário
}
export default defineNuxtRouteMiddleware((to) => {
  if (process.client) {
    const isTokenValid = validateToken();
    if ((!isTokenValid && to.path !== '/login') || (!isTokenValid && to.path !== '/signup')) {
      return window.location.replace('/login');
    }
  }
});
