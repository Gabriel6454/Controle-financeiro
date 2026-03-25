import React, { useState } from 'react';
import { Transaction } from '../types';
import { formatCurrency, CATEGORY_ICONS, CATEGORY_COLORS } from '../constants';
import { format, parseISO, isThisWeek, isThisMonth, isThisYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trash2, ListOrdered, Filter, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense' | 'investment'>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month' | 'year'>('all');

  const filteredTransactions = transactions.filter(t => {
    const typeMatch = filter === 'all' || t.type === filter;
    
    if (timeFilter === 'all') return typeMatch;
    
    const tDate = parseISO(t.date);
    let timeMatch = true;
    
    if (timeFilter === 'week') {
      timeMatch = isThisWeek(tDate, { weekStartsOn: 0 });
    } else if (timeFilter === 'month') {
      timeMatch = isThisMonth(tDate);
    } else if (timeFilter === 'year') {
      timeMatch = isThisYear(tDate);
    }
    
    return typeMatch && timeMatch;
  });

  // Group transactions by date
  const grouped = filteredTransactions.reduce((acc, t) => {
    const date = t.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(t);
    return acc;
  }, {} as Record<string, Transaction[]>);

  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-500 p-4 text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 transition-colors duration-300">
          <ListOrdered size={32} className="text-slate-300 dark:text-slate-600" />
        </div>
        <p className="font-medium text-slate-600 dark:text-slate-400">Nenhuma transação</p>
        <p className="text-sm mt-1">Suas receitas, despesas e investimentos aparecerão aqui.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Filter Options */}
      <div className="flex flex-col gap-3 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <Filter size={16} className="text-slate-400 shrink-0 mr-2" />
          {(['all', 'income', 'expense', 'investment'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                filter === f 
                  ? "bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              )}
            >
              {f === 'all' ? 'Todas' : f === 'income' ? 'Receitas' : f === 'expense' ? 'Despesas' : 'Investimentos'}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <Calendar size={16} className="text-slate-400 shrink-0 mr-2" />
          {(['all', 'week', 'month', 'year'] as const).map(f => (
            <button
              key={f}
              onClick={() => setTimeFilter(f)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                timeFilter === f 
                  ? "bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              )}
            >
              {f === 'all' ? 'Todo o período' : f === 'week' ? 'Esta Semana' : f === 'month' ? 'Este Mês' : 'Este Ano'}
            </button>
          ))}
        </div>
      </div>

      {sortedDates.length === 0 ? (
        <div className="text-center py-10 text-slate-500 dark:text-slate-400">
          Nenhuma transação encontrada para este filtro.
        </div>
      ) : (
        sortedDates.map(date => {
        const dayTransactions = grouped[date];
        const dateObj = parseISO(date);
        const isToday = format(new Date(), 'yyyy-MM-dd') === date;
        const isYesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd') === date;
        
        let dateLabel = format(dateObj, "dd 'de' MMMM", { locale: ptBR });
        if (isToday) dateLabel = 'Hoje';
        if (isYesterday) dateLabel = 'Ontem';

        return (
          <div key={date} className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-2">
              {dateLabel}
            </h3>
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
              {dayTransactions.map((t, index) => {
                const Icon = CATEGORY_ICONS[t.category] || CATEGORY_ICONS['Outros'];
                const color = CATEGORY_COLORS[t.category] || CATEGORY_COLORS['Outros'];
                
                return (
                  <div 
                    key={t.id} 
                    className={cn(
                      "flex items-center p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 group",
                      index !== dayTransactions.length - 1 && "border-b border-slate-50 dark:border-slate-700/50"
                    )}
                  >
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${color}15`, color: color }}
                    >
                      <Icon size={24} />
                    </div>
                    
                    <div className="ml-4 flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{t.description}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t.category}</p>
                    </div>
                    
                    <div className="ml-4 text-right flex items-center gap-3">
                      <p className={cn(
                        "text-sm font-bold",
                        t.type === 'income' ? "text-emerald-600 dark:text-emerald-500" : 
                        t.type === 'investment' ? "text-indigo-600 dark:text-indigo-500" :
                        "text-slate-800 dark:text-slate-100"
                      )}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </p>
                      <button 
                        onClick={() => onDelete(t.id)}
                        className="p-2 text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-full transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }))}
    </div>
  );
}
