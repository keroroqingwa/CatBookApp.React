import React from "react";
import {
  Row,
  Col,
  Spin,
} from 'antd';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from "bizcharts";
import DataSet from "@antv/data-set";
import { connect } from 'dva';
// import styles from '../chart.less';

// 查询列表数据url
const queryDataUrl = 'statistics/getByBookReadTimeSlotStatistics';

@connect(({ statistics, loading }) => ({
  statistics,
  loading: loading.effects[queryDataUrl],
}))
class Donut extends React.Component {

  componentDidMount() {
    this.loadData();
  }

  /**
   * 加载数据
   */
  loadData = paramsObj => {
    // 初始查询时的查询参数
    const { dispatch } = this.props;
    dispatch({
      type: queryDataUrl,
      payload: paramsObj,
    });
  };

  render() {
    const {
      loading,
      statistics: { resByBookReadTimeSlotStatistics },
    } = this.props;

    const res = {
      data_book: [0],
      data_chapter: [0],
      data_user: [0],
      columns: [''],
    }
    if (resByBookReadTimeSlotStatistics && resByBookReadTimeSlotStatistics.columns) {
      res.data_book = resByBookReadTimeSlotStatistics.data_book
      res.data_chapter = resByBookReadTimeSlotStatistics.data_chapter
      res.data_user = resByBookReadTimeSlotStatistics.data_user
      res.columns = resByBookReadTimeSlotStatistics.columns
    }

    const data1 = {}
    const data2 = {}
    const data3 = {}
    const columns = []
    res.columns.forEach((key, idx) => {
      data1[`${key}:00`] = res.data_book[idx]
      data2[`${key}:00`] = res.data_chapter[idx]
      data3[`${key}:00`] = res.data_user[idx]
      columns.push(`${key}:00`)
    })

    const data = [
      { ...data1, name: '阅读小说数' },
      { ...data2, name: '阅读小说章节数' },
      { ...data3, name: '参与阅读的用户数' },
    ];

    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: "fold",
      fields: columns,
      key: "day",
      value: "total", // value字段
    });

    return (
      <Spin spinning={loading}>
        <Row gutter={16}>
          <Col span={24}>
            <Chart height={400} data={dv} forceFit>
              <Axis title={false} name="day" />
              <Axis title={false} name="total" />
              <Legend />
              <Tooltip
                crosshairs={{
                  type: "y",
                }}
              />
              <Geom
                type="interval"
                position="day*total"
                color="name"
                adjust={[
                  {
                    type: "dodge",
                    marginRatio: 1 / 32,
                  },
                ]}
              />
            </Chart>
          </Col>
        </Row>
      </Spin>
    );
  }
}

export default Donut;
