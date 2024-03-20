import { useEffect, useState } from "react"
import { NetworkInterface } from "./services/network"
import PowerButton from "./components/PowerButton"
import ConnectionCard from "./components/ConnectionCard"
import { ServerInfo } from "./services/load_balancer"

export default function App(){
  const [networkInterfaces, setNetworkInterfaces] = useState<NetworkInterface[]>([])
  const [enabled, setEnabled] = useState(false)
  const [port, setPort] = useState(8080)
  const [outputLog, setOutputLog] = useState<string[]>([])
  const [errorMessage, setErrorMessage] = useState<string|undefined>(undefined)

  useEffect( () => {
    if(window){
      setNetworkInterfaces(window.networkInterfaceList.getAll())
    }
  }, [window] )


  useEffect( () => {
    let updateLogInterval = undefined

    if(enabled){
      const servers: ServerInfo[] = networkInterfaces.filter(e => e.percentage > 0).map( function(e) {
        return {
          host: e.address,
          port: 8080,
          percentage: e.percentage
        }
      } )
      window.socks.setLoadBalancer(servers)
      window.socks.serverStart(port)
      updateLogInterval = setInterval( () => {setOutputLog(window.socks.getOutputLog())}, 300 )
    } else {
      window.socks.serverStop()
      clearInterval( updateLogInterval )
    }
  }, [enabled] )

  function checkPercentage(): boolean {
    let totalPercentage = 0
    for (let i = 0; i < networkInterfaces.length; i++) {
      totalPercentage += networkInterfaces[i].percentage
    }
    return totalPercentage == 100
  }

  function handlePowerChange(newStatus: boolean){
    if(newStatus == true){
      if(checkPercentage()){
        setEnabled(newStatus)
        setErrorMessage(undefined)
      } else {
        setErrorMessage("The sum of all connections percentage must be 100%.")
      }
    }
    if(newStatus == false){
      setEnabled(newStatus)
    }
  }

  function handlePercentageChange(percentage: number, iface: NetworkInterface): void {
    for (let i = 0; i < networkInterfaces.length; i++) {
      if (networkInterfaces[i].address === iface.address) {
        networkInterfaces[i].percentage = percentage
        break
      }
    }
    setNetworkInterfaces(networkInterfaces)
  }

  return ( 
    <div className="bg-[#141828] min-h-screen flex flex-col">
      {/* Header */}
      <div className=" border-[#444B5F] border-b w-full h-[64px] flex items-center px-[24px]">
        <h1 className="font-medium text-[22px] leading-[130%] text-[#EDF0F4] flex-1">Speedy</h1>
        <div className="flex justify-center items-center">
        <p className="text-[#ACB4C0] font-normal text-[14px] leading-[130%]">port</p>
          <input className="mr-[16px] ml-[6px] bg-transparent text-[#ACB4C0] text-center appearance-none outline-none h-[24px] w-[48px] border-b" type='number' value={port} onChange={(e) => {setPort(parseInt(e.target.value))}} disabled={enabled}></input>
          <PowerButton enabled={enabled} callbackPowerChange={handlePowerChange} />
        </div>
        
      </div>

      {/* Main */}
      <div className="mx-[24px] py-[32px] flex-1 flex flex-col h-full">

        {/* Connections */}
        <p className="text-[#EDF0F4] font-medium text-[14px] leading-[130%] pb-[8px]">Connections</p>
        <p className="text-[#ACB4C0] font-normal text-[14px] leading-[130%] pb-[16px] ">Set the load percentage to how much you want to use each connections.<br></br> If you dont want to use a connection, set 0%.</p>
        <p className="text-[#FF2D46] font-normal text-[14px] leading-[130%] pb-[16px]" hidden={!errorMessage}>{errorMessage}</p>
        <div className="mb-[32px] bg-[#23283D] border-[#444B5F] border rounded-[16px] p-[24px]"> 

          <ul className="text-sm text-[#ACB4C0] space-y-[8px]">
            {networkInterfaces.map( (iface, index) => (
              <li className="flex items-center p-[12px]" key={index}>
                <ConnectionCard iface={iface} isReadOnly={enabled} callbackPercentageChange={(percentage) => handlePercentageChange(percentage, iface)}/>
              </li>
            ))}
          </ul>

        </div>
        

        <p className="text-[#EDF0F4] font-medium text-[14px] leading-[130%] pb-[8px]">Log</p>
        <p className="text-[#ACB4C0] font-normal text-[14px] leading-[130%] pb-[16px] ">Proxy server debug info</p>
        <div className="bg-[#23283D] rounded-[16px] p-[24px] overflow-y-auto flex-1 min-h-[120px] max-h-[320px]">
          {outputLog?.length > 0 && outputLog?.map( (value, index) => (
            <p className="text-[#ACB4C0] font-normal text-[12px] leading-[150%]" key={index}>{value}</p>
          ))} 
        </div>

      </div>

    </div>
  )
}