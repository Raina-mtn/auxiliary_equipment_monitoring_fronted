import type { ErrorMessageMode } from '@/types/axios'
import { ElMessage as createMessage } from 'element-plus'
// import router from '/@/router';
// import { PageEnum } from '/@/enums/pageEnum';

const error = createMessage.error!

export function checkStatus(
  status: number,
  msg: string,
  errorMessageMode: ErrorMessageMode = 'message',
): void {
  let errMessage = ''

  switch (status) {
    case 400:
      errMessage = `${msg}`
      break
    // 401: Not logged in
    // Jump to the login page if not logged in, and carry the path of the current page
    // Return to the current page after successful login. This step needs to be operated on the login page.
    case 401:
      errMessage = msg || '用户没有权限'
      break
    case 403:
      errMessage = '禁止访问'
      break
    // 404请求不存在
    case 404:
      errMessage = '接口404'
      break
    case 405:
      errMessage = '请求方法不允许'
      break
    case 500:
      errMessage = '服务器错误'
      break
    case 501:
      errMessage = '网络错误'
      break
    case 502:
      errMessage = '网络错误'
      break
    case 503:
      errMessage = '网络错误'
      break
    case 504:
      errMessage = '网络错误'
      break
    case 505:
      errMessage = 'http版本错误'
      break
    default:
  }

  if (errMessage) {
    if (errorMessageMode === 'modal') {
      // createErrorModal({ title: t('sys.api.errorTip'), content: errMessage })
    } else if (errorMessageMode === 'message') {
      error({ message: errMessage, key: `global_error_message_status_${status}` })
    }
  }
}
