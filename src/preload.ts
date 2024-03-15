// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { detectInterfaces, NetworkInterface } from './services/network'
import { contextBridge } from 'electron'
import { setLoadBalancer, serverStart, serverStop, getOutputLog } from "./services/socks"
import { ServerInfo } from './services/load_balancer'

declare global {
  interface Window {
    networkInterfaceList: {
      getAll: () => NetworkInterface[]
    },
    socks: {
      setLoadBalancer: (interfaceList: ServerInfo[]) => void,
      serverStart: (port: number) => void,
      serverStop: () => void,
      getOutputLog: () => string[]
    }
  }
}

contextBridge.exposeInMainWorld('networkInterfaceList', {
  getAll: () => detectInterfaces()
})

contextBridge.exposeInMainWorld('socks', {
  setLoadBalancer: (interfaceList: ServerInfo[]) => setLoadBalancer(interfaceList),
  serverStart: (port: number) => serverStart(port),
  serverStop: () => serverStop(),
  getOutputLog: () => getOutputLog(),
})
