import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Group } from '../models/group';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private apiUrl = 'https://localhost:7163/api/Groups';

  private selected$ = new BehaviorSubject<Group | null>(null);
  readonly selectedGroup$: Observable<Group | null> = this.selected$.asObservable();

  constructor(private http: HttpClient) {}

  selectGroup(group: Group | null): void {
    this.selected$.next(group);
  }

  clearSelection(): void {
    this.selected$.next(null);
  }

  get currentSelected(): Group | null {
    return this.selected$.getValue();
  }

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