import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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


  constructor(private fb: FormBuilder, private router: Router, private transactionService: TransactionService) {
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
  updateAvailableCategories(): void {
    const type = this.transactionForm.get('type')?.value;
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
    this.updateAvailableCategories();
    this.formatAmount();
  }

  cancel(): void {
    this.router.navigate(['/transactions']);
  }

  onSubmit(): void {
    if (!this.transactionForm.valid) {
    }
    const newTransaction = this.transactionForm.value;
    this.transactionService.create(newTransaction).subscribe((data) => {
      this.router.navigate(['/transactions'])
    });
  }

  onTypeChange(): void {
    this.updateAvailableCategories();
  }

}