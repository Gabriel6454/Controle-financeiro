import React, { useState } from 'react';
import { Transaction, Budget, Category } from '../types';
import { EXPENSE_CATEGORIES, INVESTMENT_CATEGORIES, CATEGORY_ICONS, CATEGORY_COLORS, formatCurrency } from '../constants';
import { format, isSameMonth, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Target, Plus, Edit2, PiggyBank, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';

interface BudgetsProps {
  transactions: Transaction[];
  budgets: Budget[];
  onSetBudget: (category: string, limit: number) => void;
}

export default function Budgets({ transactions, budgets, onSetBudget }: BudgetsProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editAmount, setEditAmount] = useState('');

  const currentMonth = new Date();
  
  // Calculate spent per category this month
  const spentByCategory = transactions.reduce((acc, t) => {
    if ((t.type === 'expense' || t.type === 'investment') && isSameMonth(parseISO(t.date), currentMonth)) {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory && editAmount) {
      const limit = parseFloat(editAmount.replace(',', '.'));
      if (!isNaN(limit) && limit > 0) {
        onSetBudget(editingCategory, limit);
      }
    }
    setEditingCategory(null);
    setEditAmount('');
  };

  const regularCategories = EXPENSE_CATEGORIES;
  const investmentCategories = INVESTMENT_CATEGORIES.filter(c => c !== 'Investimento');
  const investmentBudget = budgets.find(b => b.category === 'Investimento');
  const investmentSpent = transactions.reduce((acc, t) => {
    if (t.type === 'investment' && isSameMonth(parseISO(t.date), currentMonth)) {
      return acc + t.amount;
    }
    return acc;
  }, 0);

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-500/20">
        <div className="flex items-center gap-3 mb-2">
          <Target size={24} className="text-indigo-200" />
          <h2 className="text-xl font-bold">Metas e Orçamentos</h2>
        </div>
        <p className="text-indigo-100 text-sm">
          Acompanhe seus limites de gastos e sua meta de investimentos em {format(currentMonth, 'MMMM', { locale: ptBR })}.
        </p>
      </div>

      {/* Investment Goal Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-2">Meta de Investimento</h3>
        
        {editingCategory === 'Investimento' ? (
          <form onSubmit={handleSaveBudget} className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-emerald-100 dark:border-emerald-900/50 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <PiggyBank size={20} />
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-100">Investimento</span>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                value={editAmount}
                onChange={e => setEditAmount(e.target.value)}
                placeholder="Meta em R$"
                className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 dark:text-white transition-colors duration-300"
                autoFocus
              />
              <button type="submit" className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-emerald-600">
                Salvar
              </button>
              <button type="button" onClick={() => setEditingCategory(null)} className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-300">
                Cancelar
              </button>
            </div>
          </form>
        ) : investmentBudget || investmentSpent > 0 ? (
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-emerald-100 dark:border-emerald-900/30 transition-colors duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full opacity-5 blur-3xl -mr-10 -mt-10"></div>
            <div className="flex justify-between items-center mb-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <PiggyBank size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">Investimento</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {investmentBudget ? `${formatCurrency(investmentSpent)} de ${formatCurrency(investmentBudget.limit)}` : `${formatCurrency(investmentSpent)} guardados`}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setEditingCategory('Investimento');
                  setEditAmount(investmentBudget?.limit > 0 ? investmentBudget.limit.toString() : '');
                }}
                className="p-2 text-slate-400 dark:text-slate-500 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-full transition-colors"
              >
                {investmentBudget ? <Edit2 size={16} /> : <Plus size={16} />}
              </button>
            </div>

            {investmentBudget && (
              <div className="mt-3 relative z-10">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Progresso</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {Math.min((investmentSpent / investmentBudget.limit) * 100, 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden transition-colors duration-300">
                  <div 
                    className="h-full rounded-full transition-all duration-500 bg-emerald-500"
                    style={{ width: `${Math.min((investmentSpent / investmentBudget.limit) * 100, 100)}%` }}
                  />
                </div>
                {investmentSpent >= investmentBudget.limit && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium flex items-center gap-1">
                    <TrendingUp size={14} /> Meta atingida! Parabéns!
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => {
              setEditingCategory('Investimento');
              setEditAmount('');
            }}
            className="w-full p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all font-medium"
          >
            <PiggyBank size={20} />
            Definir Meta Geral de Investimento
          </button>
        )}

        {/* Specific Investment Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {investmentCategories.map(category => {
            const budget = budgets.find(b => b.category === category);
            const spent = spentByCategory[category] || 0;
            const Icon = CATEGORY_ICONS[category];
            const color = CATEGORY_COLORS[category];
            
            const hasBudget = !!budget;
            const limit = budget?.limit || 0;
            const percentage = hasBudget ? Math.min((spent / limit) * 100, 100) : 0;
            const isOverBudget = hasBudget && spent >= limit;

            if (editingCategory === category) {
              return (
                <form key={category} onSubmit={handleSaveBudget} className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-emerald-100 dark:border-emerald-900/50 transition-colors duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15`, color }}>
                      <Icon size={20} />
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{category}</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      value={editAmount}
                      onChange={e => setEditAmount(e.target.value)}
                      placeholder="Meta em R$"
                      className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 dark:text-white transition-colors duration-300"
                      autoFocus
                    />
                    <button type="submit" className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-emerald-600">
                      Salvar
                    </button>
                    <button type="button" onClick={() => setEditingCategory(null)} className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-300">
                      Cancelar
                    </button>
                  </div>
                </form>
              );
            }

            if (!hasBudget && spent === 0) return null;

            return (
              <div key={category} className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-300">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15`, color }}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">{category}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {hasBudget ? `${formatCurrency(spent)} de ${formatCurrency(limit)}` : `${formatCurrency(spent)} investidos`}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingCategory(category);
                      setEditAmount(limit > 0 ? limit.toString() : '');
                    }}
                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-full transition-colors"
                  >
                    {hasBudget ? <Edit2 size={16} /> : <Plus size={16} />}
                  </button>
                </div>

                {hasBudget && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Progresso</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        {Math.min((spent / limit) * 100, 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden transition-colors duration-300">
                      <div 
                        className="h-full rounded-full transition-all duration-500 bg-emerald-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    {isOverBudget && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium flex items-center gap-1">
                        <TrendingUp size={14} /> Meta atingida!
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Categories without budget and spend for Investments */}
        {investmentCategories.filter(c => !budgets.find(b => b.category === c) && (spentByCategory[c] || 0) === 0).length > 0 && (
          <div className="pt-2">
            <div className="flex flex-wrap gap-2">
              {investmentCategories.filter(c => !budgets.find(b => b.category === c) && (spentByCategory[c] || 0) === 0).map(category => (
                <button
                  key={category}
                  onClick={() => {
                    setEditingCategory(category);
                    setEditAmount('');
                  }}
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-2"
                >
                  <Plus size={14} />
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Regular Spending Limits Section */}
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-2">Limites de Gastos</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {regularCategories.map(category => {
          const budget = budgets.find(b => b.category === category);
          const spent = spentByCategory[category] || 0;
          const Icon = CATEGORY_ICONS[category];
          const color = CATEGORY_COLORS[category];
          
          const hasBudget = !!budget;
          const limit = budget?.limit || 0;
          const percentage = hasBudget ? Math.min((spent / limit) * 100, 100) : 0;
          const isOverBudget = hasBudget && spent > limit;

          if (editingCategory === category) {
            return (
              <form key={category} onSubmit={handleSaveBudget} className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-indigo-100 dark:border-indigo-900/50 transition-colors duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15`, color }}>
                    <Icon size={20} />
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{category}</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    value={editAmount}
                    onChange={e => setEditAmount(e.target.value)}
                    placeholder="Limite em R$"
                    className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 dark:text-white transition-colors duration-300"
                    autoFocus
                  />
                  <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-600">
                    Salvar
                  </button>
                  <button type="button" onClick={() => setEditingCategory(null)} className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-300">
                    Cancelar
                  </button>
                </div>
              </form>
            );
          }

          if (!hasBudget && spent === 0) return null;

          return (
            <div key={category} className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-300">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15`, color }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">{category}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {hasBudget ? `${formatCurrency(spent)} de ${formatCurrency(limit)}` : `${formatCurrency(spent)} gasto`}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setEditingCategory(category);
                    setEditAmount(limit > 0 ? limit.toString() : '');
                  }}
                  className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-full transition-colors"
                >
                  {hasBudget ? <Edit2 size={16} /> : <Plus size={16} />}
                </button>
              </div>

              {hasBudget && (
                <div className="mt-2">
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden transition-colors duration-300">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        isOverBudget ? "bg-rose-500" : percentage > 80 ? "bg-amber-500" : "bg-indigo-500"
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  {isOverBudget && (
                    <p className="text-xs text-rose-500 dark:text-rose-400 mt-2 font-medium">
                      Você ultrapassou o limite em {formatCurrency(spent - limit)}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
        </div>

        {/* Categories without budget and spend */}
        <div className="pt-4">
          <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 pl-2">Adicionar Limite</h3>
          <div className="flex flex-wrap gap-2">
            {regularCategories.filter(c => !budgets.find(b => b.category === c) && (spentByCategory[c] || 0) === 0).map(category => (
              <button
                key={category}
                onClick={() => {
                  setEditingCategory(category);
                  setEditAmount('');
                }}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2"
              >
                <Plus size={14} />
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
