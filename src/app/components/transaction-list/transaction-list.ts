import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../models/transaction';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../services/transactionService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction-list',
  imports: [CommonModule],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.css',
})
export class TransactionList implements OnInit {
  transactions: Transaction[] = [];
  constructor(private transactionService: TransactionService, private router: Router) { }
  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionService
      .getAll()
      .subscribe((data) => {
        this.transactions = data;
      });
  }

  editTransaction(transaction: Transaction): void {
    if (transaction) {
      this.router.navigate(['edit', transaction.id]);
    }
  }
  deleteTransaction(transaction: Transaction): void {
    this.transactionService.delete(transaction.id).subscribe(() => {
      this.loadTransactions();
    });
  }

}
