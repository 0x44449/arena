import { Link } from "react-router-dom";

export default function SettingMenu() {
  return (
    <div className="flex flex-col">
      <ul className="mt-2 space-y-2">
        <li>
          <Link to="profile" className="text-blue-600 hover:underline">Profile Settings</Link>
        </li>
      </ul>
    </div>
  )
}