'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calcularJurosCompostos } from '../lib/calculadora';
import Resultado from '../components/Resultado';
import ThemeSwitcher from '../components/ThemeSwitcher';

const maskCurrency = (value) => {
  if (!value) return '';
  value = value.replace(/\D/g, '');
  value = value.replace(/(\d)(\d{2})$/, '$1,$2');
  value = value.replace(/(?=(\d{3})+(\D))\B/g, '.');
  return value;
};

const unmaskValue = (maskedValue) => {
  if (!maskedValue) return 0;
  const stringValue = String(maskedValue).replace(/\./g, '').replace(',', '.');
  return parseFloat(stringValue);
};

export default function Home() {
  const [valorInicial, setValorInicial] = useState('');
  const [aporteMensal, setAporteMensal] = useState('');
  const [taxaJuros, setTaxaJuros] = useState('');
  const [tipoTaxa, setTipoTaxa] = useState('mensal');
  const [tempo, setTempo] = useState('');
  const [tipoTempo, setTipoTempo] = useState('anos');
  const [resultado, setResultado] = useState(null);
  const [errors, setErrors] = useState({});

  // Lógica do Modo Escuro centralizada aqui
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      root.classList.add('dark');
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    root.classList.toggle('dark');
    const isDark = root.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    setIsDarkMode(isDark);
  };
  
  const validateForm = () => {
    const newErrors = {};
    if (unmaskValue(valorInicial) < 0) newErrors.valorInicial = 'O valor inicial não pode ser negativo.';
    if (unmaskValue(aporteMensal) < 0) newErrors.aporteMensal = 'O aporte mensal não pode ser negativo.';
    const taxaNumerica = parseFloat(String(taxaJuros).replace(',', '.'));
    if (isNaN(taxaNumerica) || taxaNumerica <= 0) newErrors.taxaJuros = 'A taxa de juros deve ser um número positivo.';
    const tempoNumerico = parseInt(tempo);
    if (isNaN(tempoNumerico) || tempoNumerico <= 0) newErrors.tempo = 'O período deve ser um número positivo.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setResultado(null);
    if (!validateForm()) return;
    const valorInicialNumerico = unmaskValue(valorInicial);
    const aporteMensalNumerico = unmaskValue(aporteMensal);
    const taxaNumerica = parseFloat(String(taxaJuros).replace(',', '.'));
    const taxa = { valor: taxaNumerica, tipo: tipoTaxa };
    const periodo = { valor: parseInt(tempo), tipo: tipoTempo };
    const resultadoCalculo = calcularJurosCompostos(valorInicialNumerico, aporteMensalNumerico, taxa, periodo);
    setResultado(resultadoCalculo);
  };

  const handleReset = () => {
    setValorInicial('');
    setAporteMensal('');
    setTaxaJuros('');
    setTempo('');
    setResultado(null);
    setErrors({});
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="container mx-auto">
        <div className="flex justify-end mb-4">
          <ThemeSwitcher isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        </div>
        <div className="text-center mb-10">
            <h1 className="text-4xl font-bold">JuroSmart</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">Sua calculadora inteligente de juros compostos.</p>
        </div>
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg transition-colors duration-300">
              <h2 className="text-2xl font-bold mb-6">Simule seu Investimento</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="valorInicial" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Valor Inicial (R$)</label>
                  <input type="text" inputMode="decimal" id="valorInicial" value={valorInicial} onChange={(e) => setValorInicial(maskCurrency(e.target.value))}
                    className={`mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md shadow-sm focus:outline-none sm:text-sm text-black dark:text-white ${errors.valorInicial ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'}`}
                    placeholder="0,00" required />
                  {errors.valorInicial && <p className="mt-1 text-xs text-red-600">{errors.valorInicial}</p>}
                </div>
                <div>
                  <label htmlFor="aporteMensal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Aporte Mensal (R$)</label>
                  <input type="text" inputMode="decimal" id="aporteMensal" value={aporteMensal} onChange={(e) => setAporteMensal(maskCurrency(e.target.value))}
                    className={`mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md shadow-sm focus:outline-none sm:text-sm text-black dark:text-white ${errors.aporteMensal ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'}`}
                    placeholder="0,00" required />
                  {errors.aporteMensal && <p className="mt-1 text-xs text-red-600">{errors.aporteMensal}</p>}
                </div>
                <div>
                  <label htmlFor="taxaJuros" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Taxa de Juros (%)</label>
                  <div className="flex">
                    <input type="text" inputMode="decimal" id="taxaJuros" value={taxaJuros} onChange={(e) => setTaxaJuros(e.target.value)}
                      className={`mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-l-md shadow-sm focus:outline-none sm:text-sm text-black dark:text-white ${errors.taxaJuros ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'}`}
                      placeholder="0,0" required />
                    <select value={tipoTaxa} onChange={(e) => setTipoTaxa(e.target.value)}
                      className="mt-1 block w-auto pl-3 pr-8 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-r-md text-black dark:text-white bg-gray-50 dark:bg-gray-700">
                      <option value="mensal">Mensal</option>
                      <option value="anual">Anual</option>
                    </select>
                  </div>
                  {errors.taxaJuros && <p className="mt-1 text-xs text-red-600">{errors.taxaJuros}</p>}
                </div>
                <div>
                  <label htmlFor="tempo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Período</label>
                  <div className="flex">
                    <input type="number" id="tempo" value={tempo} onChange={(e) => setTempo(e.target.value.replace(/\D/g, ''))}
                      className={`mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-l-md shadow-sm focus:outline-none sm:text-sm text-black dark:text-white ${errors.tempo ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'}`}
                      placeholder="0" required />
                    <select value={tipoTempo} onChange={(e) => setTipoTempo(e.target.value)}
                      className="mt-1 block w-auto pl-3 pr-8 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-r-md text-black dark:text-white bg-gray-50 dark:bg-gray-700">
                      <option value="meses">Meses</option>
                      <option value="anos">Anos</option>
                    </select>
                  </div>
                  {errors.tempo && <p className="mt-1 text-xs text-red-600">{errors.tempo}</p>}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button type="submit" className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-semibold transition-colors duration-300">
                    Calcular
                  </button>
                  <button type="button" onClick={handleReset} className="w-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 font-semibold transition-colors duration-300">
                    Limpar
                  </button>
                </div>
              </form>
            </div>
            <AnimatePresence>
              {resultado && (
                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} transition={{ duration: 0.5 }}>
                  <Resultado resultado={resultado} isDarkMode={isDarkMode} />
                </motion.div>
              )}
            </AnimatePresence>
        </div>
      </div>
    </main>
  );
}