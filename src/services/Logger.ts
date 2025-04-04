import { useErrorHandlingConfig } from 'src/core/config/errorHandlingConfig'

// const version = import.meta.env.PACKAGE_VERSION

// let graylogErrorLogged = false

const { setupErrorHandling } = useErrorHandlingConfig()
var scope = setupErrorHandling()

function log(msg: string, level: number) {
  // console.log('sending message to sentry...', scope)
  scope.captureMessage(msg)
  // const gelfMessage = {
  //   version: '1.1',
  //   host: process.env.HOST,
  //   short_message: msg,
  //   level: level,
  //   _app: EXTENSION_NAME,
  //   _mode: process.env.MODE,
  //   _version: version,
  //   _logflowId: useAppStore().logflowId,
  //   _stage: process.env.TABSETS_STAGE,
  // }
  // api
  //   .post('http://graylog.tabsets.net:12201/gelf', gelfMessage, {
  //     headers: { 'Content-Type': 'application/json' },
  //   })
  //   .catch((err: any) => {
  //     if (!graylogErrorLogged) {
  //       graylogErrorLogged = true
  //       console.warn('could not log to graylog')
  //     }
  //   })
}

export function useLogger() {
  const info = (msg: string) => {
    log(msg, 5)
  }

  const error = (msg: string) => {
    log(msg, 3)
  }

  return {
    info,
    error,
  }
}
