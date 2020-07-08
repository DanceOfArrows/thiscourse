
const production = process.env.NODE_ENV === "production";
export const apiBaseUrl = production ? 'https://thiscourse-back.herokuapp.com' : 'http://localhost:8080';