export interface DropdownOption {
  name: string;
  value: number;
}

export const frequencyOptions: Record<string, DropdownOption[]> = {
  BM1397: [
    { name: '400', value: 400 },
    { name: '425 (default)', value: 425 },
    { name: '450', value: 450 },
    { name: '475', value: 475 },
    { name: '485', value: 485 },
    { name: '500', value: 500 },
    { name: '525', value: 525 },
    { name: '550', value: 550 },
    { name: '575', value: 575 },
    { name: '590', value: 590 },
    { name: '600', value: 600 },
    { name: '610', value: 610 },
    { name: '620', value: 620 },
    { name: '630', value: 630 },
    { name: '640', value: 640 },
    { name: '650', value: 650 },
  ],
  BM1366: [
    { name: '400', value: 400 },
    { name: '425', value: 425 },
    { name: '450', value: 450 },
    { name: '475', value: 475 },
    { name: '485 (default)', value: 485 },
    { name: '500', value: 500 },
    { name: '525', value: 525 },
    { name: '550', value: 550 },
    { name: '575', value: 575 },
  ],
  BM1368: [
    { name: '400', value: 400 },
    { name: '425', value: 425 },
    { name: '450', value: 450 },
    { name: '475', value: 475 },
    { name: '490 (default)', value: 490 },
    { name: '500', value: 500 },
    { name: '525', value: 525 },
    { name: '550', value: 550 },
    { name: '575', value: 575 },
  ],
  BM1370: [
    { name: '400', value: 400 },
    { name: '490', value: 490 },
    { name: '525 (default)', value: 525 },
    { name: '575', value: 575 },
    { name: '596', value: 596 },
    { name: '610', value: 610 },
    { name: '625', value: 625 },
  ],
};

export const coreVoltageOptions: Record<string, DropdownOption[]> = {
  BM1370: [
    { name: '900', value: 900 },
    { name: '950', value: 950 },
    { name: '1000', value: 1000 },
    { name: '1060', value: 1060 },
    { name: '1100 (default)', value: 1100 },
    { name: '1150', value: 1150 },
    { name: '1200', value: 1200 },
    { name: '1250', value: 1250 },
  ],
  BM1397: [
    { name: '1100', value: 1100 },
    { name: '1150', value: 1150 },
    { name: '1200', value: 1200 },
    { name: '1250', value: 1250 },
    { name: '1300', value: 1300 },
    { name: '1350', value: 1350 },
    { name: '1400', value: 1400 },
    { name: '1450', value: 1450 },
    { name: '1500', value: 1500 },
  ],
  BM1366: [
    { name: '1100', value: 1100 },
    { name: '1150', value: 1150 },
    { name: '1200 (default)', value: 1200 },
    { name: '1250', value: 1250 },
    { name: '1300', value: 1300 },
  ],
  BM1368: [
    { name: '1100', value: 1100 },
    { name: '1150', value: 1150 },
    { name: '1166 (default)', value: 1166 },
    { name: '1200', value: 1200 },
    { name: '1250', value: 1250 },
    { name: '1300', value: 1300 },
  ],
};

export function getDefaultFrequency(model: string): number {
  const options = frequencyOptions[model] as DropdownOption[] | undefined;
  if (!options) return 0;
  const defaultOption = options.find(option => option.name.includes('default'));
  return defaultOption ? defaultOption.value : options[0]?.value ?? 0;
}

export function getDefaultCoreVoltage(model: string): number {
  const options = coreVoltageOptions[model] as DropdownOption[] | undefined;
  if (!options) return 0;
  const defaultOption = options.find(option => option.name.includes('default'));
  return defaultOption ? defaultOption.value : options[0]?.value ?? 0;
}
