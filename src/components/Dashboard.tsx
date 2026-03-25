import React, { useMemo } from 'react';
import { Transaction } from '../types';
import { formatCurrency, CATEGORY_COLORS } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { ArrowDownCircle, ArrowUpCircle, Wallet, TrendingUp, BellRing } from 'lucide-react';
import { format, isSameMonth, parseISO, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Reminder } from '../types';
import { cn } from '../lib/utils';

interface DashboardProps {
  transactions: Transaction[];
  reminders: Reminder[];
}

export default function Dashboard({ transactions, reminders }: DashboardProps) {
  const currentMonth = new Date();
  const prevMonth = subMonths(currentMonth, 1);

  const { income, expense, investment, balance, prevIncome, prevExpense, prevInvestment, expensesByCategory, topCategories } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    let inv = 0;
    let pInc = 0;
    let pExp = 0;
    let pInv = 0;
    const byCategory: Record<string, number> = {};

    transactions.forEach(t => {
      const tDate = parseISO(t.date);
      if (isSameMonth(tDate, currentMonth)) {
        if (t.type === 'income') {
          inc += t.amount;
        } else if (t.type === 'expense') {
          exp += t.amount;
          byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
        } else if (t.type === 'investment') {
          inv += t.amount;
        }
      } else if (isSameMonth(tDate, prevMonth)) {
        if (t.type === 'income') {
          pInc += t.amount;
        } else if (t.type === 'expense') {
          pExp += t.amount;
        } else if (t.type === 'investment') {
          pInv += t.amount;
        }
      }
    });

    const chartData = Object.entries(byCategory)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return { 
      income: inc, 
      expense: exp, 
      investment: inv,
      balance: inc - exp - inv, 
      prevIncome: pInc,
      prevExpense: pExp,
      prevInvestment: pInv,
      expensesByCategory: chartData,
      topCategories: chartData.slice(0, 5)
    };
  }, [transactions]);

  const monthName = format(currentMonth, 'MMMM', { locale: ptBR });
  const prevMonthName = format(prevMonth, 'MMM', { locale: ptBR });
  const currentMonthShort = format(currentMonth, 'MMM', { locale: ptBR });
  const currentDay = currentMonth.getDate();

  // Get upcoming active reminders (due in the next 5 days or today)
  const upcomingReminders = reminders
    .filter(r => r.isActive && r.dueDate >= currentDay && r.dueDate <= currentDay + 5)
    .sort((a, b) => a.dueDate - b.dueDate);

  const comparisonData = [
    { name: prevMonthName.charAt(0).toUpperCase() + prevMonthName.slice(1), Receitas: prevIncome, Despesas: prevExpense, Investimentos: prevInvestment },
    { name: currentMonthShort.charAt(0).toUpperCase() + currentMonthShort.slice(1), Receitas: income, Despesas: expense, Investimentos: investment }
  ];

  // Custom tooltip for dark mode support and better formatting
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700">
          {label && <p className="text-slate-500 dark:text-slate-400 text-xs mb-2 font-medium">{label}</p>}
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
    <div className="p-4 md:p-8 space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
      {/* Balance Card */}
      <div className="md:col-span-2 bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full opacity-10 blur-3xl -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500 rounded-full opacity-10 blur-2xl -ml-10 -mb-10"></div>
        
        <div className="relative z-10">
          <p className="text-slate-400 text-sm font-medium mb-1 capitalize">Saldo de {monthName}</p>
          <h2 className="text-4xl font-bold tracking-tight mb-6">{formatCurrency(balance)}</h2>
          
          <div className="flex gap-2 md:gap-4">
            <div className="flex-1 bg-white/10 rounded-2xl p-2 md:p-3 flex items-center gap-2 md:gap-3 backdrop-blur-sm">
              <div className="bg-emerald-500/20 p-1.5 md:p-2 rounded-full text-emerald-400 shrink-0">
                <ArrowUpCircle size={18} className="md:w-5 md:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] md:text-[10px] text-slate-300 uppercase tracking-wider font-semibold truncate">Receitas</p>
                <p className="text-xs md:text-sm font-semibold truncate">{formatCurrency(income)}</p>
              </div>
            </div>
            <div className="flex-1 bg-white/10 rounded-2xl p-2 md:p-3 flex items-center gap-2 md:gap-3 backdrop-blur-sm">
              <div className="bg-rose-500/20 p-1.5 md:p-2 rounded-full text-rose-400 shrink-0">
                <ArrowDownCircle size={18} className="md:w-5 md:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] md:text-[10px] text-slate-300 uppercase tracking-wider font-semibold truncate">Despesas</p>
                <p className="text-xs md:text-sm font-semibold truncate">{formatCurrency(expense)}</p>
              </div>
            </div>
            <div className="flex-1 bg-white/10 rounded-2xl p-2 md:p-3 flex items-center gap-2 md:gap-3 backdrop-blur-sm">
              <div className="bg-indigo-500/20 p-1.5 md:p-2 rounded-full text-indigo-400 shrink-0">
                <TrendingUp size={18} className="md:w-5 md:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] md:text-[10px] text-slate-300 uppercase tracking-wider font-semibold truncate">Investido</p>
                <p className="text-xs md:text-sm font-semibold truncate">{formatCurrency(investment)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lembretes Próximos */}
      {upcomingReminders.length > 0 && (
        <div className="md:col-span-2 lg:col-span-1 bg-amber-50 dark:bg-amber-500/10 rounded-3xl p-5 shadow-sm border border-amber-100 dark:border-amber-500/20 transition-colors duration-300">
          <div className="flex items-center gap-2 mb-4">
            <BellRing className="text-amber-500" size={20} />
            <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100">Contas Próximas</h3>
          </div>
          <div className="space-y-3">
            {upcomingReminders.map(reminder => {
              const isToday = reminder.dueDate === currentDay;
              return (
                <div key={reminder.id} className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <span className="font-bold text-sm">{reminder.dueDate}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{reminder.description}</p>
                      <p className={cn("text-xs font-medium", isToday ? "text-rose-500" : "text-amber-600 dark:text-amber-400")}>
                        {isToday ? 'Vence hoje!' : `Vence em ${reminder.dueDate - currentDay} dia(s)`}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{formatCurrency(reminder.amount)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Comparativo Receitas x Despesas */}
      <div className={cn(
        "bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-300",
        upcomingReminders.length > 0 ? "md:col-span-2 lg:col-span-1" : "md:col-span-2"
      )}>
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-indigo-500" size={20} />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Balanço do Mês</h3>
        </div>
        
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#64748b" opacity={0.15} />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(value) => `R$ ${value}`} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.05)' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="Receitas" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={40} />
              <Bar dataKey="Despesas" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={40} />
              <Bar dataKey="Investimentos" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Maiores Gastos */}
      <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-300">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="text-indigo-500" size={20} />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Maiores Gastos</h3>
        </div>
        
        {expensesByCategory.length > 0 ? (
          <>
            <div className="h-48 w-full mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS] || '#cbd5e1'} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 space-y-4">
              {topCategories.map((item) => {
                const percentage = expense > 0 ? (item.value / expense) * 100 : 0;
                const color = CATEGORY_COLORS[item.name as keyof typeof CATEGORY_COLORS] || '#cbd5e1';
                return (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                        <span className="font-medium text-slate-700 dark:text-slate-200">{item.name}</span>
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-100">{formatCurrency(item.value)}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%`, backgroundColor: color }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
            <Wallet size={48} className="mb-2 opacity-20" />
            <p className="text-sm">Nenhum gasto este mês</p>
          </div>
        )}
      </div>
    </div>
  );
}
