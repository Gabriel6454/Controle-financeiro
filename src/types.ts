export type TransactionType = 'income' | 'expense' | 'investment';

export type ExpenseCategory = 
  | 'Aluguel' 
  | 'Água' 
  | 'Luz' 
  | 'Internet' 
  | 'Feira' 
  | 'Supermercado'
  | 'Transporte' 
  | 'Lazer' 
  | 'Saúde' 
  | 'Educação'
  | 'Outros';

export type IncomeCategory = 
  | 'Salário' 
  | 'Freelance' 
  | 'Outros';

export type InvestmentCategory = 
  | 'Investimento'
  | 'Cripto'
  | 'Ações'
  | 'FIIs'
  | 'Renda Fixa'
  | 'Outros';

export type Category = ExpenseCategory | IncomeCategory | InvestmentCategory;

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string; // YYYY-MM-DD format
}

export interface Budget {
  category: Category;
  limit: number;
}

export interface Reminder {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  dueDate: number; // Day of the month (1-31)
  isActive: boolean;
}
