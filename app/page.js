'use client';

import { useState } from 'react';
import { calcularJurosCompostos } from '../lib/calculadora';
import Resultado from '../components/Resultado';
import ExplicacaoJurosCompostos from '../components/ExplicacaoJurosCompostos';

// Funções de formatação
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
  const [aumentoAporteAnual, setAumentoAporteAnual] = useState(''); // Novo estado
  const [taxaJuros, setTaxaJuros] = useState('');
  const [tipoTaxa, setTipoTaxa] = useState('anual');
  const [tempo, setTempo] = useState('');
  const [tipoTempo, setTipoTempo] = useState('anos');
  const [resultado, setResultado] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (unmaskValue(valorInicial) < 0) {
      newErrors.valorInicial = 'O valor inicial não pode ser negativo.';
    }
    if (unmaskValue(aporteMensal) < 0) {
      newErrors.aporteMensal = 'O aporte mensal não pode ser negativo.';
    }
    const aumentoNumerico = parseFloat(String(aumentoAporteAnual).replace(',', '.'));
    if (aumentoAporteAnual && (isNaN(aumentoNumerico) || aumentoNumerico < 0)) {
      newErrors.aumentoAporteAnual = 'O aumento anual deve ser um número positivo.';
    }
    const taxaNumerica = parseFloat(String(taxaJuros).replace(',', '.'));
    if (isNaN(taxaNumerica) || taxaNumerica <= 0 || !/^\d+(,\d+)?$/.test(taxaJuros)) {
      newErrors.taxaJuros = 'A taxa de juros deve ser um número positivo.';
    }
    const tempoNumerico = parseInt(tempo);
    if (isNaN(tempoNumerico) || tempoNumerico <= 0 || !/^\d+$/.test(tempo)) {
      newErrors.tempo = 'O período deve ser um número inteiro e positivo.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setResultado(null);
    if (!validateForm()) {
      return;
    }
    const valorInicialNumerico = unmaskValue(valorInicial);
    const aporteMensalNumerico = unmaskValue(aporteMensal);
    const aumentoAporteAnualNumerico = aumentoAporteAnual ? parseFloat(String(aumentoAporteAnual).replace(',', '.')) : 0;
    const taxaNumerica = parseFloat(String(taxaJuros).replace(',', '.'));
    const taxa = { valor: taxaNumerica, tipo: tipoTaxa };
    const periodo = { valor: parseInt(tempo), tipo: tipoTempo };
    const resultadoCalculo = calcularJurosCompostos(valorInicialNumerico, aporteMensalNumerico, taxa, periodo, aumentoAporteAnualNumerico);
    setResultado(resultadoCalculo);
  };

  const handleReset = () => {
    setValorInicial('');
    setAporteMensal('');
    setAumentoAporteAnual('');
    setTaxaJuros('');
    setTempo('');
    setResultado(null);
    setErrors({});
  };

  const handleNumericChange = (setter) => (e) => {
    const { value } = e.target;
    if (/^\d*[,]?\d*$/.test(value)) {
        setter(value);
    }
  };

  const handleBlur = (e) => {
    e.currentTarget.blur();
  };

  return (
    <main className="flex-grow bg-gray-50 text-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-indigo-600">JuroSmart</h1>
          <p className="text-lg text-gray-600 mt-2">Sua calculadora inteligente de juros compostos.</p>
        </div>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg transition-shadow duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Simule seu Investimento</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="valorInicial" className="block text-sm font-medium text-gray-700">Valor Inicial (R$)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  id="valorInicial"
                  value={valorInicial}
                  onChange={(e) => setValorInicial(maskCurrency(e.target.value))}
                  className={`mt-1 block w-full px-4 py-2 bg-gray-50 border rounded-md shadow-sm focus:outline-none sm:text-sm text-gray-900 transition-colors duration-300 ${errors.valorInicial ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                  placeholder="0,00"
                  required
                />
                {errors.valorInicial && <p className="mt-1 text-xs text-red-600">{errors.valorInicial}</p>}
              </div>
              <div>
                <label htmlFor="aporteMensal" className="block text-sm font-medium text-gray-700">Aporte Mensal (R$)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  id="aporteMensal"
                  value={aporteMensal}
                  onChange={(e) => setAporteMensal(maskCurrency(e.target.value))}
                  className={`mt-1 block w-full px-4 py-2 bg-gray-50 border rounded-md shadow-sm focus:outline-none sm:text-sm text-gray-900 transition-colors duration-300 ${errors.aporteMensal ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                  placeholder="0,00"
                  required
                />
                {errors.aporteMensal && <p className="mt-1 text-xs text-red-600">{errors.aporteMensal}</p>}
              </div>
              {/* Novo campo aqui */}
              <div>
                <label htmlFor="aumentoAporteAnual" className="block text-sm font-medium text-gray-700">Aumento Anual do Aporte (%)<span className="text-gray-500 font-normal">(Opcional)</span></label>
                <input
                    type="text"
                    inputMode="decimal"
                    id="aumentoAporteAnual"
                    value={aumentoAporteAnual}
                    onChange={handleNumericChange(setAumentoAporteAnual)}
                    className={`mt-1 block w-full px-4 py-2 bg-gray-50 border rounded-md shadow-sm focus:outline-none sm:text-sm text-gray-900 transition-colors duration-300 ${errors.aumentoAporteAnual ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                    placeholder="Ex: 5 para 5%"
                />
                {errors.aumentoAporteAnual && <p className="mt-1 text-xs text-red-600">{errors.aumentoAporteAnual}</p>}
              </div>
              <div>
                <label htmlFor="taxaJuros" className="block text-sm font-medium text-gray-700">Taxa de Juros (%)</label>
                <div className="flex">
                  <input
                    type="text"
                    inputMode="decimal"
                    id="taxaJuros"
                    value={taxaJuros}
                    onChange={handleNumericChange(setTaxaJuros)}
                    className={`mt-1 block w-full px-4 py-2 bg-gray-50 border rounded-l-md shadow-sm focus:outline-none sm:text-sm text-gray-900 transition-colors duration-300 ${errors.taxaJuros ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                    placeholder="0,0"
                    required
                  />
                  <select value={tipoTaxa} onChange={(e) => setTipoTaxa(e.target.value)} className="custom-select mt-1 block w-auto pl-3 pr-8 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-r-md text-gray-900 bg-gray-50 transition-colors duration-300">
                    <option value="mensal">Mensal</option>
                    <option value="anual">Anual</option>
                  </select>
                </div>
                {errors.taxaJuros && <p className="mt-1 text-xs text-red-600">{errors.taxaJuros}</p>}
              </div>
              <div>
                <label htmlFor="tempo" className="block text-sm font-medium text-gray-700">Período</label>
                <div className="flex">
                  <input
                    type="text"
                    inputMode="numeric"
                    id="tempo"
                    value={tempo}
                    onChange={(e) => setTempo(e.target.value.replace(/\D/g, ''))}
                    className={`mt-1 block w-full px-4 py-2 bg-gray-50 border rounded-l-md shadow-sm focus:outline-none sm:text-sm text-gray-900 transition-colors duration-300 ${errors.tempo ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                    placeholder="0"
                    required
                  />
                  <select value={tipoTempo} onChange={(e) => setTipoTempo(e.target.value)} className="custom-select mt-1 block w-auto pl-3 pr-8 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-r-md text-gray-900 bg-gray-50 transition-colors duration-300">
                    <option value="meses">Meses</option>
                    <option value="anos">Anos</option>
                  </select>
                </div>
                {errors.tempo && <p className="mt-1 text-xs text-red-600">{errors.tempo}</p>}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  type="submit"
                  onMouseUp={handleBlur}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-semibold transition-transform transform hover:scale-105"
                >
                  Calcular
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  onMouseUp={handleBlur}
                  className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 font-semibold transition-transform transform hover:scale-105"
                >
                  Limpar
                </button>
              </div>
            </form>
          </div>
          {resultado && (
            <div className="mt-8">
              <Resultado resultado={resultado} />
            </div>
          )}
          <ExplicacaoJurosCompostos />
        </div>
      </div>
    </main>
  );
}