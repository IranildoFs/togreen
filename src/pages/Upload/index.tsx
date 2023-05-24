import { InboxOutlined } from '@ant-design/icons';
import { message, Typography, Upload } from 'antd';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { read, utils } from 'xlsx';

const { Dragger } = Upload;
const { Title } = Typography;

const UploadComponent: React.FC = () => {
  const handleDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];

    const reader = new FileReader();

    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result as ArrayBuffer);
      const workbook = read(data, { type: 'array' });

      const storageKeys = {
        MOVEL: 'itensSelecionadosMovel',
        ESTACIONARIA: 'itensSelecionadosEstacionaria',
        ENERGIA: 'itensSelecionadosEnergiaEletrica',
        EFLUENTE: 'itensSelecionadosEfluente',
        MOVEL_3: 'itensSelecionadosMovel_3',
        ESTACIONARIA_3: 'itensSelecionadosEstacionaria_3',
        ENERGIA_3: 'itensSelecionadosEnergiaEletrica_3',
        RESIDUO_3: 'itensSelecionadosResiduo_3',
        // Adicione aqui as outras chaves de storage
      };

      Object.entries(storageKeys).forEach(([key, storageItem]) => {
        const worksheet = workbook.Sheets[key];
        if (worksheet) {
          const jsonData = utils.sheet_to_json(worksheet, { header: 1 });

          const [headerRow, ...dataRows] = jsonData;
          const formattedData = dataRows.map((row) => {
            return Object.fromEntries(headerRow.map((header, index) => [header, row[index]]));
          });

          // Armazenar formattedData no storage
          localStorage.setItem(storageItem, JSON.stringify(formattedData));
        }
      });

      message.success('Arquivo carregado com sucesso!');
    };

    reader.readAsArrayBuffer(file);
  }, []);

  const { getRootProps } = useDropzone({ onDrop: handleDrop });

  return (
    <>
      <Title level={2}>Upload de planilha Excel</Title>
      <Dragger {...getRootProps()} accept=".xlsx, .xls" multiple={false}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Arraste e solte o arquivo Excel aqui para fazer o upload.</p>
        <p className="ant-upload-hint">Formatos suportados: .xlsx, .xls</p>
      </Dragger>
    </>
  );
};

export default UploadComponent;
