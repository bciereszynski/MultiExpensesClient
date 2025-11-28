import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TransactionService } from '../../services/transactionService';
import { GroupService } from '../../services/groupService';
import { Transaction } from '../../models/transaction';
import { Group } from '../../models/group';

@Component({
  selector: 'app-transaction-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './transaction-list.html',
  styleUrls: ['./transaction-list.css'],
})
export class TransactionList implements OnInit, OnDestroy {
  transactions: Transaction[] = [];
  loading = false;
  error: string | null = null;
  selectedGroup: Group | null = null;

  constructor(
    private transactionService: TransactionService,
    private GroupService: GroupService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  private routeSub: Subscription | null = null;

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      this.error = null;
      const idParam = params.get('groupId');

      if (idParam) {
        const gid = parseInt(idParam, 10);
        if (!isNaN(gid)) {
          this.GroupService.getById(gid).subscribe({
            next: (grp) => {
              this.selectedGroup = grp;
              this.transactions = [];
              this.loadTransactions(grp.id);
            },
            error: () => {
              this.selectedGroup = null;
              this.transactions = [];
              this.error = 'Failed to load group from URL';
            }
          });
        } else {
          this.selectedGroup = null;
          this.transactions = [];
        }
      } else {
        this.selectedGroup = null;
        this.transactions = [];
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
      this.routeSub = null;
    }
  }

  loadTransactions(groupId: number): void {
    this.loading = true;
    this.error = null;
    this.transactionService.getAll(groupId).subscribe({
      next: (data) => {
        this.transactions = data || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Failed to load transactions';
        this.loading = false;
      }
    });
  }

  editTransaction(t: Transaction): void {
    if (!this.selectedGroup) return;
    this.router.navigate(['/groups', this.selectedGroup.id, 'transactions', t.id, 'edit']);
  }

  addTransaction(): void {
    if (!this.selectedGroup) return;
    this.router.navigate(['/groups', this.selectedGroup.id, 'transactions', 'add']);
  }

  deleteTransaction(t: Transaction): void {
    if (!this.selectedGroup) return;
    if (!confirm('Delete this transaction?')) return;
    this.transactionService.delete(this.selectedGroup.id, t.id).subscribe({
      next: () => this.loadTransactions(this.selectedGroup!.id),
      error: () => alert('Failed to delete transaction')
    });
  }
}
