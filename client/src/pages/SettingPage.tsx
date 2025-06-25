import SettingMenu from "@/features/setting/controls/SettingMenu";
import { Outlet } from "react-router-dom";

export default function SettingPage() {
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