/**
 * 根据url判断其属于小程序的哪个版本：开发版、体验版、正式版本
 * @param {*} Referer 
 */
export function getVersionCategory(Referer) {
  let html = '';
  if (Referer === '' || Referer === undefined)
    html = '';
  else {
    const { groups } = Referer.match('servicewechat\\.com\\/(?<appid>.*?)/(?<version>.*?)/page-frame\\.html');
    if (groups) {
      const { appid, version } = groups
      if (version > 0) {
        html = '正式版本'
      }
      else {
        switch (version) {
          case 'devtools':
          default:
            html = '开发版'
            break;
          case '0':
            html = '体验版'
            break;
          case '1':
            html = '正式版本'
            break;
        }
      }
    }
  }
  return html;
}
/**
 * 根据传入的权限、控制器、方法，获取其是否“有权限”
 */
export function CheckAuthorityByArray(listRes, controller, method) {
  let hasPermission = true
  if (listRes && listRes.length > 0) {
    listRes.forEach(item => {
      if (item.controller === controller && item.method === method) {
        hasPermission = item.result
      }
    })
  }
  return hasPermission
}