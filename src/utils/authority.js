import catConfig from '../../config/cat.config';

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('cat-book-antd-pro-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem(`${catConfig.projectPrefix}-antd-pro-authority`) : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority || ['admin'];
}

export function setAuthority(authority, token, userid) {
  let proToken = token || '';
  if (!authority) {
    proToken = ''
  }
  // console.info('proToken', proToken)
  const proAuthority = (typeof authority === 'string' && authority !== '') ? [authority] : authority;
  localStorage.setItem(`${catConfig.projectPrefix}-antd-pro-token`, proToken); // 添加token
  // localStorage.setItem(`${catConfig.projectPrefix}-antd-pro-userid`, userid);  // 添加userid
  return localStorage.setItem(`${catConfig.projectPrefix}-antd-pro-authority`, typeof proAuthority === 'object' ? JSON.stringify(proAuthority) : proAuthority);
}
