import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { GroupsList } from './components/group-list/group-list';
import { TransactionList } from './components/transaction-list/transaction-list';
import { TransactionForm } from './components/transaction-form/transaction-form';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/groups', pathMatch: 'full' },
  { path: 'auth/login', component: Login },
  { path: 'auth/signup', component: Signup },

  { path: 'groups', component: GroupsList, canActivate: [authGuard] },
  
//   { path: 'groups/new', component: GroupForm },
//   { path: 'groups/:groupId/edit', component: GroupForm },

  { path: 'groups/:groupId/transactions', component: TransactionList, canActivate: [authGuard] },
  { path: 'groups/:groupId/transactions/add', component: TransactionForm, canActivate: [authGuard] },
  { path: 'groups/:groupId/transactions/:id/edit', component: TransactionForm, canActivate: [authGuard] },

  { path: '**', redirectTo: '/groups' },
];
