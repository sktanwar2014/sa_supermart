import * as c from './Constants';

export default function checkError(error) {
  if(error || error.response.status === 401) {
    c.APP_TOKEN.remove();
    document.location.reload();
  }
}