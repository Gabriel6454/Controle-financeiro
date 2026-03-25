import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency } from '../constants';

interface MonthResult {
  month: number;
  investedValue: number;
  appreciation: number;
  totalBalance: number;
}

interface YearGroup {
  year: number;
  months: MonthResult[];
}

export default function CryptoSimulator() {
  const [initialAmount, setInitialAmount] = useState('0');
  const [monthlyInvestment, setMonthlyInvestment] = useState('200');
  const [annualGrowth, setAnnualGrowth] = useState('30');
  const [term, setTerm] = useState('5');
  const [termType, setTermType] = useState<'years' | 'months'>('years');

  const [results, setResults] = useState<YearGroup[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [expandedYears, setExpandedYears] = useState<number[]>([1]);

  const handleCalculate = () => {
    const initial = parseFloat(initialAmount.replace(/\./g, '').replace(',', '.'));
    const monthly = parseFloat(monthlyInvestment.replace(/\./g, '').replace(',', '.'));
    const growth = parseFloat(annualGrowth.replace(/\./g, '').replace(',', '.'));
    const termVal = parseInt(term, 10);

    if (isNaN(initial) || isNaN(monthly) || isNaN(growth) || isNaN(termVal)) {
      return;
    }

    const totalMonths = termType === 'years' ? termVal * 12 : termVal;
    const monthlyRate = Math.pow(1 + growth / 100, 1 / 12) - 1;
    
    let currentBalance = initial;
    let totalInvested = initial;
    let totalAppreciation = 0;
    
    const allMonths: MonthResult[] = [];

    for (let month = 1; month <= totalMonths; month++) {
      const appreciation = currentBalance * monthlyRate;
      currentBalance += appreciation + monthly;
      
      totalInvested += monthly;
      totalAppreciation += appreciation;
      
      allMonths.push({
        month,
        investedValue: totalInvested,
        appreciation: appreciation,
        totalBalance: currentBalance
      });
    }

    const grouped: YearGroup[] = [];
    for (let i = 0; i < allMonths.length; i += 12) {
      grouped.push({
        year: Math.floor(i / 12) + 1,
        months: allMonths.slice(i, i + 12)
      });
    }

    setResults(grouped);
    setExpandedYears([1]);
    setSummary({
      term: termVal,
      termType,
      growth,
      totalInvested,
      totalAppreciation,
      finalBalance: currentBalance
    });
  };

  const toggleYear = (year: number) => {
    setExpandedYears(prev => 
      prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
    );
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Simulador de Criptomoedas</h2>
        <p className="text-slate-500 dark:text-slate-400">Projete o crescimento do seu portfólio de cripto com base em uma estimativa de valorização anual.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Valor Inicial (R$)</label>
              <input 
                type="text" 
                value={initialAmount} 
                onChange={e => setInitialAmount(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Aporte Mensal (R$)</label>
              <input 
                type="text" 
                value={monthlyInvestment} 
                onChange={e => setMonthlyInvestment(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Crescimento Anual Esperado (%)</label>
              <input 
                type="text" 
                value={annualGrowth} 
                onChange={e => setAnnualGrowth(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Prazo</label>
              <div className="flex">
                <input 
                  type="text" 
                  value={term} 
                  onChange={e => setTerm(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-l-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 transition-all"
                />
                <select 
                  value={termType}
                  onChange={e => setTermType(e.target.value as 'years' | 'months')}
                  className="bg-amber-500 hover:bg-amber-600 transition-colors text-white border-none rounded-r-xl px-4 py-3 focus:ring-0 cursor-pointer outline-none"
                >
                  <option value="years">Anos</option>
                  <option value="months">Meses</option>
                </select>
              </div>
            </div>
          </div>

          <button 
            onClick={handleCalculate}
            className="mt-6 bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-8 rounded-xl transition-colors"
          >
            Calcular
          </button>
        </div>

        {/* Summary Card */}
        {summary && (
          <div className="flex-1 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 text-white shadow-xl">
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-amber-100 text-sm mb-1">Prazo</p>
                <p className="text-xl font-bold">{summary.term} {summary.termType === 'years' ? (summary.term === 1 ? 'Ano' : 'Anos') : (summary.term === 1 ? 'Mês' : 'Meses')}</p>
              </div>
              <div>
                <p className="text-amber-100 text-sm mb-1">Crescimento Anual</p>
                <p className="text-xl font-bold">{summary.growth}%</p>
              </div>
              <div>
                <p className="text-amber-100 text-sm mb-1">Total Investido</p>
                <p className="text-xl font-bold">{formatCurrency(summary.totalInvested)}</p>
              </div>
              <div>
                <p className="text-amber-100 text-sm mb-1">Lucro Estimado</p>
                <p className="text-xl font-bold text-emerald-200">+{formatCurrency(summary.totalAppreciation)}</p>
              </div>
              <div className="col-span-2 pt-4 border-t border-amber-400/30">
                <p className="text-amber-100 text-sm mb-1">Valor Total Final</p>
                <p className="text-3xl font-bold">{formatCurrency(summary.finalBalance)}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Table */}
      {results.length > 0 && (
        <div className="mt-10 space-y-4">
          {results.map((group) => (
            <div key={group.year} className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
              <button 
                onClick={() => toggleYear(group.year)}
                className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <span className="font-semibold text-slate-800 dark:text-slate-100">{group.year}º Ano</span>
                {expandedYears.includes(group.year) ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
              </button>
              
              {expandedYears.includes(group.year) && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50">
                      <tr>
                        <th className="px-4 py-3 font-medium">Mês</th>
                        <th className="px-4 py-3 font-medium">Total Investido</th>
                        <th className="px-4 py-3 font-medium">Valorização no Mês</th>
                        <th className="px-4 py-3 font-medium">Saldo Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.months.map((m) => (
                        <tr key={m.month} className="border-t border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800">
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{m.month}º</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatCurrency(m.investedValue)}</td>
                          <td className="px-4 py-3 text-emerald-600 dark:text-emerald-500">+{formatCurrency(m.appreciation)}</td>
                          <td className="px-4 py-3 text-slate-800 dark:text-slate-100 font-medium">{formatCurrency(m.totalBalance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
