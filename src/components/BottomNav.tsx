import React from 'react';
import { LayoutDashboard, ListOrdered, Target, Plus, Bell, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';

interface BottomNavProps {
  activeTab: 'dashboard' | 'transactions' | 'budgets' | 'reminders' | 'investments';
  onTabChange: (tab: 'dashboard' | 'transactions' | 'budgets' | 'reminders' | 'investments') => void;
  onAddClick: () => void;
}

export default function BottomNav({ activeTab, onTabChange, onAddClick }: BottomNavProps) {
  return (
    <>
      {/* Mobile FAB - Floating above the nav in the center */}
      <button
        onClick={onAddClick}
        className="md:hidden absolute left-1/2 -translate-x-1/2 w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-transform active:scale-95 z-50"
        style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom))' }}
      >
        <Plus size={28} />
      </button>

      <div 
        className="absolute md:relative bottom-0 left-0 right-0 md:w-28 md:h-full bg-white dark:bg-slate-900 border-t md:border-t-0 md:border-r border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:shadow-none dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)] z-40 transition-colors duration-300 flex-shrink-0"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex md:flex-col justify-between md:justify-center items-center md:h-full px-1 sm:px-2 md:px-0 md:py-8 relative md:gap-8 pt-2 pb-2 md:pb-8">
          <NavItem 
            icon={<LayoutDashboard size={22} />} 
            label="Resumo" 
            isActive={activeTab === 'dashboard'} 
            onClick={() => onTabChange('dashboard')} 
          />
          <NavItem 
            icon={<ListOrdered size={22} />} 
            label="Extrato" 
            isActive={activeTab === 'transactions'} 
            onClick={() => onTabChange('transactions')} 
          />
          
          {/* Desktop FAB */}
          <button
            onClick={onAddClick}
            className="hidden md:flex w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full items-center justify-center shadow-lg shadow-emerald-500/30 transition-transform active:scale-95 my-4 shrink-0"
          >
            <Plus size={28} />
          </button>

          <NavItem 
            icon={<TrendingUp size={22} />} 
            label="Investir" 
            isActive={activeTab === 'investments'} 
            onClick={() => onTabChange('investments')} 
          />
          <NavItem 
            icon={<Target size={22} />} 
            label="Metas" 
            isActive={activeTab === 'budgets'} 
            onClick={() => onTabChange('budgets')} 
          />
          <NavItem 
            icon={<Bell size={22} />} 
            label="Lembretes" 
            isActive={activeTab === 'reminders'} 
            onClick={() => onTabChange('reminders')} 
          />
        </div>
      </div>
    </>
  );
}

function NavItem({ icon, label, isActive, onClick, className }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void, className?: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center flex-1 md:w-full h-12 md:h-20 gap-1 transition-colors px-0.5",
        isActive ? "text-emerald-600 dark:text-emerald-500" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300",
        className
      )}
    >
      <div className={cn("transition-transform", isActive ? "scale-110" : "scale-100")}>
        {icon}
      </div>
      <span className="text-[10px] sm:text-[11px] font-medium truncate w-full text-center">{label}</span>
    </button>
  );
}
