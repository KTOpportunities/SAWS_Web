import { Injectable } from "@angular/core";

const TOKEN_KEY = "auth-token";

@Injectable({
  providedIn: "root",
})
export class TokeStorageService {
  signOut(): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
  }

  saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }
}
