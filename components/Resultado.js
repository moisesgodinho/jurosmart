'use client';

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export default function Resultado({ resultado }) {
  if (!resultado) {
    return null;
  }

  const { montanteFinal, totalJuros, totalInvestido, historico } = resultado;

  const chartData = {
    labels: historico.map(item => `Mês ${item.mes}`),
    datasets: [
      {
        label: 'Total Investido',
        data: historico.map(item => item.totalInvestido),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.1
      },
      {
        label: 'Montante (Valor Total)',
        data: historico.map(item => item.montante),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.1
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#4b5563', font: { size: 14 } } },
      title: { display: true, text: 'Evolução do Patrimônio', font: { size: 18 }, color: '#1f2937' },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: { ticks: { color: '#4b5563' }, grid: { color: 'rgba(0, 0, 0, 0.05)' } },
      y: {
        ticks: { callback: (value) => formatCurrency(value), color: '#4b5563' },
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg text-gray-800 transition-shadow duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Resultado da Simulação</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-8">
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Investido</p>
          <p className="text-xl font-semibold text-gray-900">{formatCurrency(totalInvestido)}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total em Juros</p>
          <p className="text-xl font-semibold text-green-600">{formatCurrency(totalJuros)}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Montante Final</p>
          <p className="text-xl font-semibold text-indigo-600">{formatCurrency(montanteFinal)}</p>
        </div>
      </div>
      <div className="mb-8 h-80">
        <Line options={chartOptions} data={chartData} />
      </div>
      <div>
        <h3 className="text-xl font-bold mb-4 text-gray-900">Projeção Detalhada</h3>
        <div className="overflow-x-auto max-h-96 rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mês</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Investido</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Juros Acumulados</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montante Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {historico.map((item) => (
                <tr key={item.mes} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.mes}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(item.totalInvestido)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{formatCurrency(item.juros)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">{formatCurrency(item.montante)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}