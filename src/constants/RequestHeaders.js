import catConfig from '../../config/cat.config';
// import { getAuthority } from '../utils/authority';

/**
 * 请求远程数据时的headers
 */
export const RequestHeaders = {
  // [`${catConfig.projectPrefix}-antd-pro-token`]: localStorage.getItem(`${catConfig.projectPrefix}-antd-pro-token`) || '',
  'Authorization': !localStorage.getItem(`${catConfig.projectPrefix}-antd-pro-token`) ? '' : `Bearer ${localStorage.getItem(`${catConfig.projectPrefix}-antd-pro-token`)}`,
}