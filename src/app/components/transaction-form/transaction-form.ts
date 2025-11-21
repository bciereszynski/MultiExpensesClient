import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../../services/transactionService';

@Component({
  selector: 'app-transaction-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './transaction-form.html',
  styleUrls: ['./transaction-form.css'],
})
export class TransactionForm implements OnInit {

  transactionForm: FormGroup;
  incomeCategories: string[] = ['Salary', 'Business', 'Investment', 'Gift', 'Other']
  expenseCategories: string[] = ['Food', 'Rent', 'Utilities', 'Entertainment', 'Travel', 'Other'];
  availableCategories: string[] = [];

  editMode: boolean = false;
  transactionId: number | null = null;

  constructor(private fb: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, private transactionService: TransactionService) {
    this.transactionForm = this.fb.group({
      type: ['Expense', Validators.required],
      category: ['', Validators.required],
      amount: [0.00, [Validators.required, Validators.min(0)]],
      createdAt: [this.formatDateForInput(new Date()), Validators.required],
      description: [''],
    });
  }

  formatAmount(): void {
    const control = this.transactionForm.get('amount');
    if (!control) return;
    const raw = control.value;
    if (raw === null || raw === undefined || raw === '') return;
    const num = parseFloat(String(raw).replace(',', '.'));
    if (isNaN(num)) {
      control.setValue('0.00');
      return;
    }
    control.setValue(num.toFixed(2), { emitEvent: false });
  }

  private formatDateForInput(date: Date) {
    return date.toISOString().slice(0, 16);
  }
  updateAvailableCategories(type: string): void {
    if (type === 'Income') {
      this.availableCategories = this.incomeCategories;
    }
    else {
      this.availableCategories = this.expenseCategories;
    }
    const first = this.availableCategories.length ? this.availableCategories[0] : '';
    this.transactionForm.patchValue({ category: first });
  }

  ngOnInit(): void {
    this.updateAvailableCategories(this.transactionForm.get('type')?.value);
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.transactionId = +id;
      this.getTransactionById(this.transactionId);
    }
    this.formatAmount();
  }

  getTransactionById(id: number): void {
    this.transactionService.getById(id).subscribe({
      next: (data) => {
        this.updateAvailableCategories(data.type);
        this.transactionForm.patchValue({
          type: data.type,
          category: data.category,
          amount: data.amount.toFixed(2),
          createdAt: this.formatDateForInput(new Date(data.createdAt)),
        });

      },
      error: (err) => {
        console.error('Error fetching transaction:', err)
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/transactions']);
  }

  onSubmit(): void {
    if (!this.transactionForm.valid) {
      return;
    }
    const transaction = this.transactionForm.value;
    if (this.editMode && this.transactionId) {
      this.transactionService.update(this.transactionId!, transaction).subscribe({
        next: (data) => {
          this.router.navigate(['/transactions']);
        },
        error: (err) => {
          console.error('Error updating transaction:', err);
        }
      });
      return;
    }

    this.transactionService.create(transaction).subscribe((data) => {
      this.router.navigate(['/transactions'])
    });
  }

  onTypeChange(): void {
    this.updateAvailableCategories(this.transactionForm.get('type')?.value);
  }

}