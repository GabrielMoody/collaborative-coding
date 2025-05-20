export const users: Record<string, { password: string }> = {};

export function registerUser(username: string, password: string) {
  if (users[username]) throw new Error("User already exists");
  users[username] = { password };
}

export function loginUser(username: string, password: string) {
  const user = users[username];
  if (!user || user.password !== password) throw new Error("Invalid credentials");
  return { username };
}
