import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from '../models/group';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class GroupsService {
  // Update base URL if your backend runs on a different port
  private apiUrl = 'http://localhost:7163/api/groups';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Group[]> {
    return this.http.get<Group[]>(this.apiUrl);
  }

  getById(id: number): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/${id}`);
  }

  create(group: { name: string }): Observable<Group> {
    return this.http.post<Group>(this.apiUrl, group);
  }

  update(id: number, group: { name: string }): Observable<Group> {
    return this.http.put<Group>(`${this.apiUrl}/${id}`, group);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getMembers(groupId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/${groupId}/members`);
  }

  addMember(groupId: number, userId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${groupId}/members`, { userId });
  }

  removeMember(groupId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${groupId}/members/${userId}`);
  }
}