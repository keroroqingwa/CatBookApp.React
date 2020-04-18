import React, { Component, Fragment } from "react";
import {
  Icon,
  Card,
  Tabs,
  Modal,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../Charts/chart.less';

import DailyVisitTrend from './Component/DailyVisitTrend'
import WeeklyVisitTrend from './Component/WeeklyVisitTrend'
import MonthlyVisitTrend from './Component/MonthlyVisitTrend'

const { TabPane } = Tabs;
const getTips = () => {
  Modal.info({
    title: '【名词解释】',
    width: 800,
    content: (
      <div className={styles.modal_analysis_info}>
        <p><span className='t'>访问趋势：</span>查看小程序的用户访问趋势，包括打开次数、访问次数、访问人数、新用户数、人均访问时长、次均访问时长、平均访问深度。（参见【指标解释】）可以选择时间粒度，按天、周、月汇总查看。当时间粒度为周或月时，次数为累计汇总值，人数去重。</p>
        <h3>【指标解释】</h3>
        <p><span className='t'>打开次数：</span>打开小程序总次数。用户从打开小程序到主动关闭或超时退出小程序的过程，计为一次。</p>
        <p><span className='t'>访问次数：</span>访问小程序页面的总次数。多个页面之间跳转、同一页面的重复访问计为多次访问。</p>
        <p><span className='t'>访问人数：</span>访问小程序页面的总用户数，同一用户多次访问不重复计。</p>
        <p><span className='t'>人均停留时长：</span>平均每个用户停留在小程序页面的总时长，即总停留时长/访问人数。</p>
        <p><span className='t'>次均停留时长：</span>平均每次打开小程序停留在小程序页面的总时长，即总停留时长/打开次数。</p>
        <p><span className='t'>平均访问深度：</span>平均每次打开小程序访问的去重页面数。</p>
      </div>
    ),
    onOk() { },
  });
};

class Groupedcolumn extends Component {
  render() {
    return (
      <Fragment>
        <PageHeaderWrapper title="用户访问小程序数据 日/周/月 趋势">
          <h3 onClick={getTips}><a href='javascript:;'>名词解释 <Icon type="question-circle" theme="outlined" /></a></h3>
          <Card className={styles.chart_card}>
            <div className={styles.salesCard}>
              <Tabs size="large" tabBarStyle={{ marginBottom: 0 }}>
                <TabPane tab="日趋势" key="day">
                  <DailyVisitTrend />
                </TabPane>
                <TabPane tab="周趋势" key="week">
                  <WeeklyVisitTrend />
                </TabPane>
                <TabPane tab="月趋势" key="month">
                  <MonthlyVisitTrend />
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
