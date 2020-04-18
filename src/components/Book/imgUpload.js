
import React, { Component } from 'react';
import { Upload, Button, Icon, message } from 'antd';
// import { RequestHeaders } from '../../constants/RequestHeaders';
import catConfig from '../../../config/cat.config';

class MyUpload extends React.Component {
  state = {
    fileList: [],
    // 验证文件总数量, 超出则不允许加入队列，默认为 1
    fileNumLimit: 1,
    // 验证单个文件大小是否超出限制, 超出则不允许加入队列，默认为 2MB
    fileSizeLimit: 1024 * 1024 * 2,
  }

  handleChange = (info) => {
    const { fileNumLimit } = this.state
    let { fileList } = info;

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-1 * fileNumLimit);

    // 2. Read from response and show file link
    fileList = fileList.map((file) => {
      // console.info('file', file)
      if (file.response) {
        // Component will show file.url as link
        file.url = `${catConfig.proxy}/${file.response.url}`;
      }

      const { onChange } = this.props
      if (onChange) onChange(info)

      return file;
    });

    // 3. Filter successfully uploaded files according to response from server
    fileList = fileList.filter((file) => {
      if (file.response) {
        return file.response.status === 'success';
      }
      return true;
    });

    this.setState({ fileList });
  }

  beforeUpload = (file) => {
    const { fileSizeLimit } = this.state
    // const isJPG = file.type === 'image/jpeg';
    const isImage = (file.type === 'image/jpeg' || file.type === 'image/png')
    if (!isImage) {
      message.error('只能上传指定格式的图片!');
    }
    const isLt2M = file.size < fileSizeLimit;
    if (!isLt2M) {
      message.error('图片必须少于 2MB!');
    }
    return isImage && isLt2M;
  }

  render() {
    const props = {
      action: '/api/upload/image',
      headers: {
        [`${catConfig.projectPrefix}-antd-pro-token`]: localStorage.getItem(`${catConfig.projectPrefix}-antd-pro-token`) || '',
      },
      multiple: false,
      accept: 'image/*',
      onChange: this.handleChange,
      beforeUpload: this.beforeUpload,
      onRemove: (file) => {
        const { onRemove } = this.props
        if (onRemove) onRemove(file)
        // this.setState(({ fileList }) => {
        //   const index = fileList.indexOf(file);
        //   const newFileList = fileList.slice();
        //   newFileList.splice(index, 1);
        //   return {
        //     fileList: newFileList,
        //   };
        // })
      },
    };
    return (
      <Upload {...props} fileList={this.state.fileList}>
        <Button>
          <Icon type="upload" /> 上传
        </Button>
      </Upload>
    );
  }
}

export default MyUpload;