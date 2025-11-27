import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private baseUrl = 'http://localhost:7163/api/groups/${groupId}/transactions';

  constructor(private http: HttpClient) {}

  getAll(groupId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}`);
  }

  getById(groupId: number, id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.baseUrl}/${id}`);
  }

  create(groupId: number, transaction: Partial<Transaction>): Observable<Transaction> {
    // strip groupId/userId if accidentally provided
    const { groupId: _g, userId: _u, ...payload } = transaction as any;
    return this.http.post<Transaction>(`${this.baseUrl}`, payload);
  }

  update(groupId: number, id: number, transaction: Partial<Transaction>): Observable<Transaction> {
    const { groupId: _g, userId: _u, ...payload } = transaction as any;
    return this.http.put<Transaction>(`${this.baseUrl}/${id}`, payload);
  }

  delete(groupId: number, id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
