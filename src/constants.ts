import { 
  Home, Droplets, Zap, Wifi, ShoppingCart, Bus, Coffee, 
  HeartPulse, DollarSign, Briefcase, MoreHorizontal, 
  TrendingUp, TrendingDown, BookOpen, Store, PiggyBank,
  Bitcoin, LineChart, Building, Landmark
} from 'lucide-react';
import { Category, ExpenseCategory, IncomeCategory, InvestmentCategory } from './types';

export const CATEGORY_COLORS: Record<Category, string> = {
  'Aluguel': '#8b5cf6', // violet-500
  'Água': '#3b82f6', // blue-500
  'Luz': '#eab308', // yellow-500
  'Internet': '#06b6d4', // cyan-500
  'Feira': '#22c55e', // green-500
  'Supermercado': '#16a34a', // green-600
  'Transporte': '#f97316', // orange-500
  'Lazer': '#ec4899', // pink-500
  'Saúde': '#ef4444', // red-500
  'Educação': '#8b5cf6', // violet-500
  'Investimento': '#0ea5e9', // sky-500
  'Cripto': '#f59e0b', // amber-500
  'Ações': '#3b82f6', // blue-500
  'FIIs': '#8b5cf6', // violet-500
  'Renda Fixa': '#10b981', // emerald-500
  'Salário': '#10b981', // emerald-500
  'Freelance': '#14b8a6', // teal-500
  'Outros': '#6b7280', // gray-500
};

export const CATEGORY_ICONS: Record<Category, any> = {
  'Aluguel': Home,
  'Água': Droplets,
  'Luz': Zap,
  'Internet': Wifi,
  'Feira': Store,
  'Supermercado': ShoppingCart,
  'Transporte': Bus,
  'Lazer': Coffee,
  'Saúde': HeartPulse,
  'Educação': BookOpen,
  'Investimento': PiggyBank,
  'Cripto': Bitcoin,
  'Ações': LineChart,
  'FIIs': Building,
  'Renda Fixa': Landmark,
  'Salário': Briefcase,
  'Freelance': DollarSign,
  'Outros': MoreHorizontal,
};

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Aluguel', 'Água', 'Luz', 'Internet', 'Feira', 'Supermercado', 
  'Transporte', 'Lazer', 'Saúde', 'Educação', 'Outros'
];

export const INCOME_CATEGORIES: IncomeCategory[] = [
  'Salário', 'Freelance', 'Outros'
];

export const INVESTMENT_CATEGORIES: InvestmentCategory[] = [
  'Investimento', 'Cripto', 'Ações', 'FIIs', 'Renda Fixa', 'Outros'
];

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};
