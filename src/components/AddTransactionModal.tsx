import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { TransactionType, Category } from '../types';
import { CATEGORY_ICONS, CATEGORY_COLORS, EXPENSE_CATEGORIES, INCOME_CATEGORIES, INVESTMENT_CATEGORIES } from '../constants';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

interface AddTransactionModalProps {
  onClose: () => void;
  onAdd: (t: { description: string; amount: number; type: TransactionType; category: Category; date: string }) => void;
}

export default function AddTransactionModal({ onClose, onAdd }: AddTransactionModalProps) {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Aluguel');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : type === 'income' ? INCOME_CATEGORIES : INVESTMENT_CATEGORIES;

  // Ensure selected category is valid for type when switching types
  React.useEffect(() => {
    if (type === 'expense' && !EXPENSE_CATEGORIES.includes(category as any)) {
      setCategory('Aluguel');
    } else if (type === 'income' && !INCOME_CATEGORIES.includes(category as any)) {
      setCategory('Salário');
    } else if (type === 'investment' && !INVESTMENT_CATEGORIES.includes(category as any)) {
      setCategory('Cripto');
    }
  }, [type, category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !category || !date) return;
    
    const numAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(numAmount) || numAmount <= 0) return;

    onAdd({
      type,
      amount: numAmount,
      description,
      category,
      date
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
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Nova Transação</h2>
            <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 pb-24 md:pb-6 space-y-6">
            
            {/* Type Toggle */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl transition-colors duration-300">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={cn(
                  "flex-1 py-3 text-sm font-semibold rounded-xl transition-all",
                  type === 'expense' ? "bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-500 shadow-sm" : "text-slate-500 dark:text-slate-400"
                )}
              >
                Despesa
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={cn(
                  "flex-1 py-3 text-sm font-semibold rounded-xl transition-all",
                  type === 'income' ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-500 shadow-sm" : "text-slate-500 dark:text-slate-400"
                )}
              >
                Receita
              </button>
              <button
                type="button"
                onClick={() => setType('investment')}
                className={cn(
                  "flex-1 py-3 text-sm font-semibold rounded-xl transition-all",
                  type === 'investment' ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-500 shadow-sm" : "text-slate-500 dark:text-slate-400"
                )}
              >
                Investimento
              </button>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Valor</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-medium text-xl">R$</span>
                <input 
                  type="number" 
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0,00"
                  className={cn(
                    "w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-3xl font-bold focus:outline-none focus:ring-2 transition-shadow",
                    type === 'expense' ? "text-rose-600 dark:text-rose-500 focus:ring-rose-500/20 focus:border-rose-500" : 
                    type === 'income' ? "text-emerald-600 dark:text-emerald-500 focus:ring-emerald-500/20 focus:border-emerald-500" :
                    "text-indigo-600 dark:text-indigo-500 focus:ring-indigo-500/20 focus:border-indigo-500"
                  )}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Descrição</label>
              <input 
                type="text" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Supermercado Extra"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-4 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 dark:focus:border-slate-500 transition-shadow"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Data</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-4 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 dark:focus:border-slate-500 transition-shadow"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Categoria</label>
              <div className="grid grid-cols-4 gap-3">
                {categories.map(cat => {
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
                className={cn(
                  "w-full py-4 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-2 shadow-xl transition-transform active:scale-95",
                  type === 'expense' ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/30" : 
                  type === 'income' ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30" :
                  "bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/30"
                )}
              >
                <Check size={24} />
                Salvar Transação
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
