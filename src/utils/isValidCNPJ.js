export const isValidCNPJ = (cnpj) => {
  cnpj = cnpj.replace(/\D/g, '');
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
  
  // 1st check digit
  let sum = 0;
  let weights = [5,4,3,2,9,8,7,6,5,4,3,2];
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj.charAt(i)) * weights[i];
  }
  let digit1 = (sum % 11 < 2) ? 0 : 11 - (sum % 11);
  
  // 2nd check digit
  sum = 0;
  weights = [6,5,4,3,2,9,8,7,6,5,4,3,2];
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj.charAt(i)) * weights[i];
  }
  sum += digit1 * 2;
  let digit2 = (sum % 11 < 2) ? 0 : 11 - (sum % 11);
  
  return parseInt(cnpj.charAt(12)) === digit1 && parseInt(cnpj.charAt(13)) === digit2;
};
