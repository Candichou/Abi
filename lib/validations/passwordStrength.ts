export function checkPasswordStrength(password: string) {
  return {
    minLength: password.length >= 12,
    hasUpperCase: /[A-Z]/.test(password),
    hasDigit: /[0-9]/.test(password),
    hasSymbol: /[^a-zA-Z0-9]/.test(password),
  };
}
