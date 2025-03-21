import { EXTENSION_NAME } from 'boot/constants'
import { api } from 'src/boot/axios'
import { useAppStore } from 'src/stores/appStore'

const version = import.meta.env.PACKAGE_VERSION

let graylogErrorLogged = false

function log(msg: string, level: number) {
  const gelfMessage = {
    version: '1.1',
    host: process.env.HOST,
    short_message: msg,
    level: level,
    _app: EXTENSION_NAME,
    _mode: process.env.MODE,
    _version: version,
    _logflowId: useAppStore().logflowId,
    _stage: process.env.TABSETS_STAGE,
  }
  api
    .post('https://graylog.tabsets.net:12202/gelf', gelfMessage, {
      headers: { 'Content-Type': 'application/json' },
    })
    .catch((err: any) => {
      if (!graylogErrorLogged) {
        graylogErrorLogged = true
        console.warn('could not log to graylog', err)
      }
    })
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
