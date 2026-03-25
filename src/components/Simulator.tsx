import React, { useState } from 'react';
import FiiSimulator from './FiiSimulator';
import FixedIncomeSimulator from './FixedIncomeSimulator';
import CryptoSimulator from './CryptoSimulator';
import { Building2, Landmark, Bitcoin } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Simulator() {
  const [activeSim, setActiveSim] = useState<'fii' | 'fixed' | 'crypto'>('fii');

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setActiveSim('fii')}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2",
            activeSim === 'fii' 
              ? "bg-violet-600 text-white" 
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
          )}
        >
          <Building2 size={16} />
          Fundos Imobiliários
        </button>
        <button
          onClick={() => setActiveSim('fixed')}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2",
            activeSim === 'fixed' 
              ? "bg-blue-600 text-white" 
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
          )}
        >
          <Landmark size={16} />
          Renda Fixa
        </button>
        <button
          onClick={() => setActiveSim('crypto')}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2",
            activeSim === 'crypto' 
              ? "bg-amber-500 text-white" 
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
          )}
        >
          <Bitcoin size={16} />
          Criptomoedas
        </button>
      </div>

      <div className="pt-2">
        {activeSim === 'fii' && <FiiSimulator />}
        {activeSim === 'fixed' && <FixedIncomeSimulator />}
        {activeSim === 'crypto' && <CryptoSimulator />}
      </div>
    </div>
  );
}
