import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        // {
        //   key: 'Pro 首页',
        //   title: 'Pro 首页',
        //   href: 'https://pro.ant.design',
        //   blankTarget: true,
        // },
        {
          key: 'github',
          title: <Icon type="github" />,
          href: 'https://github.com/keroroqingwa/book.somethingwhat.com',
          blankTarget: true,
        },
        // {
        //   key: 'Ant Design',
        //   title: 'Ant Design',
        //   href: 'https://ant.design',
        //   blankTarget: true,
        // },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2020 <a target='_blank' rel="noopener noreferrer" href='https://www.somethingwhat.com'>www.somethingwhat.com</a>
          <br />
          技术讨论群：875607244
          <br />
          微信咨询：keroroqingwa
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
