import * as os from 'os'

export type NetworkInterface = {
  name: string
  address: string
  family: string // ipv4 or ipv6
  percentage: number
}

function isGoodInterface(iface: os.NetworkInterfaceInfo): boolean {
  return iface.family === 'IPv4' && !iface.internal
}

export function detectInterfaces(): NetworkInterface[] {
  const networkInterfaces = os.networkInterfaces();
  const interfaceList: NetworkInterface[] = []

  for (const name in networkInterfaces) {
    const interfaces = networkInterfaces[name]
    if (interfaces) {
      for (const iface of interfaces) {
        if(isGoodInterface(iface)){
          interfaceList.push({
            name,
            address: iface.address,
            family: iface.family,
            percentage: 0
          })
        }
      }
    }
  }
  return interfaceList
}
