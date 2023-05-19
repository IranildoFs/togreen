import { Col, List, Progress, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

import styles from './index.less';

import { Statistic } from 'antd';
import CountUp from 'react-countup';

const formatter = (value: number) => <CountUp end={value} separator="." />;

const { Title } = Typography;

const Results: React.FC = () => {
  const [soma, setSoma] = useState(0);
  const [numeroArvores, setNumeroArvores] = useState(0);

  const [totalSelecionadosMovel, setTotalSelecionadosMovel] = useState(0);
  const [totalSelecionadosEstacionaria, setTotalSelecionadosEstacionaria] = useState(0);
  const [totalSelecionadosEnergia, setTotalSelecionadosEnergia] = useState(0);
  const [totalSelecionadosEfluente, setTotalSelecionadosEfluente] = useState(0);
  const [totalSelecionadosMovel_3, setTotalSelecionadosMovel_3] = useState(0);
  const [totalSelecionadosEstacionaria_3, setTotalSelecionadosEstacionaria_3] = useState(0);
  const [totalSelecionadosEnergia_3, setTotalSelecionadosEnergia_3] = useState(0);
  const [totalSelecionadosResiduo_3, setTotalSelecionadosResiduo_3] = useState(0);

  useEffect(() => {
    const storageKeys = {
      MOVEL: 'itensSelecionadosMovel',
      ESTACIONARIA: 'itensSelecionadosEstacionaria',
      ENERGIA: 'itensSelecionadosEnergiaEletrica',
      EFLUENTE: 'itensSelecionadosEfluente',
      MOVEL_3: 'itensSelecionadosMovel_3',
      ESTACIONARIA_3: 'itensSelecionadosEstacionaria_3',
      ENERGIA_3: 'itensSelecionadosEnergiaEletrica_3',
      RESIDUO_3: 'itensSelecionadosResiduo_3',
    };

    const totals = {};

    Object.entries(storageKeys).forEach(([key, storageItem]) => {
      const items = JSON.parse(localStorage.getItem(storageItem)) || [];

      if (key === 'RESIDUO_3') {
        totals[key] = items.reduce((total, item) => {
          if (item.fonteResiduo === 'Evitadas') {
            return total - +item.emissaoEfetiva;
          }
          return total + +item.emissaoEfetiva;
        }, 0);
      } else {
        totals[key] = items.reduce((total, item) => total + +item.emissaoEfetiva, 0);
      }
    });

    setTotalSelecionadosMovel(totals.MOVEL);
    setTotalSelecionadosEstacionaria(totals.ESTACIONARIA);
    setTotalSelecionadosEnergia(totals.ENERGIA);
    setTotalSelecionadosEfluente(totals.EFLUENTE);
    setTotalSelecionadosMovel_3(totals.MOVEL_3);
    setTotalSelecionadosEstacionaria_3(totals.ESTACIONARIA_3);
    setTotalSelecionadosEnergia_3(totals.ENERGIA_3);
    setTotalSelecionadosResiduo_3(totals.RESIDUO_3);

    const soma =
      totals.MOVEL +
      totals.ESTACIONARIA +
      totals.ENERGIA +
      totals.EFLUENTE +
      totals.MOVEL_3 +
      totals.ESTACIONARIA_3 +
      totals.ENERGIA_3 +
      totals.RESIDUO_3;

    setSoma(soma);
    setNumeroArvores(Math.ceil((soma / 0.18) * 1.2));
  }, []);

  const scope1 = [
    {
      title: `Total combustão móvel`,
      description: `${totalSelecionadosMovel.toFixed(3)} tCO2e`,
      percent: ((totalSelecionadosMovel / soma) * 100).toFixed(0),
    },
    {
      title: `Total combustão estacionária `,
      description: `${totalSelecionadosEstacionaria.toFixed(3)} tCO2e`,
      percent: ((totalSelecionadosEstacionaria / soma) * 100).toFixed(0),
    },
  ];
  const scope2 = [
    {
      title: `Total energia elétrica`,
      description: `${totalSelecionadosEnergia.toFixed(3)} tCO2e`,
      percent: ((totalSelecionadosEnergia / soma) * 100).toFixed(0),
    },
    {
      title: `Total efluente`,
      description: `${totalSelecionadosEfluente.toFixed(3)} tCO2e`,
      percent: ((totalSelecionadosEfluente / soma) * 100).toFixed(0),
    },
  ];

  const scope3 = [
    {
      title: `Total combustão móvel`,
      description: `${totalSelecionadosMovel_3.toFixed(3)} tCO2e`,
      percent: ((totalSelecionadosMovel_3 / soma) * 100).toFixed(0),
    },
    {
      title: `Total combustão estacionária`,
      description: `${totalSelecionadosEstacionaria_3.toFixed(3)} tCO2e`,
      percent: ((totalSelecionadosEstacionaria_3 / soma) * 100).toFixed(0),
    },
    {
      title: `Total energia elétrica`,
      description: `${totalSelecionadosEnergia_3.toFixed(3)} tCO2e`,
      percent: ((totalSelecionadosEnergia_3 / soma) * 100).toFixed(0),
    },
    {
      title: `Total resíduos sólidos`,
      description: `${totalSelecionadosResiduo_3.toFixed(3)} tCO2e`,
      percent: ((totalSelecionadosResiduo_3 / soma) * 100).toFixed(0),
    },
  ];

  const scopes = [
    { title: 'Escopo 1:', dataSource: scope1 },
    { title: 'Escopo 2:', dataSource: scope2 },
    { title: 'Escopo 3:', dataSource: scope3 },
  ];

  return (
    <>
      <Title level={2}>Relatório de Emissão de GEE</Title>
      <Title level={3}>Resultados totais</Title>

      <Row gutter={16}>
        <Col span={8} style={{ paddingRight: '8px' }}>
          <div className={styles['enter-group']}>
            <Statistic title="Total de emissões de carbono em tCO2e" value={soma.toFixed(3)} />
          </div>
        </Col>

        <Col span={8} style={{ paddingRight: '8px' }}>
          <div className={styles['enter-group']}>
            <Statistic
              title="Quantidade de Árvores para Neutralização/Compensação"
              value={numeroArvores}
              precision={2}
              formatter={formatter}
            />
          </div>
        </Col>
      </Row>

      <Title level={3}>Resultados por escopos</Title>
      <Row gutter={[16, 16]}>
        {scopes.map((scope, index) => (
          <Col xs={24} sm={24} md={8} key={index}>
            <div>
              <Title level={4}>{scope.title}</Title>
              <List
                size="small"
                bordered
                itemLayout="horizontal"
                dataSource={scope.dataSource}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.title}
                      description={
                        <>
                          {item.description}
                          <Progress
                            percent={item.percent}
                            strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                          />
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Results;
