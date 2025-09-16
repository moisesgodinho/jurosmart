'use client';

export default function ExplicacaoJurosCompostos() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg mt-8 transition-shadow duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">O Que São Juros Compostos?</h2>
      <div className="space-y-4 text-gray-700">
        <p>
          Os juros compostos são conhecidos como &apos;juros sobre juros&apos;. Diferente dos juros simples, que rendem apenas sobre o valor inicial, os juros compostos são calculados sobre o montante acumulado (valor inicial + juros já ganhos). Isso cria um efeito de &apos;bola de neve&apos;, acelerando o crescimento do seu dinheiro ao longo do tempo.
        </p>
        <h3 className="text-xl font-bold mt-6 text-gray-900">Como o Cálculo é Feito?</h3>
        <p>
          A calculadora JuroSmart utiliza a seguinte lógica para simular a evolução do seu patrimônio mês a mês:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li><strong>Valor Inicial:</strong> O ponto de partida do seu investimento.</li>
          <li><strong>Aporte Mensal:</strong> A cada mês, um novo valor é adicionado ao montante total antes do cálculo dos juros do período.</li>
          <li><strong>Taxa de Juros:</strong> A taxa é convertida para uma base mensal e aplicada sobre o valor total acumulado (montante do mês anterior + novo aporte).</li>
          <li><strong>Tempo:</strong> O período total da simulação, convertido em meses para garantir a precisão do cálculo.</li>
        </ul>
        <p className="mt-4">
          Essa abordagem permite que você visualize de forma clara como os aportes regulares e o reinvestimento automático dos juros trabalham juntos para potencializar seus ganhos.
        </p>
      </div>
    </div>
  );
}