'use client';

import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const formatCurrency = (value) => {
  const numberValue = Number(value);
  if (isNaN(numberValue)) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(0);
  }
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numberValue);
};

// Componente para o ícone de informação
const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
);


export default function Resultado({ resultado }) {
  if (!resultado) {
    return null;
  }

  const { montanteFinal, totalJuros, totalInvestido, historico, historicoAnual, montanteFinalCorrigido, ganhoReal } = resultado;

  let highlightApplied = false;

  const lineChartData = {
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

  const barChartData = {
    labels: historicoAnual.map(item => `Ano ${item.ano}`),
    datasets: [
        {
            label: 'Total Investido',
            data: historicoAnual.map(item => item.totalInvestido),
            backgroundColor: '#6366f1',
        },
        {
            label: 'Juros Acumulados',
            data: historicoAnual.map(item => item.juros),
            backgroundColor: '#10b981',
        }
    ]
  };

  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#4b5563', font: { size: 14 } } },
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

  const barChartOptions = {
    ...commonChartOptions,
    plugins: {
      ...commonChartOptions.plugins,
      title: { display: true, text: 'Evolução Anual do Patrimônio', font: { size: 18 }, color: '#1f2937' },
    },
    scales: {
        ...commonChartOptions.scales,
        x: {
            ...commonChartOptions.scales.x,
            stacked: true,
        },
        y: {
            ...commonChartOptions.scales.y,
            stacked: true,
        }
    }
  };

  const lineChartOptions = {
    ...commonChartOptions,
    plugins: {
        ...commonChartOptions.plugins,
        title: { display: true, text: 'Evolução Mensal do Patrimônio', font: { size: 18 }, color: '#1f2937' },
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg text-gray-800 transition-shadow duration-300 hover:shadow-xl space-y-8">
      <h2 className="text-2xl font-bold text-center text-gray-900">Resultado da Simulação</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
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
      
      {montanteFinalCorrigido && (
        <div className="pt-6 border-t border-gray-200 mt-6">
          <h3 className="text-lg font-bold text-center text-gray-900 mb-4">Resultado Descontando a Inflação (Poder de Compra Real)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Montante Final Corrigido</p>
              <p className="text-xl font-semibold text-indigo-600">{formatCurrency(montanteFinalCorrigido)}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Ganho Real (Acima da Inflação)</p>
              <p className={`text-xl font-semibold ${ganhoReal >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(ganhoReal)}</p>
            </div>
          </div>
          <div className="mt-6 bg-blue-50 border border-blue-200 text-blue-800 text-sm p-4 rounded-lg">
            <h4 className="font-bold mb-2"><InfoIcon />Entendendo o Poder de Compra Real</h4>
            <p className="mb-2">A inflação diminui o poder de compra do dinheiro ao longo do tempo. Esta seção mostra o valor real do seu investimento, ou seja, o que você de fato poderia comprar com esse dinheiro no futuro, em valores de hoje.</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
                <li><span className="font-semibold">Montante Final Corrigido:</span> É o seu montante final, mas ajustado para a inflação. Ele mostra seu poder de compra real no futuro.</li>
                <li><span className="font-semibold">Ganho Real:</span> É o quanto seu poder de compra aumentou de verdade. Se este valor for negativo, significa que seu rendimento não conseguiu superar a inflação.</li>
            </ul>
          </div>
        </div>
      )}

      {historicoAnual.length > 0 && (
          <div className="h-80 pt-8">
              <Bar options={barChartOptions} data={barChartData} />
          </div>
      )}

      <div className="h-80 pt-8">
        <Line options={lineChartOptions} data={lineChartData} />
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4 text-gray-900">Projeção Detalhada (Mensal)</h3>
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
              {historico.map((item) => {
                let rowClass = "hover:bg-gray-50";
                const jurosSuperamInvestido = parseFloat(item.juros) > parseFloat(item.totalInvestido);

                if (jurosSuperamInvestido && !highlightApplied) {
                  rowClass = "bg-green-100 font-semibold";
                  highlightApplied = true;
                }

                return (
                  <tr key={item.mes} className={rowClass}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.mes}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(item.totalInvestido)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{formatCurrency(item.juros)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">{formatCurrency(item.montante)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}