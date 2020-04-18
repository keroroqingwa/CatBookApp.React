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
      let sum = 0
      if (list) {
        const listName = []
        list.forEach(single => {
          single[type].forEach(item => {
            if (listName.indexOf(item.name) === -1) {
              listName.push(item.name)
              data.push({
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
            sum += item.value
          })
        })
      }

      const dv = new DataView();
      dv.source(data).transform({
        type: "percent",
        field: "count",
        dimension: "name",
        as: "percent",
      });
      const cols = {
        percent: {
          formatter: val => {
            return `${(val * 100).toFixed(2)}%`;
          },
        },
      };

      return (
        <div>
          <Chart
            height={400}
            data={dv}
            scale={cols}
            padding={[50, 100, 0, 0]}
            // padding={0}
            forceFit
          >
            <Coord type='theta' radius={0.75} innerRadius={0.6} />
            <Axis name="percent" />
            <Legend
              position="right"
              offsetY={-100}
              offsetX={-80}
            />
            <Tooltip
              showTitle={false}
              itemTpl={`<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>`}
            />
            <Guide>
              {<Html
                position={["50%", "50%"]}
                html={`<div style="color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;"><span style="color:#262626;font-size:2.5em">${sum}</span>${type === 'access_source_visit_pv' ? '次' : '人'}</div>`}
                alignX="middle"
                alignY="middle"
              />}
            </Guide>
            <Geom
              type="intervalStack"
              position="percent"
              color="name"
              tooltip={[
                "name*percent",
                (name, percent) => {
                  const percent2 = `${(percent * 100).toFixed(2)}%`;
                  return {
                    name,
                    value: percent2,
                  };
                },
              ]}
              style={{
                lineWidth: 1,
                stroke: "#fff",
              }}
            >
              <Label
                content="percent"
                formatter={(val, item) => {
                  return `${item.point.name}（${item.point.count}）：${val}`;
                }}
              />
            </Geom>
          </Chart>
        </div>
      )
    };

    // 折线 chart
    const getLineChartHtml = (type) => {
      const cols = {
        value: {
          min: 0,
        },
        year: {
          range: [0, 1],
        },
      };

      const data = []
      if (list) {
        list.forEach(single => {
          let sum = 0
          single[type].forEach(item => {
            sum += item.value
          })
          data.push({
            name: single.ref_date,
            count: sum,
          })
        })
      }

      return (
        <Chart height={400} data={data} scale={cols} forceFit>
          <Axis name="name" />
          <Axis name="count" />
          <Tooltip
            itemTpl={`<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>${type === 'access_source_visit_pv' ? '打开次数' : '访问人数'}: {value}</li>`}
            crosshairs={{
              type: "y",
            }}
          />
          <Geom type="line" position="name*count" size={2} />
          <Geom
            type="point"
            position="name*count"
            size={4}
            shape="circle"
            style={{
              stroke: "#fff",
              // lineWidth: 1,
            }}
          />
        </Chart>
      )
    }

    return (
      <Fragment>
        <div style={{ padding: '20px' }}>
          <br />
          <Card title="访问来源" bordered={true} style={{ height: '520px' }}>
            <Row gutter={16}>
              <Col span={12}>
                {getChartHtml('access_source_visit_pv')}
                <Row type="flex" justify='center'>
                  <span className={styles.legend_bottom_title}>打开次数</span>
                </Row>
              </Col>
              <Col span={12}>
                {getChartHtml('access_source_visit_uv')}
                <Row type="flex" justify='center'>
                  <span className={styles.legend_bottom_title}>访问人数</span>
                </Row>
              </Col>
            </Row>
          </Card>
          <br /><br />
          <Card title="访问来源 -> 每日打开次数" bordered={true}>
            <Row gutter={16}>
              <Col span={24}>
                {getLineChartHtml('access_source_visit_pv')}
              </Col>
            </Row>
          </Card>
          <br /><br />
          <Card title="访问来源 -> 每日访问人数" bordered={true}>
            <Row gutter={16}>
              <Col span={24}>
                {getLineChartHtml('access_source_visit_uv')}
              </Col>
            </Row>
          </Card>
        </div>
      </Fragment>
    );
  }
}

export default Donut;
