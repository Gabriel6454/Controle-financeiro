import React, { useState } from 'react';
import { Reminder } from '../types';
import { CATEGORY_ICONS, CATEGORY_COLORS, formatCurrency } from '../constants';
import { Bell, Plus, Trash2, Power, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RemindersProps {
  reminders: Reminder[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAddClick: () => void;
}

export default function Reminders({ reminders, onToggle, onDelete, onAddClick }: RemindersProps) {
  const currentDay = new Date().getDate();

  const sortedReminders = [...reminders].sort((a, b) => a.dueDate - b.dueDate);

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 text-white shadow-lg shadow-amber-500/20">
        <div className="flex items-center gap-3 mb-2">
          <Bell size={24} className="text-amber-200" />
          <h2 className="text-xl font-bold">Lembretes de Contas</h2>
        </div>
        <p className="text-amber-100 text-sm">
          Gerencie suas contas recorrentes como aluguel, luz e internet para não perder nenhum vencimento.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Suas Contas</h3>
          <button 
            onClick={onAddClick}
            className="text-sm font-medium text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 flex items-center gap-1"
          >
            <Plus size={16} /> Nova
          </button>
        </div>

        {sortedReminders.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 text-center border border-slate-100 dark:border-slate-700 shadow-sm transition-colors duration-300">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} className="text-amber-500 dark:text-amber-400" />
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Nenhum lembrete</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Adicione suas contas fixas para ser lembrado.</p>
            <button 
              onClick={onAddClick}
              className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-colors"
            >
              Adicionar Conta
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sortedReminders.map(reminder => {
              const Icon = CATEGORY_ICONS[reminder.category] || CATEGORY_ICONS['Outros'];
              const color = CATEGORY_COLORS[reminder.category] || CATEGORY_COLORS['Outros'];
              
              // Determine status
              let statusText = '';
              let statusColor = '';
              
              if (!reminder.isActive) {
                statusText = 'Desativado';
                statusColor = 'text-slate-400 bg-slate-100 dark:bg-slate-800';
              } else if (reminder.dueDate === currentDay) {
                statusText = 'Vence hoje!';
                statusColor = 'text-rose-600 bg-rose-100 dark:text-rose-400 dark:bg-rose-500/20';
              } else if (reminder.dueDate < currentDay) {
                statusText = 'Venceu este mês';
                statusColor = 'text-slate-500 bg-slate-100 dark:text-slate-400 dark:bg-slate-800';
              } else {
                const daysLeft = reminder.dueDate - currentDay;
                statusText = `Em ${daysLeft} dia${daysLeft > 1 ? 's' : ''}`;
                statusColor = daysLeft <= 5 
                  ? 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/20' 
                  : 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/20';
              }

              return (
                <div 
                  key={reminder.id} 
                  className={cn(
                    "bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border transition-all duration-300 flex items-center gap-4",
                    reminder.isActive ? "border-slate-100 dark:border-slate-700" : "border-slate-100 dark:border-slate-700 opacity-60"
                  )}
                >
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${color}15`, color: color }}
                  >
                    <Icon size={24} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-100 truncate">{reminder.description}</h4>
                      <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap", statusColor)}>
                        {statusText}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>Dia {reminder.dueDate}</span>
                      <span>•</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(reminder.amount)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      onClick={() => onToggle(reminder.id)}
                      className={cn(
                        "p-2 rounded-full transition-colors",
                        reminder.isActive 
                          ? "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10" 
                          : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                      )}
                      title={reminder.isActive ? "Desativar" : "Ativar"}
                    >
                      <Power size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(reminder.id)}
                      className="p-2 text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-full transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
