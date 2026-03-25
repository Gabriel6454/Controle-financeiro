import { useState } from 'react';
import { useFinanceData } from './hooks/useFinanceData';
import { useTheme } from './hooks/useTheme';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import Budgets from './components/Budgets';
import Reminders from './components/Reminders';
import Investments from './components/Investments';
import AddTransactionModal from './components/AddTransactionModal';
import AddReminderModal from './components/AddReminderModal';
import BottomNav from './components/BottomNav';
import { Moon, Sun, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { exportToCSV, exportToPDF } from './lib/exportUtils';

export default function App() {
  const { transactions, budgets, reminders, addTransaction, deleteTransaction, setBudget, addReminder, deleteReminder, toggleReminder } = useFinanceData();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'budgets' | 'reminders' | 'investments'>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddReminderModalOpen, setIsAddReminderModalOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <div className="min-h-screen bg-slate-200 dark:bg-slate-950 flex items-center justify-center p-0 sm:p-4 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="w-full h-full sm:h-[90vh] sm:max-h-[850px] max-w-md md:max-w-4xl lg:max-w-5xl sm:rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col md:flex-row relative sm:border-8 border-slate-800 dark:border-slate-800 transition-colors duration-300">
        
        {/* Bottom Navigation -> Side Navigation on MD */}
        <BottomNav 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          onAddClick={() => setIsAddModalOpen(true)} 
        />

        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Header / Top Bar */}
          <div className="pt-12 md:pt-8 pb-4 px-6 bg-slate-900 dark:bg-slate-950 text-white md:rounded-bl-3xl shadow-md z-10 flex justify-between items-center transition-colors duration-300">
            <h1 className="text-xl font-bold tracking-wide">
              {activeTab === 'dashboard' && 'Resumo Financeiro'}
              {activeTab === 'transactions' && 'Extrato'}
              {activeTab === 'investments' && 'Investimentos'}
              {activeTab === 'budgets' && 'Metas e Orçamentos'}
              {activeTab === 'reminders' && 'Lembretes'}
            </h1>
          <div className="flex items-center gap-2 relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="p-2 bg-slate-800 dark:bg-slate-800 hover:bg-slate-700 rounded-full transition-colors text-slate-300"
              aria-label="Exportar relatório"
            >
              <Download size={20} />
            </button>
            
            {showExportMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
                <div className="absolute top-full right-12 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
                  <button 
                    onClick={() => { exportToPDF(transactions); setShowExportMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <FileText size={18} className="text-rose-500" />
                    Exportar PDF
                  </button>
                  <div className="h-px bg-slate-100 dark:bg-slate-700" />
                  <button 
                    onClick={() => { exportToCSV(transactions); setShowExportMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <FileSpreadsheet size={18} className="text-emerald-500" />
                    Exportar CSV
                  </button>
                </div>
              </>
            )}

            <button 
              onClick={toggleTheme} 
              className="p-2 bg-slate-800 dark:bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
              aria-label="Alternar tema"
            >
              {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-indigo-300" />}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-32 md:pb-8 relative scroll-smooth">
          {activeTab === 'dashboard' && <Dashboard transactions={transactions} reminders={reminders} />}
          {activeTab === 'transactions' && <TransactionList transactions={transactions} onDelete={deleteTransaction} />}
          {activeTab === 'investments' && <Investments transactions={transactions} />}
          {activeTab === 'budgets' && <Budgets transactions={transactions} budgets={budgets} onSetBudget={setBudget} />}
          {activeTab === 'reminders' && <Reminders reminders={reminders} onToggle={toggleReminder} onDelete={deleteReminder} onAddClick={() => setIsAddReminderModalOpen(true)} />}
        </main>
        </div>

        {/* Modals */}
        {isAddModalOpen && (
          <AddTransactionModal 
            onClose={() => setIsAddModalOpen(false)} 
            onAdd={addTransaction} 
          />
        )}
        {isAddReminderModalOpen && (
          <AddReminderModal 
            onClose={() => setIsAddReminderModalOpen(false)} 
            onAdd={addReminder} 
          />
        )}
      </div>
    </div>
  );
}
