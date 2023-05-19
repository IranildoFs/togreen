interface Emissao {
  fonte: string;
  fatores: {
    gas: string;
    valor: number;
    unidade: string;
  }[];
}

export interface ItemSelecionadoEnergiaEletrica {
  origemEnergiaEletrica: string;
  fonteEnergiaEletrica: string;
  consumoTotal: string;
  emissaoEfetiva: string;
}

export interface ItemSelecionadoEstacionaria {
  origemEnergiaEletrica: string;
  fonteEnergiaEletrica: string;
  consumoTotal: string;
  emissaoEfetiva: string;
}
//Combustão móvel
export const emissaoEnergiaEletrica: Emissao[] = [
  {
    fonte: 'Energia',
    fatores: [
      {
        gas: 'CO2',
        valor: 0.0635,
        unidade: 'tCO2e./MWh',
      },
    ],
  },
];

//Combustão Estacionária
export const emissaoEfluente: Emissao[] = [
  {
    fonte: 'Efluente',
    fatores: [
      {
        gas: 'CH4',
        valor: 0.0025,
        unidade: 'kg CH4/kg DBO',
      },
    ],
  },
];
