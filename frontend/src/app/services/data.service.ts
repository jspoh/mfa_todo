import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateTodoPayload } from '../features/todos/todos.component';

const API_DOMAIN = 'http://localhost:5000/api'; // dev only, serve static in production (not sure if js files will link with flask but express works well)

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

  signupUser(payload: any): Observable<any> {
    return this.httpClient.post(`${API_DOMAIN}/signup`, payload, {
      withCredentials: true
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

  /**
   * Creates a new todo item
   * @param payload
   * @returns
   */
  createTodo(payload: CreateTodoPayload): Observable<any> {
    return this.httpClient.post(`${API_DOMAIN}/todo/create`, payload, {
      withCredentials: true,
    });
  }

  updateTodo(payload: CreateTodoPayload): Observable<any> {
    return this.httpClient.put(`${API_DOMAIN}/todo`, payload, {
      withCredentials: true,
    });
  }

  deleteTodo(id: number): Observable<any> {
    return this.httpClient.delete(`${API_DOMAIN}/todo/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
  }
}
