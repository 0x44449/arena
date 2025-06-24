import { Outlet } from "react-router-dom";
import SettingMenu from "./SettingMenu";

export default function SettingView() {
  return (
    <div className="flex flex-row h-screen w-screen">
      <div className="flex flex-col flex-1">
        {/* SettingMenu */}
        <SettingMenu />
      </div>

      <div className="flex flex-col flex-1">
        {/* SettingView */}
        <Outlet />
      </div>
    </div>
  )
}