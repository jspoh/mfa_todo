import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_DOMAIN = 'http://localhost:5000'; // dev only, serve static in production (not sure if js files will link with flask but express works well)

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private httpClient: HttpClient) {}

  loginUser(payload: any): Observable<any> {
    return this.httpClient.post(`${API_DOMAIN}/login`, payload, {
      withCredentials: true,
    });
  }

  /**
   * Gets current user by checking `session` cookie
   * @returns Observable. Subscribe to make request.
   */
  getUser(): Observable<any> {
    return this.httpClient.get(`${API_DOMAIN}/user`, { withCredentials: true });
  }

  /**
   * Gets user created todo item(s)
   * @param postId use `%` to get all todos
   * @returns Observable. Subscribe to make request.
   */
  getTodos(postId: string | number = '%'): Observable<any> {
    return this.httpClient.get(`${API_DOMAIN}/todo/${postId}`, {
      withCredentials: true,
    });
  }
}
