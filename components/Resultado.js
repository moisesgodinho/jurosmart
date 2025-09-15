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
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Montante (Valor Total)',
        data: historico.map(item => item.montante),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#1F2937' } },
      title: { display: true, text: 'Evolução do Patrimônio', font: { size: 18 }, color: '#1F2937' },
    },
    scales: {
      x: { ticks: { color: '#1F2937' }, grid: { color: 'rgba(0, 0, 0, 0.1)' } },
      y: {
        ticks: { callback: (value) => 'R$ ' + value.toLocaleString('pt-BR'), color: '#1F2937' },
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg text-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-center">Resultado da Simulação</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-8">
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Investido</p>
          <p className="text-xl font-semibold">{formatCurrency(totalInvestido)}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total em Juros</p>
          <p className="text-xl font-semibold text-green-600">{formatCurrency(totalJuros)}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Montante Final</p>
          <p className="text-xl font-semibold">{formatCurrency(montanteFinal)}</p>
        </div>
      </div>
      <div className="mb-8 h-80">
        <Line options={chartOptions} data={chartData} />
      </div>
      <div>
        <h3 className="text-xl font-bold mb-4">Projeção Detalhada</h3>
        <div className="overflow-x-auto max-h-96">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mês</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Investido</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Juros no Mês</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montante Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {historico.map((item) => (
                <tr key={item.mes} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{item.mes}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(item.totalInvestido)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(item.juros)}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">{formatCurrency(item.montante)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}