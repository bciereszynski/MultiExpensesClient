# MultiExpenses — MultiExpensesClient

Lightweight Angular client for managing group expenses. Provides transaction listing, add/edit flows and summary cards (income / expenses / balance).

## Built with
- Angular (TypeScript)
- Bootstrap 5 (CSS)
- Bootstrap Icons
- REST-based Service

## Features
- List transactions
- Summary cards: total income, total expenses, balance
- Login / Signup
- Responsive header and footer

## Repo structure (src)
- app/
  - components/
  - models/
  - services/
  - app.routes.ts, app.ts, app.config.ts
- index.html, main.ts, styles.css

## Prerequisites
- Node.js (>= 14)
- npm
- (optional) Angular CLI for development: `npm install -g @angular/cli`

## Setup & run (development)
1. Clone
   - git clone <repo-url>
   - cd MultiExpensesClient

2. Install
   - npm install

3. Run dev server
   - With Angular CLI: `ng serve --open`
   - Or (if package.json scripts exist): `npm start`

4. Build for production
   - `ng build --configuration production` or `npm run build`

## Backend / API
- The client uses an .Net API - https://github.com/bciereszynski/MultiExpensesAPI
