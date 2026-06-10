// Simple shared-password gate for the private /admin editor.
// The password lives in .env.local (ADMIN_PASSWORD) and never reaches
// the browser. The admin page sends it in the "x-admin-password" header.

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "elsa2026";

export function isAuthorized(req: Request): boolean {
  const provided = req.headers.get("x-admin-password");
  return !!provided && provided === ADMIN_PASSWORD;
}
