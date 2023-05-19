import { Button, Col, Form, Input, InputNumber, Row, Select, Table, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { columnsEfluente } from './columns/columnsEfluente';
import { columnsEnergiaEletrica } from './columns/columnsEnergiaEletrica';

import styles from './index.less';
import {
  emissaoEfluente,
  emissaoEnergiaEletrica,
  ItemSelecionadoEfluente,
  ItemSelecionadoEnergiaEletrica,
} from './scopeOneTypes/fatoresEmissao';
import { gasesEE } from './scopeOneTypes/pag';

const { Option } = Select;
const { Title } = Typography;

const STORAGE_KEY_ENERGIA = 'itensSelecionadosEnergiaEletrica';
const STORAGE_KEY_EFLUENTE = 'itensSelecionadosEfluente';

const ScopeTwo: React.FC = () => {
  const [origemEnergiaEletrica, setOrigemEnergiaEletrica] = useState('');

  const [consumoTotalEnergiaEletrica, setConsumoTotalEnergiaEletrica] = useState(0);
  const [itensSelecionadosEnergiaEletrica, setItensSelecionadosEnergiaEletrica] = useState<
    ItemSelecionadoEnergiaEletrica[]
  >([]);
  const [tabelaEnergiaEletrica, setTabelaEnergiaEletrica] = useState<
    ItemSelecionadoEnergiaEletrica[]
  >([]);

  const columnsEnergiaEletrica_ = [
    ...columnsEnergiaEletrica,
    {
      title: 'Remover',
      key: 'remover',
      render: (_, item, index) => (
        <Button onClick={() => handleRemoverItemEnergiaEletrica(index)}>Remover</Button>
      ),
    },
  ];

  const TabelaEnergiaEletrica: React.FC<{ dados: ItemSelecionadoEnergiaEletrica[] }> = ({
    dados,
  }) => {
    return (
      <Table
        dataSource={dados}
        columns={columnsEnergiaEletrica_}
        footer={() =>
          totalEmissaoEnergiaEletrica
            ? `A emissão total de energia elétrica foi de ${totalEmissaoEnergiaEletrica.toFixed(
                3,
              )} tCO2e`
            : ''
        }
      />
    );
  };

  const handleAdicionarItemEnergiaEletrica = () => {
    let emissaoEfetiva = 0;

    // Iterar sobre os fatores de emissão correspondentes à fonte de combustível utilizada
    emissaoEnergiaEletrica.forEach((combustivel) => {
      if (combustivel.fonte === 'Energia') {
        // Iterar sobre os fatores de emissão correspondentes aos gases de efeito estufa (CO2, CH4 e N2O)
        combustivel.fatores.forEach((fator) => {
          if (fator.gas === 'CO2') {
            emissaoEfetiva += consumoTotalEnergiaEletrica * (fator.valor / 1000);
          }
        });
      }
    });

    const novoItemEnergiaEletrica = {
      origemEnergiaEletrica,
      fonteEnergiaEletrica: 'Energia Elétrica',
      consumoTotal: consumoTotalEnergiaEletrica.toFixed(3),
      emissaoEfetiva: emissaoEfetiva.toFixed(3),
    };

    setItensSelecionadosEnergiaEletrica([
      ...itensSelecionadosEnergiaEletrica,
      novoItemEnergiaEletrica,
    ]);
    setOrigemEnergiaEletrica('');
    setConsumoTotalEnergiaEletrica(0);

    setTabelaEnergiaEletrica([...tabelaEnergiaEletrica, novoItemEnergiaEletrica]); // adiciona o novo item na tabela
    localStorage.setItem(
      STORAGE_KEY_ENERGIA,
      JSON.stringify([...itensSelecionadosEnergiaEletrica, novoItemEnergiaEletrica]),
    );
  };

  const handleRemoverItemEnergiaEletrica = (index: number) => {
    const novaListaItensEnergiaEletrica = [...itensSelecionadosEnergiaEletrica];
    novaListaItensEnergiaEletrica.splice(index, 1);
    setItensSelecionadosEnergiaEletrica(novaListaItensEnergiaEletrica);

    localStorage.setItem(STORAGE_KEY_ENERGIA, JSON.stringify(novaListaItensEnergiaEletrica));
  };
  const adicionarHabilitado = useMemo(() => {
    return consumoTotalEnergiaEletrica > 0;
  }, [consumoTotalEnergiaEletrica]);

  const totalEmissaoEnergiaEletrica = itensSelecionadosEnergiaEletrica.reduce(
    (total, item) => total + +item.emissaoEfetiva,
    0,
  );

  const [origemEfluente, setOrigemEfluente] = useState('');
  const [fonteEfluente, setFonteEfluente] = useState('');
  const [consumoTotalEfluente, setConsumoTotalEfluente] = useState(0);
  const [itensSelecionadosEfluente, setItensSelecionadosEfluente] = useState<
    ItemSelecionadoEfluente[]
  >([]);
  const [tabelaEfluente, setTabelaEfluente] = useState<ItemSelecionadoEfluente[]>([]);

  const columnsEfluente_ = [
    ...columnsEfluente,
    {
      title: 'Remover',
      key: 'remover',
      render: (_, item, index) => (
        <Button onClick={() => handleRemoverItemEfluente(index)}>Remover</Button>
      ),
    },
  ];

  const TabelaEfluente: React.FC<{ dados: ItemSelecionadoEfluente[] }> = ({ dados }) => {
    return (
      <Table
        dataSource={dados}
        columns={columnsEfluente_}
        footer={() =>
          totalEmissaoEfluente
            ? `A emissão total de efluente foi de ${totalEmissaoEfluente.toFixed(3)} tCO2e`
            : ''
        }
      />
    );
  };

  const handleAdicionarItemEfluente = () => {
    const emissaoFatoresEfluente = emissaoEfluente.find(
      (combustivel) => combustivel.fonte === 'Efluente',
    ).fatores;

    let emissaoEfetiva = 0;
    emissaoFatoresEfluente.forEach((fator) => {
      let gasEE = gasesEE.find((gas) => gas.gas === fator.gas);

      emissaoEfetiva = ((consumoTotalEfluente * 321) / 10000) * (fator.valor / 1000) * gasEE.pag;
    });
    const novoItemEfluente = {
      origemEfluente,
      fonteEfluente: 'Efluente',
      consumoTotal: consumoTotalEfluente.toFixed(3),
      emissaoEfetiva: emissaoEfetiva.toFixed(3),
    };

    setItensSelecionadosEfluente((prevItensSelecionados) => [
      ...prevItensSelecionados,
      novoItemEfluente,
    ]);
    setOrigemEfluente('');
    setFonteEfluente('');
    setConsumoTotalEfluente(0);

    setTabelaEfluente((prevTabelaEfluente) => [...prevTabelaEfluente, novoItemEfluente]);
    localStorage.setItem(
      STORAGE_KEY_EFLUENTE,
      JSON.stringify([...itensSelecionadosEfluente, novoItemEfluente]),
    );
  };
  const handleRemoverItemEfluente = (index: number) => {
    const novaListaItensEfluente = [...itensSelecionadosEfluente];
    novaListaItensEfluente.splice(index, 1);
    setItensSelecionadosEfluente(novaListaItensEfluente);

    localStorage.setItem(STORAGE_KEY_EFLUENTE, JSON.stringify(novaListaItensEfluente));
  };
  const adicionarEmissaoEfluenteHabilitado = useMemo(() => {
    return consumoTotalEfluente > 0;
  }, [consumoTotalEfluente]);

  const totalEmissaoEfluente = itensSelecionadosEfluente.reduce(
    (total, item) => total + +item.emissaoEfetiva,
    0,
  );

  useEffect(() => {
    setTabelaEnergiaEletrica([...itensSelecionadosEnergiaEletrica]);
  }, [itensSelecionadosEnergiaEletrica]);

  useEffect(() => {
    const itensArmazenados = localStorage.getItem('itensSelecionadosEnergiaEletrica');

    const itensSelecionadosEnergiaEletricaIniciais = itensArmazenados
      ? JSON.parse(itensArmazenados)
      : [];
    console.log(itensSelecionadosEnergiaEletricaIniciais);
    setItensSelecionadosEnergiaEletrica(itensSelecionadosEnergiaEletricaIniciais);
  }, []);

  useEffect(() => {
    setTabelaEfluente([...itensSelecionadosEfluente]);
  }, [itensSelecionadosEfluente]);

  useEffect(() => {
    const itensArmazenadosEfluente = localStorage.getItem('itensSelecionadosEfluente');
    const itensSelecionadosEfluenteIniciais = itensArmazenadosEfluente
      ? JSON.parse(itensArmazenadosEfluente)
      : [];
    setItensSelecionadosEfluente(itensSelecionadosEfluenteIniciais);
  }, []);

  return (
    <>
      <div className="header">
        <Title level={2}>Escopo 2 - Emissões indiretas de GEE</Title>
      </div>
      <div className="header">
        <Title level={3}>Energia Elétrica</Title>
      </div>
      <div className={styles['enter-group']}>
        <Form wrapperCol={{ span: 16 }} layout="horizontal">
          <Row gutter={[4, 4]}>
            <Col span={6}>
              <Form.Item label="Origem">
                <Input
                  value={origemEnergiaEletrica}
                  onChange={(event) => setOrigemEnergiaEletrica(event.target.value)}
                />
              </Form.Item>
            </Col>

            {origemEnergiaEletrica && (
              <Col span={6}>
                <Form.Item label="Consumo (KWh)">
                  <InputNumber
                    id="litros-input"
                    value={consumoTotalEnergiaEletrica}
                    onChange={(value) => setConsumoTotalEnergiaEletrica(value)}
                  />
                </Form.Item>
              </Col>
            )}
            <Col span={24}>
              <Form.Item>
                <Button
                  onClick={handleAdicionarItemEnergiaEletrica}
                  disabled={!adicionarHabilitado}
                  style={{ bottom: '0' }}
                >
                  Adicionar
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <TabelaEnergiaEletrica dados={tabelaEnergiaEletrica} />{' '}
        {/* novo componente para exibir a tabela */}
      </div>
      <div className="header">
        <Title level={3}>Efluente</Title>
      </div>
      <div className={styles['enter-group']}>
        <Form wrapperCol={{ span: 16 }} layout="horizontal">
          <Row gutter={[4, 4]}>
            <Col span={6}>
              <Form.Item label="Origem">
                <Input
                  value={origemEfluente}
                  onChange={(event) => setOrigemEfluente(event.target.value)}
                />
              </Form.Item>
            </Col>

            {origemEfluente && (
              <Col span={6}>
                <Form.Item label="Volume (L)">
                  <InputNumber
                    id="consumoTotalEfluente-input"
                    value={consumoTotalEfluente}
                    onChange={(value) => setConsumoTotalEfluente(value)}
                  />
                </Form.Item>
              </Col>
            )}
            <Col span={24}>
              <Form.Item>
                <Button
                  onClick={handleAdicionarItemEfluente}
                  disabled={!adicionarEmissaoEfluenteHabilitado}
                  style={{ bottom: '0' }}
                >
                  Adicionar
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <TabelaEfluente dados={tabelaEfluente} />
      </div>
    </>
  );
};

export default ScopeTwo;
