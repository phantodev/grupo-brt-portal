export function useFormatCurrency(price: number) {
  // Verifica se o valor é um número válido
  if (typeof price !== 'number' || isNaN(price)) {
    return '';
  }

  // Formata o número como moeda com separadores de milhar e casas decimais
  return price.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
