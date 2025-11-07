export const calculateEMI = (
  principal: number,
  annualRate: number,
  tenureMonths: number
): number => {
  if (principal <= 0 || annualRate <= 0 || tenureMonths <= 0) return 0;

  const monthlyRate = annualRate / (12 * 100);
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  return Math.round(emi * 100) / 100;
};

export const getLoanPurposes = () => [
  "Personal",
  "Car",
  "Home",
  "Education",
  "Business",
  "Medical",
];

export const getInterestRate = (_purpose: string): number => {
  const rates: Record<string, number> = {
    Personal: 10.0,
    Car: 10.0,
    Home: 10.0,
    Education: 10.0,
    Business: 10.0,
    Medical: 10.0,
  };
  return 10.0;
};
