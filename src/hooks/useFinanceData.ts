import { useState, useEffect } from 'react';
import { Transaction, Budget, Reminder } from '../types';

export function useFinanceData() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('finance_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('finance_budgets');
    return saved ? JSON.parse(saved) : [];
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('finance_reminders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finance_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('finance_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newT = { ...t, id: crypto.randomUUID() };
    setTransactions(prev => [newT, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const setBudget = (category: string, limit: number) => {
    setBudgets(prev => {
      const existing = prev.find(b => b.category === category);
      if (existing) {
        return prev.map(b => b.category === category ? { ...b, limit } : b);
      }
      return [...prev, { category: category as any, limit }];
    });
  };

  const addReminder = (r: Omit<Reminder, 'id'>) => {
    const newR = { ...r, id: crypto.randomUUID() };
    setReminders(prev => [...prev, newR]);
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
  };

  return { 
    transactions, budgets, reminders, 
    addTransaction, deleteTransaction, setBudget,
    addReminder, deleteReminder, toggleReminder
  };
}
