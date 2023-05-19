interface Emissao {
  fonte: string;
  fatores: {
    gas: string;
    valor: number;
    unidade: string;
  }[];
}

export interface ItemSelecionadoMovel {
  origemMovel: string;
  fonteMovel: string;
  consumoTotal: string;
  consumoEfetivo: string;
  e_DioxidoCarbono: string;
  e_Metano: string;
  e_OxidoNitroso: string;
  emissaoEfetiva: string;
}

export interface ItemSelecionadoEstacionaria {
  origemEstacionaria: string;
  fonteEstacionaria: string;
  consumoTotal: string;
  e_DioxidoCarbono: string;
  e_Metano: string;
  e_OxidoNitroso: string;
  emissaoEfetiva: string;
}

export interface ItemSelecionadoEnergiaEletrica {
  origemEnergiaEletrica: string;
  fonteEnergiaEletrica: string;
  consumoTotal: string;
  emissaoEfetiva: string;
}

export interface ItemSelecionadoResiduo {
  origemResiduo: string;
  fonteResiduo: string;
  consumoTotal: string;
  emissaoEfetiva: string;
}
//Combustão móvel
export const emissaoCombustaoMovel: Emissao[] = [
  {
    fonte: 'Álcool',
    fatores: [
      {
        gas: 'CO2',
        valor: 1.178,
        unidade: 'kg CO2/litro de álcool',
      },
      {
        gas: 'CH4',
        valor: 0.000384,
        unidade: 'kg CH4/litro de álcool',
      },
    ],
  },
  {
    fonte: 'Diesel',
    fatores: [
      {
        gas: 'CO2',
        valor: 2.671,
        unidade: 'kg CO2/litro de diesel',
      },
      {
        gas: 'CH4',
        //valor: 0.000139, o da referência biblográfica
        valor: 0.00000556,
        unidade: 'kg CH4/litro de diesel',
      },
      {
        gas: 'N2O',
        // valor: 0.000139, o da referência biblográfica
        valor: 0.000000705,
        unidade: 'kg N2O/litro de diesel',
      },
    ],
  },
  {
    fonte: 'Gasolina',
    fatores: [
      {
        gas: 'CO2',
        valor: 2.269,
        unidade: 'kg CO2/litro de gasolina',
      },
      {
        gas: 'CH4',
        valor: 0.000806,
        unidade: 'kg CH4/litro de gasolina',
      },
      {
        gas: 'N2O',
        valor: 0.000258,
        unidade: 'kg N2O/litro de gasolina',
      },
    ],
  },
];

//Combustão Estacionária
export const emissaoCombustaoEstacionaria: Emissao[] = [
  {
    fonte: 'Biomassa',
    fatores: [
      {
        gas: 'CO2',
        valor: 1747.2,
        unidade: 'kg CO2/t biomassa',
      },
      {
        gas: 'CH4',
        valor: 4.68,
        unidade: ' kg CH4/t biomassa',
      },
      {
        gas: 'N2O',
        valor: 0.0624,
        unidade: 'kg N2O/t biomassa',
      },
    ],
  },
  {
    fonte: 'GLP',
    fatores: [
      {
        gas: 'CO2',
        valor: 2.98463,
        unidade: 'kg CO2e./kg GLP',
      },
    ],
  },
];

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

export const emissaoResiduos: Emissao[] = [
  {
    fonte: 'Restos alimentares',
    fatores: [
      {
        gas: '',
        valor: 0.15,
        unidade: '',
      },
    ],
  },
  {
    fonte: 'Papel',
    fatores: [
      {
        gas: '',
        valor: 0.4,
        unidade: '',
      },
    ],
  },
  {
    fonte: 'Total',
    fatores: [
      {
        gas: '',
        valor: 0.12,
        unidade: '',
      },
    ],
  },
  {
    fonte: 'Evitadas',
    fatores: [
      {
        gas: '',
        valor: 0.4,
        unidade: '',
      },
    ],
  },
];
