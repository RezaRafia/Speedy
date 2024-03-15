import { useEffect, useState } from "react"
import { NetworkInterface } from "src/services/network"

interface ConnectionCardProps {
  iface: NetworkInterface
  isReadOnly: boolean
  callbackPercentageChange?: (percentage: number) => void
}

export default function ConnectionCard(props: ConnectionCardProps){
  const { iface, isReadOnly, callbackPercentageChange } = props
  const [percentage, setPercentage] = useState(iface.percentage)

  function handleValueChange(event: React.ChangeEvent<HTMLInputElement>){
    setPercentage(parseInt(event.target.value)) 
  }

  useEffect( () => {
    callbackPercentageChange(percentage)
  }, [percentage] )



 return(
  <>
    <div className={"flex flex-1 space-x-[8px] items-center " + (isReadOnly ? "opacity-[50%] cursor-not-allowed" : "")}>
      {percentage > 0 ? (
      <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.9209 9.12064L8.36917 2.67236M9.54154 5.60339V1.49994H5.4381M3.09331 18.5002H3.67952C4.32703 18.5002 4.85193 17.9753 4.85193 17.3278V14.3965C4.85193 13.749 4.32703 13.2241 3.67952 13.2241H3.09331C2.44581 13.2241 1.9209 13.749 1.9209 14.3965V17.3278C1.9209 17.9753 2.44581 18.5002 3.09331 18.5002ZM10.1277 18.5002H10.7139C11.3614 18.5002 11.8863 17.9753 11.8863 17.3278V10.8792C11.8863 10.2317 11.3614 9.70683 10.7139 9.70683H10.1277C9.48018 9.70683 8.95529 10.2317 8.95529 10.8792V17.3278C8.95529 17.9753 9.48018 18.5002 10.1277 18.5002ZM17.1621 18.5002H17.7483C18.3958 18.5002 18.9207 17.9753 18.9207 17.3278V2.67235C18.9207 2.02485 18.3958 1.49994 17.7483 1.49994H17.1621C16.5146 1.49994 15.9897 2.02485 15.9897 2.67235V17.3278C15.9897 17.9753 16.5146 18.5002 17.1621 18.5002Z" stroke="#EDF0F4" stroke-width="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      ) : (
        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.55899 4.13798L16.2831 15.8621M18.9209 10C18.9209 14.6945 15.1154 18.5 10.4209 18.5C5.72648 18.5 1.9209 14.6945 1.9209 10C1.9209 5.30563 5.72648 1.50005 10.4209 1.50005C15.1154 1.50005 18.9209 5.30563 18.9209 10Z" stroke="#ACB4C0" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}

      <div className="">
        <p className="font-medium text-[14px] leading-[130%] text-[#EBEEF3]">{iface.name}</p>
        <p className="font-normal text-[12px] leading-[150%] text-[#ACB4C0]">{iface.address}</p>
      </div>
    </div>

    <div className="flex space-x-[8px] items-center">
      <input className="bg-transparent text-center appearance-none outline-none h-[24px] w-[32px] border-b" type='number' value={percentage} onChange={handleValueChange} disabled={isReadOnly}></input>
      <p>%</p>
      {isReadOnly && (
      <span className="group-hover:opacity-100 transition-opacity bg-gray-800 px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
      -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto">Turn off server to change</span>
    )}
    </div>

  </>
 ) 
}