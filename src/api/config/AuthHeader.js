export function authHeader() {
  // return authorization header with basic auth credentials
  // let user = JSON.parse(sessionStorage.token);

  // if (user && user.token) {
  return { Authorization: `Basic ${sessionStorage.token}`,  'content-type': 'application/json' };
  
  // } else {
  //     return {};
  // }
}
