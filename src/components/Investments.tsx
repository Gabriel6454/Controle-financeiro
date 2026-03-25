import React, { useMemo, useState } from 'react';
import { Transaction } from '../types';
import { formatCurrency, CATEGORY_COLORS, CATEGORY_ICONS } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, Calculator } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Simulator from './Simulator';
import { cn } from '../lib/utils';

interface InvestmentsProps {
  transactions: Transaction[];
}

export default function Investments({ transactions }: InvestmentsProps) {
  const [view, setView] = useState<'portfolio' | 'simulator'>('portfolio');

  const investmentTransactions = useMemo(() => 
    transactions.filter(t => t.type === 'investment').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  [transactions]);

  const totalInvested = useMemo(() => 
    investmentTransactions.reduce((acc, t) => acc + t.amount, 0),
  [investmentTransactions]);

  const investmentsByCategory = useMemo(() => {
    const byCategory: Record<string, number> = {};
    investmentTransactions.forEach(t => {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    });
    return Object.entries(byCategory)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [investmentTransactions]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm font-semibold">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.payload?.fill }} />
              <span className="text-slate-700 dark:text-slate-200">{entry.name}:</span>
              <span className="text-slate-900 dark:text-white">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Toggle View */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl w-full max-w-md mx-auto mb-2">
        <button
          onClick={() => setView('portfolio')}
          className={cn("flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2", view === 'portfolio' ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}
        >
          <TrendingUp size={16} />
          Minha Carteira
        </button>
        <button
          onClick={() => setView('simulator')}
          className={cn("flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2", view === 'simulator' ? "bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}
        >
          <Calculator size={16} />
          Simulador
        </button>
      </div>

      {view === 'portfolio' ? (
        <>
          {/* Header Card */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full opacity-10 blur-3xl -mr-10 -mt-10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp size={24} className="text-emerald-200" />
            <h2 className="text-xl font-bold">Patrimônio Investido</h2>
          </div>
          <p className="text-emerald-100 text-sm mb-4">Total acumulado em investimentos</p>
          <h3 className="text-4xl font-bold tracking-tight">{formatCurrency(totalInvested)}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Distribuição</h3>
          {investmentsByCategory.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={investmentsByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {investmentsByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS] || '#cbd5e1'} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400">
              <p>Nenhum investimento registrado.</p>
            </div>
          )}
        </div>

        {/* Categories List */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Por Categoria</h3>
          <div className="space-y-4">
            {investmentsByCategory.length > 0 ? investmentsByCategory.map((item) => {
              const percentage = totalInvested > 0 ? (item.value / totalInvested) * 100 : 0;
              const color = CATEGORY_COLORS[item.name as keyof typeof CATEGORY_COLORS] || '#cbd5e1';
              const Icon = CATEGORY_ICONS[item.name as keyof typeof CATEGORY_ICONS] || TrendingUp;
              return (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15`, color }}>
                        <Icon size={16} />
                      </div>
                      <span className="font-medium text-slate-700 dark:text-slate-200">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-slate-800 dark:text-slate-100 block">{formatCurrency(item.value)}</span>
                      <span className="text-xs text-slate-500">{percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ width: `${percentage}%`, backgroundColor: color }} 
                    />
                  </div>
                </div>
              );
            }) : (
              <p className="text-center text-slate-500 py-4">Nenhum investimento registrado.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Investments */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Histórico de Investimentos</h3>
        <div className="space-y-3">
          {investmentTransactions.length > 0 ? investmentTransactions.map(t => {
            const Icon = CATEGORY_ICONS[t.category] || TrendingUp;
            const color = CATEGORY_COLORS[t.category] || '#cbd5e1';
            return (
              <div key={t.id} className="flex items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-2xl transition-colors">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15`, color }}>
                  <Icon size={20} />
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{t.description}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{format(parseISO(t.date), "dd 'de' MMM, yyyy", { locale: ptBR })}</p>
                </div>
                <div className="ml-3 text-right">
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-500">+{formatCurrency(t.amount)}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.category}</p>
                </div>
              </div>
            );
          }) : (
            <p className="text-center text-slate-500 py-4">Nenhum investimento registrado.</p>
          )}
        </div>
      </div>
        </>
      ) : (
        <Simulator />
      )}
    </div>
  );
}
