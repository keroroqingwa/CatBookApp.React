import React, { Component, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  Tabs,
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './chart.less';
import UserActive from './Component/UserActive'
import BookReadTimeSlot from './Component/BookReadTimeSlot'

const { TabPane } = Tabs;

class Groupedcolumn extends Component {
  render() {
    return (
      <Fragment>
        <PageHeaderWrapper title="">
          <Card className={styles.chart_card}>
            <div className={styles.salesCard}>
              <Tabs size="large" tabBarStyle={{ marginBottom: 0 }}>
                <TabPane tab="用户阅读的时间段分布" key="sales">
                  <Row>
                    <Col span={24}>
                      <BookReadTimeSlot />
                    </Col>
                  </Row>
                </TabPane>
              </Tabs>
            </div>
          </Card>
          <br />
          <Card className={styles.chart_card}>
            <div className={styles.salesCard}>
              <Tabs size="large" tabBarStyle={{ marginBottom: 0 }}>
                <TabPane tab="用户画像" key="sales">
                  <Row>
                    <Col span={18}>
                      <h3>阅读了指定章节数的用户数量</h3>
                      <UserActive />
                    </Col>
                  </Row>
                </TabPane>
              </Tabs>
            </div>
          </Card>
        </PageHeaderWrapper>
      </Fragment>
    );
  }
}

export default Groupedcolumn;
