import React, { Component, Fragment } from "react";
import {
  Row,
  Col,
  Card,
  Tabs,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './chart.less';

import UserNews from './Component/UserNews'
import UserTimeSlot from './Component/UserTimeSlot'

const { TabPane } = Tabs;

class Groupedcolumn extends Component {
  render() {
    return (
      <Fragment>
        <PageHeaderWrapper title="">
          <Card className={styles.chart_card}>
            <div className={styles.salesCard}>
              <Tabs size="large" tabBarStyle={{ marginBottom: 0 }}>
                <TabPane tab="book用户增长统计" key="sales">
                  <UserNews />
                </TabPane>
              </Tabs>
            </div>
          </Card>
          <br />
          <Card className={styles.chart_card}>
            <div className={styles.salesCard}>
              <Tabs size="large" tabBarStyle={{ marginBottom: 0 }}>
                <TabPane tab="新增用户的时间段分布" key="sales">
                  <Row>
                    <Col span={24}>
                      <UserTimeSlot />
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
