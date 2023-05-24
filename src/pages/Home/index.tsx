import { Image, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

import styles from './index.less';

const { Title } = Typography;

const Home: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(1); // Estado para controlar a imagem atual

  const getNextImage = () => {
    setCurrentImage((prevImage) => {
      // Incrementa o valor da imagem atual e volta para 1 se chegar em 3
      return prevImage === 2 ? 1 : prevImage + 1;
    });
  };

  useEffect(() => {
    const interval = setInterval(getNextImage, 10000); // Atualiza a imagem a cada 3 segundos

    return () => {
      clearInterval(interval); // Limpa o intervalo quando o componente é desmontado
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h1 className={styles.title}>Medindo seu impacto, cultivando um legado</h1>
        <h2 className={styles.subtitle}>
          Nossa calculadora revela a quantidade de carbono emitida, mostrando o número de árvores
          que você pode plantar para semear um futuro sustentável.
        </h2>
      </div>

      <Image
        src={`/images/tree${currentImage}.svg`}
        alt="Tree Calculation"
        preview={false}
        className={styles.image}
      />
    </div>
  );
};

export default Home;
