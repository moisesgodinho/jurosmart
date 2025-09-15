export function calcularJurosCompostos(valorInicial, aporteMensal, taxaJuros, tempo) {
  // Converte a taxa de juros para mensal, se necessário
  const taxaMensal = taxaJuros.tipo === 'anual' ? taxaJuros.valor / 12 / 100 : taxaJuros.valor / 100;

  // Converte o tempo para meses, se necessário
  const tempoEmMeses = tempo.tipo === 'anos' ? tempo.valor * 12 : tempo.valor;

  let montante = parseFloat(valorInicial);
  let totalInvestido = parseFloat(valorInicial);
  const historico = [];

  for (let i = 1; i <= tempoEmMeses; i++) {
    // Adiciona o aporte mensal antes de calcular os juros do período
    if (i > 0) {
        montante += parseFloat(aporteMensal);
        totalInvestido += parseFloat(aporteMensal);
    }

    montante = montante * (1 + taxaMensal);

    historico.push({
      mes: i,
      montante: montante.toFixed(2),
      juros: (montante - totalInvestido).toFixed(2),
      totalInvestido: totalInvestido.toFixed(2)
    });
  }

  // Ajuste para o valor inicial não ter aporte no primeiro mês
   const valorTotalInvestido = parseFloat(valorInicial) + (parseFloat(aporteMensal) * tempoEmMeses);


  return {
    montanteFinal: montante.toFixed(2),
    totalJuros: (montante - valorTotalInvestido).toFixed(2),
    totalInvestido: valorTotalInvestido.toFixed(2),
    historico
  };
}