import React, { useState } from 'react';
import { Calculator, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency } from '../constants';
import { cn } from '../lib/utils';

interface MonthResult {
  month: number;
  quotas: number;
  investedValue: number;
  reinvestment: number;
  dividend: number;
}

interface YearGroup {
  year: number;
  months: MonthResult[];
}

export default function FiiSimulator() {
  const [quotaPrice, setQuotaPrice] = useState('80,78');
  const [lastYield, setLastYield] = useState('1,21');
  const [monthlyInvestment, setMonthlyInvestment] = useState('1000');
  const [term, setTerm] = useState('1');
  const [termType, setTermType] = useState<'years' | 'months'>('years');
  const [initialQuotas, setInitialQuotas] = useState('0');
  const [reinvest, setReinvest] = useState(true);

  const [results, setResults] = useState<YearGroup[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [expandedYears, setExpandedYears] = useState<number[]>([1]);

  const handleCalculate = () => {
    const price = parseFloat(quotaPrice.replace(/\./g, '').replace(',', '.'));
    const yieldVal = parseFloat(lastYield.replace(/\./g, '').replace(',', '.'));
    const monthly = parseFloat(monthlyInvestment.replace(/\./g, '').replace(',', '.'));
    const termVal = parseInt(term, 10);
    const initial = parseInt(initialQuotas, 10);

    if (isNaN(price) || isNaN(yieldVal) || isNaN(monthly) || isNaN(termVal) || isNaN(initial)) {
      return;
    }

    const totalMonths = termType === 'years' ? termVal * 12 : termVal;
    
    let currentQuotas = initial;
    let leftover = 0;
    let totalInvested = 0;
    let totalReinvested = 0;
    
    const allMonths: MonthResult[] = [];

    for (let month = 1; month <= totalMonths; month++) {
      let availableMoney = monthly + leftover;
      let quotasBought = Math.floor(availableMoney / price);
      
      let cost = quotasBought * price;
      leftover = availableMoney - cost;
      
      currentQuotas += quotasBought;
      
      let dividend = currentQuotas * yieldVal;
      
      let reinvestment = 0;
      if (reinvest) {
        reinvestment = leftover + dividend;
        leftover = reinvestment;
      } else {
        reinvestment = leftover;
        leftover = reinvestment;
      }
      
      totalInvested += monthly;
      totalReinvested += dividend;
      
      allMonths.push({
        month,
        quotas: currentQuotas,
        investedValue: monthly,
        reinvestment,
        dividend
      });
    }

    // Group by year
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
      price,
      yieldVal,
      totalInvested,
      totalReinvested,
      finalDividend: allMonths.length > 0 ? allMonths[allMonths.length - 1].dividend : 0
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
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Simulador de Fundos Imobiliários</h2>
        <p className="text-slate-500 dark:text-slate-400">Preencha os valores e veja em quanto tempo você terá o rendimento desejado!</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Preço da cota</label>
              <input 
                type="text" 
                value={quotaPrice} 
                onChange={e => setQuotaPrice(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-violet-500 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Último rendimento</label>
              <input 
                type="text" 
                value={lastYield} 
                onChange={e => setLastYield(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-violet-500 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Investimento mensal</label>
              <input 
                type="text" 
                value={monthlyInvestment} 
                onChange={e => setMonthlyInvestment(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-violet-500 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Prazo</label>
              <div className="flex">
                <input 
                  type="text" 
                  value={term} 
                  onChange={e => setTerm(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-l-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-violet-500 transition-all"
                />
                <select 
                  value={termType}
                  onChange={e => setTermType(e.target.value as 'years' | 'months')}
                  className="bg-violet-600 hover:bg-violet-700 transition-colors text-white border-none rounded-r-xl px-4 py-3 focus:ring-0 cursor-pointer outline-none"
                >
                  <option value="years">Anos</option>
                  <option value="months">Meses</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Qtde de cotas inicial</label>
              <input 
                type="text" 
                value={initialQuotas} 
                onChange={e => setInitialQuotas(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-violet-500 transition-all"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer mt-4">
            <input 
              type="checkbox" 
              checked={reinvest}
              onChange={e => setReinvest(e.target.checked)}
              className="w-5 h-5 rounded text-violet-600 focus:ring-violet-500 border-slate-300 bg-slate-100 dark:bg-slate-800 dark:border-slate-700"
            />
            <span className="text-sm text-slate-500 dark:text-slate-400">Reinvestir dividendos ganhos e o que sobrar do investimento mensal</span>
          </label>

          <button 
            onClick={handleCalculate}
            className="mt-6 bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 px-8 rounded-xl transition-colors"
          >
            Calcular
          </button>
        </div>

        {/* Summary Card */}
        {summary && (
          <div className="flex-1 bg-violet-700 rounded-3xl p-6 text-white shadow-xl">
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-violet-200 text-sm mb-1">Prazo</p>
                <p className="text-xl font-bold">{summary.term} {summary.termType === 'years' ? (summary.term === 1 ? 'Ano' : 'Anos') : (summary.term === 1 ? 'Mês' : 'Meses')}</p>
              </div>
              <div>
                <p className="text-violet-200 text-sm mb-1">Preço</p>
                <p className="text-xl font-bold">{formatCurrency(summary.price)}</p>
              </div>
              <div>
                <p className="text-violet-200 text-sm mb-1">Último rendimento</p>
                <p className="text-xl font-bold">{formatCurrency(summary.yieldVal)}</p>
              </div>
              <div>
                <p className="text-violet-200 text-sm mb-1">Total Investido</p>
                <p className="text-xl font-bold">{formatCurrency(summary.totalInvested)}</p>
              </div>
              <div>
                <p className="text-violet-200 text-sm mb-1">Total Reinvestido</p>
                <p className="text-xl font-bold">{formatCurrency(summary.totalReinvested)}</p>
              </div>
              <div>
                <p className="text-violet-200 text-sm mb-1">Dividendos mensais no final</p>
                <p className="text-xl font-bold">{formatCurrency(summary.finalDividend)}</p>
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
                        <th className="px-4 py-3 font-medium">Cotas</th>
                        <th className="px-4 py-3 font-medium">Valor Investido</th>
                        <th className="px-4 py-3 font-medium">Reinvestimento</th>
                        <th className="px-4 py-3 font-medium">Dividendo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.months.map((m) => (
                        <tr key={m.month} className="border-t border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800">
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{m.month}º</td>
                          <td className="px-4 py-3 text-slate-800 dark:text-slate-100 font-medium">{m.quotas}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatCurrency(m.investedValue)}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatCurrency(m.reinvestment)}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatCurrency(m.dividend)}</td>
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
