import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Table, Divider } from 'antd';
import Link from 'umi/link';
import moment from "moment";
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getPageQuery } from '../../../utils/utils';
import styles from '../BasicProfile.less';

const { Description } = DescriptionList;
const queryDataUrl = 'bookUser/getByOpenid';
const getBookReadRecordSummaryUrl = 'bookUser/getBookReadRecordSummary';
const getPagedByLastReadingUrl = 'bookReadRecord/getPagedByLastReading';

const chapterNameRender = (val, record) => <a target='_blank' rel='noopener noreferrer' href={record.chapterLink}>{val}</a>
const readRecordColumns = [
  {
    title: '作者',
    dataIndex: 'author',
    key: 'author',
  },
  {
    title: '小说名称',
    dataIndex: 'bookName',
    key: 'bookName',
  },
  {
    title: '最近阅读的章节',
    dataIndex: 'chapterName',
    key: 'chapterName',
    render: chapterNameRender,
  },
  {
    title: '最后阅读时间',
    dataIndex: 'lastModificationTime',
    key: 'lastModificationTime',
    render: (text, record) => <Fragment>{moment(record.lastModificationTime || record.creationTime).format('YYYY/MM/DD HH:mm:ss')}</Fragment>,
  },
];

@connect(({ bookUser, bookReadRecord, loading }) => ({
  bookUser,
  bookReadRecord,
  loading: loading.effects[queryDataUrl],
  loadingByBookSummary: loading.effects[getBookReadRecordSummaryUrl],
  loadingBytRecentReading: loading.effects[getPagedByLastReadingUrl],
}))
class Detail extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    const { openid } = getPageQuery();
    dispatch({
      type: queryDataUrl,
      payload: { openid },
    });
    dispatch({
      type: getBookReadRecordSummaryUrl,
      payload: { openid },
    });
    dispatch({
      type: getPagedByLastReadingUrl,
      payload: { openid },
    });
  }

  getGenderName = val => {
    let sex = ''
    if (val === '1') sex = '男';
    else if (val === '2') sex = '女';
    else sex = '未知';
    return sex;
  };

  render() {
    const {
      loading,
      loadingByBookSummary,
      loadingBytRecentReading,
      bookUser: { resByGetByOpenid, resByGetBookReadRecordSummary },
      bookReadRecord: { resByGetPagedByLastReading },
    } = this.props;

    return (
      <PageHeaderWrapper title="详情页">
        <Card bordered={false} loading={loading || loadingByBookSummary}>
          {resByGetByOpenid !== undefined && (
            <DescriptionList size="large" title="" style={{ marginBottom: 32 }}>
              <div className={styles.title2}>1. 基础信息</div>
              <Description term="id">{resByGetByOpenid.id}</Description>
              <Description term="appid">{resByGetByOpenid.appid}</Description>
              <Description term="用户id">{resByGetByOpenid.userId}</Description>
              <Description term="openid">{resByGetByOpenid.openid}</Description>
              <Description term="昵称">{resByGetByOpenid.nickName}</Description>
              <Description term="头像">
                <img className={styles.avatar_img} src={resByGetByOpenid.avatarUrl} alt="" />
              </Description>
              <Description term="性别">{this.getGenderName(resByGetByOpenid.gender)}</Description>
              <Description term="国家">{resByGetByOpenid.country}</Description>
              <Description term="省份">{resByGetByOpenid.province}</Description>
              <Description term="城市">{resByGetByOpenid.city}</Description>
              <Description term="语言">{resByGetByOpenid.language}</Description>
              <Description term="创建时间">{moment(resByGetByOpenid.creationTime).format('YYYY/MM/DD HH:mm:ss')}</Description>
              <Description term="更新时间">{!!resByGetByOpenid.lastModificationTime === true ? moment(resByGetByOpenid.creationTime).format('YYYY/MM/DD HH:mm:ss') : '--'}</Description>
              {/* <Description term="阅读时长(分钟)">{resByGetByOpenid.Read_Minute}</Description> */}
            </DescriptionList>
          )}
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="" style={{ marginBottom: 32 }}>
            <div className={styles.title2}>2. 其他信息</div>
            {resByGetBookReadRecordSummary !== undefined && (
              <div>
                <Description className={styles.newline} term="阅读时长">{`${Math.floor(resByGetBookReadRecordSummary.readMinutes / 60)}小时${resByGetBookReadRecordSummary.readMinutes % 60}分钟`}</Description>
                <Description className={styles.newline} term="阅读记录">
                  <span className={styles.padding_right_20}>共{resByGetBookReadRecordSummary.bookCount}本书{resByGetBookReadRecordSummary.chapterCount}章节</span>
                  <Link to={`/book/readrecord-list.html?openid=${resByGetByOpenid.openid}`}>查看详细</Link>
                </Description>
              </div>
            )}
          </DescriptionList>
          <DescriptionList size="large" title="" style={{ marginBottom: 32 }}>
            <div className={styles.title2}>3. 最近阅读（最近十本小说）</div>
            <Table
              bordered={true}
              rowKey={record => record.id}
              style={{ marginBottom: 16 }}
              pagination={false}
              loading={loadingBytRecentReading}
              dataSource={resByGetPagedByLastReading === undefined ? [] : resByGetPagedByLastReading.items}
              columns={readRecordColumns}
            />
          </DescriptionList>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Detail;