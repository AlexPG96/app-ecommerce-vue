// Obtenemos el Jason web token para guardarlo en el localstorage.
import { TOKEN } from '../utils/constants';

export function setTokenApi(token) {
    localStorage.setItem(TOKEN, token);
} 

export function getTokenApi() {
    return localStorage.getItem(TOKEN);
}

export function deleteTokenApi() {
    return localStorage.removeItem(TOKEN);
}