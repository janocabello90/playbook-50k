// Normaliza un teléfono español al formato con prefijo internacional
// (+34...). Si ya viene con prefijo (+ o 0034), lo respeta tal cual.
export function formatSpanishPhone(phone: string): string {
  const trimmed = phone.trim().replace(/[\s-]/g, '');

  if (trimmed.startsWith('+')) {
    return trimmed;
  }

  if (trimmed.startsWith('0034')) {
    return `+${trimmed.slice(2)}`;
  }

  if (trimmed.startsWith('34') && trimmed.length > 9) {
    return `+${trimmed}`;
  }

  return `+34${trimmed}`;
}
