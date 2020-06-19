
const production = process.env.NODE_ENV === "production";
export const apiBaseUrl = production ? '' : 'http://localhost:8080';