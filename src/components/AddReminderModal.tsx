import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { ExpenseCategory } from '../types';
import { CATEGORY_ICONS, CATEGORY_COLORS, EXPENSE_CATEGORIES } from '../constants';
import { cn } from '../lib/utils';

interface AddReminderModalProps {
  onClose: () => void;
  onAdd: (r: { description: string; amount: number; category: ExpenseCategory; dueDate: number; isActive: boolean }) => void;
}

export default function AddReminderModal({ onClose, onAdd }: AddReminderModalProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Aluguel');
  const [dueDate, setDueDate] = useState('5');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !category || !dueDate) return;
    
    const numAmount = parseFloat(amount.replace(',', '.'));
    const numDay = parseInt(dueDate, 10);
    
    if (isNaN(numAmount) || numAmount <= 0 || isNaN(numDay) || numDay < 1 || numDay > 31) return;

    onAdd({
      amount: numAmount,
      description,
      category,
      dueDate: numDay,
      isActive: true
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center md:p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative bg-white dark:bg-slate-800 rounded-t-[2.5rem] md:rounded-[2.5rem] h-[85%] md:h-auto md:max-h-[90vh] md:w-full md:max-w-md flex flex-col shadow-2xl transition-colors duration-300"
        >
          <div className="flex justify-center pt-4 pb-2 md:hidden">
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
          </div>
          
          <div className="px-6 pb-4 md:pt-6 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Novo Lembrete</h2>
            <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 pb-24 md:pb-6 space-y-6">
            
            {/* Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Valor Estimado</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-medium text-xl">R$</span>
                <input 
                  type="number" 
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0,00"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-3xl font-bold text-amber-600 dark:text-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-shadow"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Nome da Conta</label>
              <input 
                type="text" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Conta de Luz"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-4 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 dark:focus:border-slate-500 transition-shadow"
                required
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Dia do Vencimento</label>
              <input 
                type="number" 
                min="1"
                max="31"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="Ex: 5"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-4 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 dark:focus:border-slate-500 transition-shadow"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Categoria</label>
              <div className="grid grid-cols-4 gap-3">
                {EXPENSE_CATEGORIES.map(cat => {
                  const Icon = CATEGORY_ICONS[cat];
                  const color = CATEGORY_COLORS[cat];
                  const isSelected = category === cat;
                  
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all gap-2",
                        isSelected ? "border-transparent shadow-md" : "border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
                      )}
                      style={isSelected ? { backgroundColor: `${color}15`, borderColor: color } : {}}
                    >
                      <div style={{ color: isSelected ? color : '#94a3b8' }}>
                        <Icon size={24} />
                      </div>
                      <span className={cn(
                        "text-[10px] font-semibold truncate w-full text-center",
                        isSelected ? "text-slate-800 dark:text-slate-100" : "text-slate-400 dark:text-slate-500"
                      )}>
                        {cat}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 pb-safe">
              <button
                type="submit"
                className="w-full py-4 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-2 shadow-xl transition-transform active:scale-95 bg-amber-500 hover:bg-amber-600 shadow-amber-500/30"
              >
                <Check size={24} />
                Salvar Lembrete
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
