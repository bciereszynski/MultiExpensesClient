import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TransactionService } from '../../services/transactionService';
import { GroupService } from '../../services/groupService';
import { Transaction } from '../../models/transaction';

@Component({
  standalone: true,
  selector: 'app-transaction-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './transaction-form.html',
  styleUrls: ['./transaction-form.css'],
})
export class TransactionForm implements OnInit {
  transactionForm!: FormGroup;

  incomeCategories = ['Salary', 'Business', 'Investment', 'Gift', 'Other'];
  expenseCategories = ['Food', 'Rent', 'Utilities', 'Entertainment', 'Travel', 'Other'];
  availableCategories: string[] = [];

  editMode = false;
  transactionId: number | null = null;
  selectedGroupId: number | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private groupsService: GroupService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // initialize form after fb is available
    this.transactionForm = this.fb.group({
      type: ['expense', Validators.required],
      category: ['', Validators.required],
      amount: ['0.00', Validators.required],
      description: [''],
      createdAt: [this.formatDateForInput(new Date()), Validators.required],
    });
  }

  ngOnInit(): void {
    // use fallback default when value may be null/undefined
    this.updateAvailableCategories(this.transactionForm.get('type')?.value ?? 'expense');

    // subscribe to selected group (GroupService holds selection)
    this.groupsService.selectedGroup$.subscribe(g => {
      this.selectedGroupId = g?.id ?? null;
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    const groupIdParam = this.route.snapshot.paramMap.get('groupId');
    if (groupIdParam) this.selectedGroupId = Number(groupIdParam);

    if (idParam) {
      this.editMode = true;
      this.transactionId = Number(idParam);
      if (this.selectedGroupId) {
        this.loading = true;
        this.transactionService.getById(this.selectedGroupId, this.transactionId).subscribe({
          next: (t: Transaction) => {
            this.transactionForm.patchValue({
              type: t.type,
              category: t.category,
              amount: (t.amount ?? 0).toFixed(2),
              createdAt: t.createdAt ? this.formatDateForInput(new Date(t.createdAt)) : this.formatDateForInput(new Date())
            });
            this.updateAvailableCategories(t.type);
            this.loading = false;
          },
          error: (err) => {
            this.error = err?.message || 'Failed to load transaction';
            this.loading = false;
          }
        });
      }
    }
  }

  updateAvailableCategories(type?: string | null): void {
    const t = (type ?? 'expense').toLowerCase();
    this.availableCategories = t === 'income' ? this.incomeCategories : this.expenseCategories;
    const first = this.availableCategories.length ? this.availableCategories[0] : '';
    this.transactionForm.patchValue({ category: first }, { emitEvent: false });
  }

  onTypeChange(): void {
    const type = this.transactionForm.get('type')?.value ?? 'expense';
    this.updateAvailableCategories(type);
  }

  onAmountInput(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    input.value = input.value.replace(/[^\d.,-]/g, '');
    this.transactionForm.get('amount')?.setValue(input.value, { emitEvent: false });
  }

  formatAmount(): void {
    const control = this.transactionForm.get('amount');
    if (!control) return;
    const raw = String(control.value || '0').replace(',', '.');
    const num = parseFloat(raw);
    control.setValue(isNaN(num) ? '0.00' : num.toFixed(2), { emitEvent: false });
  }

  private formatDateForInput(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }

  cancel(): void {
    const gid = this.groupsService.currentSelected?.id ?? this.selectedGroupId;
    if (gid) this.router.navigate(['/groups', gid, 'transactions']);
    else this.router.navigate(['/groups']);
  }

  onSubmit(): void {
    if (this.transactionForm.invalid) return;
    const gid = this.groupsService.currentSelected?.id ?? this.selectedGroupId;
    if (!gid) { alert('Select a group first'); return; }

    // build payload with correct types
    const raw = this.transactionForm.value;
    const payload: Partial<Transaction> = {
      type: String(raw.type),
      amount: parseFloat(String(raw.amount).replace(',', '.')),
      category: String(raw.category),
      createdAt: new Date(raw.createdAt)
    };

    if (this.editMode && this.transactionId) {
      this.transactionService.update(gid, this.transactionId, payload).subscribe(() => {
        this.router.navigate(['/groups', gid, 'transactions']);
      }, () => alert('Failed to update transaction'));
    } else {
      this.transactionService.create(gid, payload).subscribe(() => {
        this.router.navigate(['/groups', gid, 'transactions']);
      }, () => alert('Failed to create transaction'));
    }
  }
}