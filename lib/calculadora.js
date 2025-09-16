export function calcularJurosCompostos(valorInicial, aporteMensal, taxaJuros, tempo, aumentoAporteAnual = 0, taxaInflacaoAnual = 0) {
  // Converte a taxa de juros para mensal, se necessário
  const taxaMensal = taxaJuros.tipo === 'anual' ? taxaJuros.valor / 12 / 100 : taxaJuros.valor / 100;

  // Converte o tempo para meses, se necessário
  const tempoEmMeses = tempo.tipo === 'anos' ? tempo.valor * 12 : tempo.valor;

  let montante = parseFloat(valorInicial);
  let totalInvestido = parseFloat(valorInicial);
  let aporteMensalAtual = parseFloat(aporteMensal);
  const fatorAumentoAnual = 1 + (aumentoAporteAnual / 100);
  const historico = [];
  const historicoAnual = [];

  for (let i = 1; i <= tempoEmMeses; i++) {
    // Aumenta o valor do aporte no início de cada ano (após o primeiro)
    if (i > 1 && (i - 1) % 12 === 0) {
      aporteMensalAtual *= fatorAumentoAnual;
    }

    // Adiciona o aporte mensal (possivelmente reajustado)
    if (i > 0) { // Não adiciona aporte no "mês 0"
        montante += aporteMensalAtual;
        totalInvestido += aporteMensalAtual;
    }
    
    // Calcula os juros do período
    montante = montante * (1 + taxaMensal);

    const jurosAcumulados = montante - totalInvestido;

    historico.push({
      mes: i,
      montante: montante.toFixed(2),
      juros: jurosAcumulados.toFixed(2),
      totalInvestido: totalInvestido.toFixed(2),
    });

    // Adiciona ao histórico anual ao final de cada ano
    if (i % 12 === 0) {
      historicoAnual.push({
        ano: i / 12,
        montante: montante.toFixed(2),
        juros: jurosAcumulados.toFixed(2),
        totalInvestido: totalInvestido.toFixed(2),
      });
    }
  }

  // Adiciona o resultado do último ano, caso o período não seja um múltiplo de 12
  if (tempoEmMeses % 12 !== 0) {
    const ultimoAno = Math.ceil(tempoEmMeses / 12);
    const ultimoItem = historico[historico.length - 1];
    historicoAnual.push({
        ano: ultimoAno,
        montante: ultimoItem.montante,
        juros: ultimoItem.juros,
        totalInvestido: ultimoItem.totalInvestido,
    });
  }

  let montanteFinalCorrigido = null;
  let ganhoReal = null;

  if (taxaInflacaoAnual > 0) {
    const tempoEmAnos = tempoEmMeses / 12;
    const fatorDescontoInflacao = Math.pow(1 + (taxaInflacaoAnual / 100), tempoEmAnos);
    montanteFinalCorrigido = (montante / fatorDescontoInflacao);
    // Ganho real é o poder de compra final menos o total que você investiu.
    ganhoReal = (montanteFinalCorrigido - totalInvestido);
  }

  return {
    montanteFinal: montante.toFixed(2),
    totalJuros: (montante - totalInvestido).toFixed(2),
    totalInvestido: totalInvestido.toFixed(2),
    historico,
    historicoAnual,
    montanteFinalCorrigido: montanteFinalCorrigido ? montanteFinalCorrigido.toFixed(2) : null,
    ganhoReal: ganhoReal ? ganhoReal.toFixed(2) : null,
  };
}