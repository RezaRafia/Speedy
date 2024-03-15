import { useEffect, useState } from "react"

interface PowerButtonProps {
  enabled: boolean
  callbackPowerChange: (newStatus: boolean) => void
}

export default function PowerButton(props: PowerButtonProps) {
  const { enabled, callbackPowerChange } = props

  function changeStatus(newStatus: boolean) {
    callbackPowerChange(newStatus)
  }

  return (
    <div className="rounded-[16px] h-[40px] bg-[#4B5268] flex">
      <button onClick={() => changeStatus(false)} className={"py-[8px] font-medium leading-[130%] text-[12px] text-[#E3E7ED] " + (!enabled ? "rounded-[16px] m-[4px] bg-[#141828] px-[14px]" : "px-[18px]")}>Off</button>
      <button onClick={() => changeStatus(true)} className={"py-[8px] font-medium leading-[130%] text-[12px] text-[#E3E7ED] " + (enabled ? "rounded-[16px] m-[4px] bg-[#141828] px-[14px]" : "px-[18px]")}>On</button>
    </div>
  )
}