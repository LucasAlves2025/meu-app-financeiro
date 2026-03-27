/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  PieChart, 
  RefreshCcw, 
  ArrowDownRight,
  Calculator,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';

// --- Types ---
interface FinancialData {
  faturamentoBruto: number;
  custosFixos: number;
  custosVariaveis: number;
  numeroAssociados: number;
}

const INITIAL_DATA: FinancialData = {
  faturamentoBruto: 0,
  custosFixos: 0,
  custosVariaveis: 0,
  numeroAssociados: 0,
};

// --- Components ---

const KpiCard = ({ title, value, icon: Icon, description, colorClass = "text-slate-900" }: { 
  title: string; 
  value: string; 
  icon: any; 
  description?: string;
  colorClass?: string;
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2"
  >
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</span>
      <div className={`p-2 rounded-lg bg-slate-50 ${colorClass}`}>
        <Icon size={20} />
      </div>
    </div>
    <div className="flex flex-col">
      <span className={`text-2xl font-bold ${colorClass}`}>{value}</span>
      {description && <span className="text-xs text-slate-400 mt-1">{description}</span>}
    </div>
  </motion.div>
);

const InputField = ({ label, id, value, onChange, placeholder, icon: Icon }: {
  label: string;
  id: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: any;
}) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="text-sm font-semibold text-slate-700 flex items-center gap-2">
      <Icon size={16} className="text-slate-400" />
      {label}
    </label>
    <div className="relative">
      <input
        type="number"
        id={id}
        value={value === 0 ? '' : value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all outline-none text-slate-900 font-medium"
      />
    </div>
  </div>
);

export default function App() {
  const [data, setData] = useState<FinancialData>(INITIAL_DATA);

  const handleInputChange = (field: keyof FinancialData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    setData(prev => ({ ...prev, [field]: val }));
  };

  const clearData = () => {
    setData(INITIAL_DATA);
  };

  // --- Calculations ---
  const kpis = useMemo(() => {
    const { faturamentoBruto, custosFixos, custosVariaveis, numeroAssociados } = data;
    
    const margemContribuicao = faturamentoBruto - custosVariaveis;
    const indiceMargemContribuicao = faturamentoBruto > 0 ? margemContribuicao / faturamentoBruto : 0;
    const pontoEquilibrio = indiceMargemContribuicao > 0 ? custosFixos / indiceMargemContribuicao : 0;
    const ticketMedio = numeroAssociados > 0 ? faturamentoBruto / numeroAssociados : 0;
    const lucroLiquido = faturamentoBruto - custosFixos - custosVariaveis;

    return {
      margemContribuicao,
      pontoEquilibrio,
      ticketMedio,
      lucroLiquido,
      indiceMargemContribuicao
    };
  }, [data]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const chartData = [
    { name: 'Receita', valor: data.faturamentoBruto, fill: '#0f172a' },
    { name: 'Despesas', valor: data.custosFixos + data.custosVariaveis, fill: '#94a3b8' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-3 rounded-2xl text-white shadow-lg shadow-slate-200">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Dashboard Financeiro</h1>
              <p className="text-slate-500 text-sm font-medium">Associação de Proteção Veicular</p>
            </div>
          </div>
          <button 
            onClick={clearData}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <RefreshCcw size={18} />
            Limpar Dados
          </button>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Inputs Section */}
          <section className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg border-b border-slate-100 pb-4">
                <Calculator size={20} className="text-slate-400" />
                Entrada de Dados
              </div>
              
              <div className="space-y-5">
                <InputField 
                  label="Faturamento Bruto" 
                  id="faturamento" 
                  value={data.faturamentoBruto} 
                  onChange={handleInputChange('faturamentoBruto')}
                  placeholder="R$ 0,00"
                  icon={DollarSign}
                />
                <InputField 
                  label="Custos Fixos" 
                  id="fixos" 
                  value={data.custosFixos} 
                  onChange={handleInputChange('custosFixos')}
                  placeholder="R$ 0,00"
                  icon={ArrowDownRight}
                />
                <InputField 
                  label="Custos Variáveis" 
                  id="variaveis" 
                  value={data.custosVariaveis} 
                  onChange={handleInputChange('custosVariaveis')}
                  placeholder="R$ 0,00"
                  icon={TrendingUp}
                />
                <InputField 
                  label="Número de Associados" 
                  id="associados" 
                  value={data.numeroAssociados} 
                  onChange={handleInputChange('numeroAssociados')}
                  placeholder="0"
                  icon={Users}
                />
              </div>
            </div>
          </section>

          {/* Results Section */}
          <section className="lg:col-span-8 space-y-8">
            
            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
              <KpiCard 
                title="Margem de Contribuição" 
                value={formatCurrency(kpis.margemContribuicao)} 
                icon={PieChart}
                description={`${(kpis.indiceMargemContribuicao * 100).toFixed(1)}% do faturamento`}
                colorClass="text-indigo-600"
              />
              <KpiCard 
                title="Ponto de Equilíbrio" 
                value={formatCurrency(kpis.pontoEquilibrio)} 
                icon={TrendingUp}
                description="Faturamento mínimo necessário"
                colorClass="text-amber-600"
              />
              <KpiCard 
                title="Ticket Médio" 
                value={formatCurrency(kpis.ticketMedio)} 
                icon={Users}
                description="Por associado"
                colorClass="text-emerald-600"
              />
              <KpiCard 
                title="Lucro Líquido" 
                value={formatCurrency(kpis.lucroLiquido)} 
                icon={DollarSign}
                description="Resultado final do período"
                colorClass={kpis.lucroLiquido >= 0 ? "text-slate-900" : "text-rose-600"}
              />
            </div>

            {/* Chart Section */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp size={20} className="text-slate-400" />
                  Comparativo Receitas vs. Despesas
                </h2>
              </div>
              
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    barSize={60}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickFormatter={(value) => `R$ ${value / 1000}k`}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ 
                        borderRadius: '16px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                        padding: '12px'
                      }}
                      formatter={(value: number) => [formatCurrency(value), 'Valor']}
                    />
                    <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 flex flex-wrap gap-6 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-900" />
                  <span className="text-sm text-slate-500 font-medium">Receita Bruta</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-400" />
                  <span className="text-sm text-slate-500 font-medium">Despesas Totais</span>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer Info */}
        <footer className="pt-8 border-t border-slate-200 text-center">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
            Sistema de Gestão Financeira v1.0 • Proteção Veicular
          </p>
        </footer>
      </div>
    </div>
  );
}

