import { Button, Col, Form, Input, InputNumber, Row, Select, Table, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { columnsCombustaoEstacionaria } from './columns/columnsCombustaoEstacionaria';
import { columnsCombustaoMovel } from './columns/columnsCombustaoMovel';

import styles from './index.less';
import {
  emissaoCombustaoEstacionaria,
  emissaoCombustaoMovel,
  ItemSelecionadoEstacionaria,
  ItemSelecionadoMovel,
} from './scopeOneTypes/fatoresEmissao';

import { gasesEE } from './scopeOneTypes/pag';

const { Option } = Select;
const { Title } = Typography;

const STORAGE_KEY_MOVEL = 'itensSelecionadosMovel';
const STORAGE_KEY_ESTACIONARIA = 'itensSelecionadosEstacionaria';

const ScopeOne: React.FC = () => {
  const [origemMovel, setOrigemMovel] = useState('');
  const [fonteMovel, setFonteMovel] = useState('');
  const [consumoTotal, setConsumoTotal] = useState(0);
  const [itensSelecionadosMovel, setItensSelecionadosMovel] = useState<ItemSelecionadoMovel[]>([]);
  const [tabelaMovel, setTabelaMovel] = useState<ItemSelecionadoMovel[]>([]);

  const getDataFromLocalStorage = (key) => {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  };

  const getExcelData = (data) => {
    return data.map((item) => ({
      Origem: item.origemMovel,
      Fonte: item.fonteMovel,
      'Consumo Total': item.consumoTotal,
      'Consumo Efetivo': item.consumoEfetivo,
      'Emissão de CO2': item.e_DioxidoCarbono,
      'Emissão de CH4': item.e_Metano,
      'Emissão de N2O': item.e_OxidoNitroso,
      'Emissão Efetiva': item.emissaoEfetiva,
    }));
  };

  const columnsCombustaoMovel_ = [
    ...columnsCombustaoMovel,
    {
      title: 'Remover',
      key: 'remover',
      render: (_, item, index) => (
        <Button onClick={() => handleRemoverItemMovel(index)}>Remover</Button>
      ),
    },
  ];

  const TabelaMovel: React.FC<{ dados: ItemSelecionadoMovel[] }> = ({ dados }) => {
    return (
      <Table
        dataSource={dados}
        columns={columnsCombustaoMovel_}
        footer={() =>
          totalEmissaoMovel
            ? `A emissão total de combustão móvel foi de ${totalEmissaoMovel.toFixed(3)} tCO2e`
            : ''
        }
      />
    );
  };

  const handleAdicionarItemMovel = () => {
    let consumoEfetivo = consumoTotal; // valor original para descobrir o efetivo
    if (fonteMovel === 'Diesel') {
      consumoEfetivo *= 0.95;
    } else if (fonteMovel === 'Gasolina') {
      consumoEfetivo *= 0.75;
    }

    let e_DioxidoCarbono = 0;
    let e_Metano = 0;
    let e_OxidoNitroso = 0;

    // Iterar sobre os fatores de emissão correspondentes à fonte de combustível utilizada
    emissaoCombustaoMovel.forEach((combustivel) => {
      if (combustivel.fonte === fonteMovel) {
        // Iterar sobre os fatores de emissão correspondentes aos gases de efeito estufa (CO2, CH4 e N2O)
        combustivel.fatores.forEach((fator) => {
          if (fator.gas === 'CO2') {
            e_DioxidoCarbono +=
              consumoEfetivo * (fator.valor / 1000) * gasesEE.find((gas) => gas.gas === 'CO2').pag;
          } else if (fator.gas === 'CH4') {
            e_Metano +=
              consumoEfetivo * (fator.valor / 1000) * gasesEE.find((gas) => gas.gas === 'CH4').pag;
          } else if (fator.gas === 'N2O') {
            e_OxidoNitroso +=
              consumoEfetivo * (fator.valor / 1000) * gasesEE.find((gas) => gas.gas === 'N2O').pag;
          }
        });
      }
    });

    let emissaoEfetiva = e_DioxidoCarbono + e_Metano + e_OxidoNitroso;
    const novoItemMovel = {
      origemMovel,
      fonteMovel,
      consumoTotal: consumoTotal.toFixed(3),
      consumoEfetivo: consumoEfetivo.toFixed(3),
      e_DioxidoCarbono: e_DioxidoCarbono.toFixed(3),
      e_Metano: e_Metano.toFixed(6),
      e_OxidoNitroso: e_OxidoNitroso.toFixed(5),
      emissaoEfetiva: emissaoEfetiva.toFixed(3),
    };

    setItensSelecionadosMovel([...itensSelecionadosMovel, novoItemMovel]);
    setOrigemMovel('');
    setFonteMovel('');
    setConsumoTotal(0);

    setTabelaMovel([...tabelaMovel, novoItemMovel]); // adiciona o novo item na tabela
    localStorage.setItem(
      STORAGE_KEY_MOVEL,
      JSON.stringify([...itensSelecionadosMovel, novoItemMovel]),
    );
  };

  const handleRemoverItemMovel = (index: number) => {
    const novaListaItensMovel = [...itensSelecionadosMovel];
    novaListaItensMovel.splice(index, 1);
    setItensSelecionadosMovel(novaListaItensMovel);

    localStorage.setItem(STORAGE_KEY_MOVEL, JSON.stringify(novaListaItensMovel));
  };
  const adicionarHabilitado = useMemo(() => {
    return fonteMovel !== '' && consumoTotal > 0;
  }, [fonteMovel, consumoTotal]);

  const totalEmissaoMovel = itensSelecionadosMovel.reduce(
    (total, item) => total + +item.emissaoEfetiva,
    0,
  );

  const [origemEstacionaria, setOrigemEstacionaria] = useState('');
  const [fonteEstacionaria, setFonteEstacionaria] = useState('');
  const [consumoTotalEstacionaria, setConsumoTotalEstacionaria] = useState(0);
  const [itensSelecionadosEstacionaria, setItensSelecionadosEstacionaria] = useState<
    ItemSelecionadoEstacionaria[]
  >([]);
  const [tabelaEstacionaria, setTabelaEstacionaria] = useState<ItemSelecionadoEstacionaria[]>([]);

  const columnsCombustaoEstacionaria_ = [
    ...columnsCombustaoEstacionaria,
    {
      title: 'Remover',
      key: 'remover',
      render: (_, item, index) => (
        <Button onClick={() => handleRemoverItemEstacionaria(index)}>Remover</Button>
      ),
    },
  ];

  const TabelaEstacionaria: React.FC<{ dados: ItemSelecionadoEstacionaria[] }> = ({ dados }) => {
    return (
      <Table
        dataSource={dados}
        columns={columnsCombustaoEstacionaria_}
        footer={() =>
          totalEmissaoEstacionaria
            ? `A emissão total de combustão estacionária foi de ${totalEmissaoEstacionaria.toFixed(
                3,
              )} tCO2e`
            : ''
        }
      />
    );
  };

  const handleAdicionarItemEstacionaria = () => {
    const emissaoFatores = emissaoCombustaoEstacionaria.find(
      (combustivel) => combustivel.fonte === fonteEstacionaria,
    ).fatores;

    let e_DioxidoCarbono = 0;
    let e_Metano = 0;
    let e_OxidoNitroso = 0;

    emissaoFatores.forEach((fator) => {
      const gasEE = gasesEE.find((gas) => gas.gas === fator.gas);
      const emissaoGas = consumoTotalEstacionaria * (fator.valor / 1000) * gasEE.pag;

      if (fator.gas === 'CO2') {
        e_DioxidoCarbono += emissaoGas;
      } else if (fator.gas === 'CH4') {
        e_Metano += emissaoGas;
      } else if (fator.gas === 'N2O') {
        e_OxidoNitroso += emissaoGas;
      }
    });

    const emissaoEfetiva =
      fonteEstacionaria === 'Biomassa'
        ? e_DioxidoCarbono + e_Metano + e_OxidoNitroso - e_DioxidoCarbono
        : e_DioxidoCarbono + e_Metano + e_OxidoNitroso;

    const novoItemEstacionaria = {
      origemEstacionaria,
      fonteEstacionaria,
      consumoTotal: consumoTotalEstacionaria.toFixed(3),
      e_DioxidoCarbono: e_DioxidoCarbono.toFixed(3),
      e_Metano: e_Metano.toFixed(6),
      e_OxidoNitroso: e_OxidoNitroso.toFixed(5),
      emissaoEfetiva: emissaoEfetiva.toFixed(3),
    };

    setItensSelecionadosEstacionaria((prevItensSelecionados) => [
      ...prevItensSelecionados,
      novoItemEstacionaria,
    ]);
    setOrigemEstacionaria('');
    setFonteEstacionaria('');
    setConsumoTotalEstacionaria(0);

    setTabelaEstacionaria((prevTabelaEstacionaria) => [
      ...prevTabelaEstacionaria,
      novoItemEstacionaria,
    ]);
    localStorage.setItem(
      STORAGE_KEY_ESTACIONARIA,
      JSON.stringify([...itensSelecionadosEstacionaria, novoItemEstacionaria]),
    );
  };
  const handleRemoverItemEstacionaria = (index: number) => {
    const novaListaItensEstacionaria = [...itensSelecionadosEstacionaria];
    novaListaItensEstacionaria.splice(index, 1);
    setItensSelecionadosEstacionaria(novaListaItensEstacionaria);

    localStorage.setItem(STORAGE_KEY_ESTACIONARIA, JSON.stringify(novaListaItensEstacionaria));
  };
  const adicionarEmissaoEstacionariaHabilitado = useMemo(() => {
    return fonteEstacionaria !== '' && consumoTotalEstacionaria > 0;
  }, [fonteEstacionaria, consumoTotalEstacionaria]);

  const totalEmissaoEstacionaria = itensSelecionadosEstacionaria.reduce(
    (total, item) => total + +item.emissaoEfetiva,
    0,
  );

  useEffect(() => {
    setTabelaMovel([...itensSelecionadosMovel]);
  }, [itensSelecionadosMovel]);

  useEffect(() => {
    const itensArmazenados = localStorage.getItem('itensSelecionadosMovel');

    const itensSelecionadosMovelIniciais = itensArmazenados ? JSON.parse(itensArmazenados) : [];
    console.log(itensSelecionadosMovelIniciais);
    setItensSelecionadosMovel(itensSelecionadosMovelIniciais);
  }, []);

  useEffect(() => {
    setTabelaEstacionaria([...itensSelecionadosEstacionaria]);
  }, [itensSelecionadosEstacionaria]);

  useEffect(() => {
    const itensArmazenadosEstacionaria = localStorage.getItem('itensSelecionadosEstacionaria');
    const itensSelecionadosEstacionariaIniciais = itensArmazenadosEstacionaria
      ? JSON.parse(itensArmazenadosEstacionaria)
      : [];
    setItensSelecionadosEstacionaria(itensSelecionadosEstacionariaIniciais);
  }, []);

  return (
    <>
      <div className="header">
        <Title level={2}>Escopo 1 - Emissões diretas de GEE</Title>
      </div>
      <div className="header">
        <Title level={3}>Combustão Móvel</Title>
      </div>
      <div className={styles['enter-group']}>
        <Form wrapperCol={{ span: 16 }} layout="horizontal">
          <Row gutter={[4, 4]}>
            <Col span={6}>
              <Form.Item label="Origem">
                <Input
                  value={origemMovel}
                  onChange={(event) => setOrigemMovel(event.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Fonte">
                <Select
                  id="fonte-select"
                  value={fonteMovel}
                  onChange={(value) => setFonteMovel(value)}
                >
                  <Option value="Álcool">Álcool</Option>
                  <Option value="Diesel">Diesel</Option>
                  <Option value="Gasolina">Gasolina</Option>
                </Select>
              </Form.Item>
            </Col>
            {fonteMovel && origemMovel && (
              <Col span={6}>
                <Form.Item label="Litros">
                  <InputNumber
                    id="litros-input"
                    value={consumoTotal}
                    onChange={(value) => setConsumoTotal(value)}
                  />
                </Form.Item>
              </Col>
            )}
            <Col span={24}>
              <Form.Item>
                <Button
                  onClick={handleAdicionarItemMovel}
                  disabled={!adicionarHabilitado}
                  style={{ bottom: '0' }}
                >
                  Adicionar
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <TabelaMovel dados={tabelaMovel} /> {/* novo componente para exibir a tabela */}
      </div>
      <div className="header">
        <Title level={3}>Combustão Estacionária</Title>
      </div>
      <div className={styles['enter-group']}>
        <Form wrapperCol={{ span: 16 }} layout="horizontal">
          <Row gutter={[4, 4]}>
            <Col span={6}>
              <Form.Item label="Origem">
                <Input
                  value={origemEstacionaria}
                  onChange={(event) => setOrigemEstacionaria(event.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Fonte">
                <Select
                  id="fonte-select-estacionaria"
                  value={fonteEstacionaria}
                  onChange={(value) => setFonteEstacionaria(value)}
                >
                  <Option value="Biomassa">Biomassa</Option>
                  <Option value="GLP">GLP</Option>
                </Select>
              </Form.Item>
            </Col>
            {fonteEstacionaria && origemEstacionaria && (
              <Col span={6}>
                <Form.Item label="Consumo">
                  <InputNumber
                    id="consumoTotalEstacionaria-input"
                    value={consumoTotalEstacionaria}
                    onChange={(value) => setConsumoTotalEstacionaria(value)}
                  />
                </Form.Item>
              </Col>
            )}
            <Col span={24}>
              <Form.Item>
                <Button
                  onClick={handleAdicionarItemEstacionaria}
                  disabled={!adicionarEmissaoEstacionariaHabilitado}
                  style={{ bottom: '0' }}
                >
                  Adicionar
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <TabelaEstacionaria dados={tabelaEstacionaria} />
      </div>
    </>
  );
};

export default ScopeOne;
