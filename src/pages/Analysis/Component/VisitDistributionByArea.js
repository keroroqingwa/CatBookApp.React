import React, { Fragment } from 'react';
import {
  Row,
  Col,
  Table,
  Card,
  Checkbox,
  Radio,
} from 'antd';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
  Guide,
  Coord,
  Label,
} from "bizcharts";
import DataSet from "@antv/data-set";
import styles from '../../Charts/chart.less';

const RadioGroup = Radio.Group;

class Donut extends React.Component {
  state = {
  };

  render() {
    const { DataView } = DataSet;
    const { Html } = Guide;

    const { dataSource: { list } } = this.props
    // console.info('dataSource', dataSource)

    // 访问来源 chart
    const getChartHtml = (type) => {
      const data = []
      if (list) {
        const listName = []
        list.forEach(single => {
          single[type].forEach(item => {
            if (listName.indexOf(item.name) === -1) {
              listName.push(item.name)
              data.push({
                key: item.key,
                name: item.name,
                count: item.value,
              })
            }
            else {
              data.forEach(d => {
                if (d.name === item.name) {
                  d.count += item.value
                }
              })
            }
          })
        })
      }

      const dv = new DataView();
      dv.source(data).transform({
        type: "sort",
        callback(a, b) {
          // 排序依据，和原生js的排序callback一致
          return a.key - b.key > 0;
        },
      });

      return (
        <div>
          <Chart height={400} data={dv} forceFit>
            <Coord transpose />
            <Axis
              name="name"
              label={{
                // offset: 12,
              }}
            />
            <Axis name="count" />
            <Tooltip showTitle={false} />
            <Geom
              type="interval"
              position="name*count"
              tooltip={[
                "name*count",
                (name, count) => {
                  return {
                    name,
                    value: `${count}次`,
                  };
                },
              ]}
            />
          </Chart>
        </div>
      )
    };

    return (
      <Fragment>
        <div style={{ padding: '20px' }}>
          <br />
          <Card title="" bordered={true}>
            <Row gutter={16}>
              <Col span={24}>
                {getChartHtml('access_staytime_info')}
              </Col>
            </Row>
          </Card>
        </div>
      </Fragment>
    );
  }
}

export default Donut;
