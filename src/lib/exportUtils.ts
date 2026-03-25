import { Transaction } from '../types';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from '../constants';

export const exportToCSV = (transactions: Transaction[]) => {
  const headers = ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor'];
  
  const rows = transactions.map(t => {
    const date = format(parseISO(t.date), 'dd/MM/yyyy');
    const type = t.type === 'income' ? 'Receita' : 'Despesa';
    const amount = t.amount.toString().replace('.', ',');
    
    return [date, t.description, t.category, type, amount];
  });

  const csvContent = [
    headers.join(';'),
    ...rows.map(e => e.join(';'))
  ].join('\n');

  // Add BOM for UTF-8 to ensure Excel reads special characters correctly
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `relatorio_financeiro_${format(new Date(), 'yyyyMMdd')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (transactions: Transaction[]) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text('Relatório Financeiro', 14, 22);
  
  // Date
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`Gerado em: ${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`, 14, 30);

  // Summary
  const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = income - expense;

  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text(`Receitas: ${formatCurrency(income)}`, 14, 42);
  doc.text(`Despesas: ${formatCurrency(expense)}`, 14, 48);
  doc.text(`Saldo Total: ${formatCurrency(balance)}`, 14, 54);

  // Table Data
  const tableData = transactions.map(t => [
    format(parseISO(t.date), 'dd/MM/yyyy'),
    t.description,
    t.category,
    t.type === 'income' ? 'Receita' : 'Despesa',
    formatCurrency(t.amount)
  ]);

  // Generate Table
  autoTable(doc, {
    startY: 62,
    head: [['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229] }, // Indigo 600
    styles: { font: 'helvetica', fontSize: 9 },
    alternateRowStyles: { fillColor: [248, 250, 252] }, // slate-50
  });

  doc.save(`relatorio_financeiro_${format(new Date(), 'yyyyMMdd')}.pdf`);
};
