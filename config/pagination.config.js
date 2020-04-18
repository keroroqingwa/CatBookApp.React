/**
 * 分页配置
 */
const paginstions = {
  defaultPageSize: 20, // 初始的每页条数
  showSizeChanger: true, // 是否可以改变 pageSize
  showQuickJumper: true, // 是否可以快速跳转至某页
  size: '', // 当为「small」时，是小尺寸分页
  showTotal: total => `共 ${total} 条`,

  // onChange: null,
  // onShowSizeChange: null,
};

export default paginstions;
