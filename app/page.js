'use client';

import { useState } from 'react';
import { calcularJurosCompostos } from '../lib/calculadora';
import Resultado from '../components/Resultado';

export default function Home() {
  const [valorInicial, setValorInicial] = useState('1000');
  const [aporteMensal, setAporteMensal] = useState('500');
  const [taxaJuros, setTaxaJuros] = useState('1.2');
  const [tipoTaxa, setTipoTaxa] = useState('mensal');
  const [tempo, setTempo] = useState('10');
  const [tipoTempo, setTipoTempo] = useState('anos');
  const [resultado, setResultado] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const taxa = { valor: parseFloat(taxaJuros), tipo: tipoTaxa };
    const periodo = { valor: parseInt(tempo), tipo: tipoTempo };
    const resultadoCalculo = calcularJurosCompostos(valorInicial, aporteMensal, taxa, periodo);
    setResultado(resultadoCalculo);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800">JuroSmart</h1>
            <p className="text-lg text-gray-600">Sua calculadora inteligente de juros compostos.</p>
        </div>

        {/* Container do Formulário */}
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Simule seu Investimento</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="valorInicial" className="block text-sm font-medium text-gray-700">Valor Inicial (R$)</label>
              <input
                type="number"
                id="valorInicial"
                value={valorInicial}
                onChange={(e) => setValorInicial(e.target.value)}
                className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                required
              />
            </div>

            <div>
              <label htmlFor="aporteMensal" className="block text-sm font-medium text-gray-700">Aporte Mensal (R$)</label>
              <input
                type="number"
                id="aporteMensal"
                value={aporteMensal}
                onChange={(e) => setAporteMensal(e.target.value)}
                className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                required
              />
            </div>

            <div>
              <label htmlFor="taxaJuros" className="block text-sm font-medium text-gray-700">Taxa de Juros (%)</label>
              <div className="flex">
                <input
                  type="number"
                  id="taxaJuros"
                  step="0.01"
                  value={taxaJuros}
                  onChange={(e) => setTaxaJuros(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                  required
                />
                <select
                  value={tipoTaxa}
                  onChange={(e) => setTipoTaxa(e.target.value)}
                  className="mt-1 block w-auto pl-3 pr-8 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-r-md text-black bg-gray-50"
                >
                  <option value="mensal">Mensal</option>
                  <option value="anual">Anual</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="tempo" className="block text-sm font-medium text-gray-700">Período</label>
              <div className="flex">
                <input
                  type="number"
                  id="tempo"
                  value={tempo}
                  onChange={(e) => setTempo(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                  required
                />
                <select
                  value={tipoTempo}
                  onChange={(e) => setTipoTempo(e.target.value)}
                  className="mt-1 block w-auto pl-3 pr-8 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-r-md text-black bg-gray-50"
                >
                  <option value="meses">Meses</option>
                  <option value="anos">Anos</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-semibold">
              Calcular
            </button>
          </form>
        </div>

        {/* Container dos Resultados */}
        {resultado && (
          <div className="max-w-4xl mx-auto mt-8">
            <Resultado resultado={resultado} />
          </div>
        )}
      </div>
    </main>
  );
}