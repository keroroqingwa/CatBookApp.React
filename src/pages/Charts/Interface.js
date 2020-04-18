import React, { Component, Fragment } from 'react';
import {
  Row,
  Col,
  Icon,
  Card,
  Table,
  Tabs,
  DatePicker,
  Input,
  Button,
  Select,
} from 'antd';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  // Util
} from "bizcharts";
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './chart.less';

// import InterfaceCall from './Component/BookTimeSlot'

const { TabPane } = Tabs;

class Groupedcolumn extends Component {
  render() {
    return (
      <Fragment>
        <PageHeaderWrapper title="">
          <Card className={styles.chart_card}>
            <div className={styles.salesCard}>
              <Tabs size="large" tabBarStyle={{ marginBottom: 0 }}>
                <TabPane tab="接口调用统计" key="sales">
                  <Row>
                    <Col span={24}>
                      <h3>线上接口调用</h3>
                      x：日期
                      y：小说搜索次数，小说介绍页打开次数，小说章节打开次数
                    {/* <InterfaceCall /> */}
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
