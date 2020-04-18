import React from "react";
import { Spin } from 'antd';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
} from "bizcharts";
import { connect } from 'dva';

// 查询列表数据url
const queryDataUrl = 'statistics/getBookUserTimeSlotStatistic';

@connect(({ statistics, loading }) => ({
  statistics,
  loading: loading.effects[queryDataUrl],
}))
class Basiccolumn extends React.Component {

  componentDidMount() {
    this.loadData();
  }

  /**
   * 加载数据
   */
  loadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: queryDataUrl,
    });
  };

  render() {
    const {
      loading,
      statistics: { resByBookUserTimeSlotStatistic },
    } = this.props;

    let data = null
    if (resByBookUserTimeSlotStatistic) {
      data = []
      resByBookUserTimeSlotStatistic.forEach(item => {
        data.push({
          time: `${item.h}:00`,
          新增用户: item.total,
        })
      })
    }

    return (
      <Spin spinning={loading}>
        <div>
          <Chart height={400} data={data} forceFit>
            <Axis name="time" />
            <Axis name="新增用户" />
            <Tooltip
              crosshairs={{
                type: "y",
              }}
            />
            <Geom type="interval" position="time*新增用户" />
          </Chart>
        </div>
      </Spin>
    );
  }
}

export default Basiccolumn;
