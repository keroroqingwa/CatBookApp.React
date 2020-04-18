import React, { Component, Fragment } from "react";
import {
  Icon,
  Card,
  Tabs,
  Modal,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../Charts/chart.less';

import DailyRetain from '@/pages/Analysis/Component/DailyRetain'
import WeeklyRetain from '@/pages/Analysis/Component/WeeklyRetain'
import MonthlyRetain from '@/pages/Analysis/Component/MonthlyRetain'

const { TabPane } = Tabs;
const getTips = () => {
  Modal.info({
    title: '【名词解释】',
    width: 800,
    content: (
      <div className={styles.modal_analysis_info}>
        <p><span className='t'>访问留存：</span>查看选定时间范围内，小程序用户的访问留存情况。可以选择时间粒度，按天、周、月查看。当时间粒度为周或月时，人数去重。</p>
        <p><span className='t'>新增留存：</span>统计指定时间新增（即首次访问小程序）的用户，在之后的第N天（或周、月），再次访问小程序的用户数占比；例如1月1日首次访问小程序的用户数为100，1月3日这些用户中仍有10人访问小程序，则2天后留存率为10.0%。</p>
        <p><span className='t'>活跃留存：</span>统计指定时间活跃（即访问小程序）的用户，在之后的第N天（或周、月），再次访问小程序的用户数占比。例如1月1日访问小程序的用户数为1000，1月3日这些用户中仍有300人访问小程序，则2天后留存率为30.0%。</p>
      </div>
    ),
    onOk() { },
  });
};

class Groupedcolumn extends Component {
  render() {
    return (
      <Fragment>
        <PageHeaderWrapper title="用户访问小程序数据 日/周/月 留存">
          <h3 onClick={getTips}><a href='javascript:;'>名词解释 <Icon type="question-circle" theme="outlined" /></a></h3>
          <Card className={styles.chart_card}>
            <div className={styles.salesCard}>
              <Tabs size="large" tabBarStyle={{ marginBottom: 0 }}>
                <TabPane tab="日留存" key="day">
                  <DailyRetain />
                </TabPane>
                <TabPane tab="周留存" key="week">
                  <WeeklyRetain />
                </TabPane>
                <TabPane tab="月留存" key="month">
                  <MonthlyRetain />
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
