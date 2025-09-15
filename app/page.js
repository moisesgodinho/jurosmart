'use client';

import { useState } from 'react';
import { calcularJurosCompostos } from '../lib/calculadora';

export default function Home() {
  const [valorInicial, setValorInicial] = useState('');
  const [aporteMensal, setAporteMensal] = useState('');
  const [taxaJuros, setTaxaJuros] = useState('');
  const [tipoTaxa, setTipoTaxa] = useState('mensal');
  const [tempo, setTempo] = useState('');
  const [tipoTempo, setTipoTempo] = useState('meses');
  const [resultado, setResultado] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const taxa = { valor: parseFloat(taxaJuros), tipo: tipoTaxa };
    const periodo = { valor: parseInt(tempo), tipo: tipoTempo };
    const resultadoCalculo = calcularJurosCompostos(valorInicial, aporteMensal, taxa, periodo);
    setResultado(resultadoCalculo);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Calculadora de Juros Compostos</h1>

      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="valorInicial" className="block text-sm font-medium text-gray-700">Valor Inicial (R$)</label>
            <input
              type="number"
              id="valorInicial"
              value={valorInicial}
              onChange={(e) => setValorInicial(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="aporteMensal" className="block text-sm font-medium text-gray-700">Aporte Mensal (R$)</label>
            <input
              type="number"
              id="aporteMensal"
              value={aporteMensal}
              onChange={(e) => setAporteMensal(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="taxaJuros" className="block text-sm font-medium text-gray-700">Taxa de Juros (%)</label>
            <div className="flex">
              <input
                type="number"
                id="taxaJuros"
                step="0.01"
                value={taxaJuros}
                onChange={(e) => setTaxaJuros(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                required
              />
              <select
                value={tipoTaxa}
                onChange={(e) => setTipoTaxa(e.target.value)}
                className="mt-1 block w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-r-md text-black"
              >
                <option value="mensal">Mensal</option>
                <option value="anual">Anual</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="tempo" className="block text-sm font-medium text-gray-700">Período</label>
            <div className="flex">
              <input
                type="number"
                id="tempo"
                value={tempo}
                onChange={(e) => setTempo(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                required
              />
              <select
                value={tipoTempo}
                onChange={(e) => setTipoTempo(e.target.value)}
                className="mt-1 block w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-r-md text-black"
              >
                <option value="meses">Meses</option>
                <option value="anos">Anos</option>
              </select>
            </div>
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Calcular
          </button>
        </form>
      </div>

      {resultado && (
        <div className="mt-8 max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Resultado</h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>Montante Final:</strong> R$ {resultado.montanteFinal}</p>
            <p><strong>Total em Juros:</strong> R$ {resultado.totalJuros}</p>
            <p><strong>Total Investido:</strong> R$ {resultado.totalInvestido}</p>
          </div>
        </div>
      )}
    </div>
  );
}