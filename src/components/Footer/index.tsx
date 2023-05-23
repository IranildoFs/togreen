import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  const defaultMessage = 'Todos os direitos reservados';

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'TooGreen',
          title: 'TooGreen',
          href: '',
          blankTarget: false,
        },
      ]}
    />
  );
};

export default Footer;
