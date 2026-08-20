export function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim().replace(/\s+/g, " ");
  const [firstName, ...rest] = trimmed.split(" ");

  return {
    firstName: firstName || trimmed,
    lastName: rest.join(" "),
  };
}
