import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Group } from '../../models/group';
import { GroupService } from '../../services/groupService';

@Component({
  selector: 'app-groups-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './group-list.html',
  styleUrls: ['./group-list.css'],
})
export class GroupsList implements OnInit {
  groups: Group[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private GroupService: GroupService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    this.loading = true;
    this.error = null;
    this.GroupService.getAll().subscribe({
      next: (g) => {
        this.groups = g || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Failed to load groups';
        this.loading = false;
      }
    });
  }

  open(group: Group): void {
    this.GroupService.selectGroup(group);
    this.router.navigate(['/groups', group.id, 'transactions']);
  }

  edit(group: Group): void {
    this.router.navigate(['/groups', group.id, 'edit']);
  }

  delete(group: Group): void {
    if (!confirm(`Delete group "${group.name}"? This cannot be undone.`)) return;
    this.GroupService.delete(group.id).subscribe({
      next: () => this.loadGroups(),
      error: () => alert('Failed to delete group.')
    });
  }

  create(): void {
    this.router.navigate(['/groups', 'new']);
  }
}