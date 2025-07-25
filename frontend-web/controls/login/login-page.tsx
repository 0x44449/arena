import { createContext, useState } from "react";
import LoginForm from "./login-form";
import UserRegister from "./user-register";

export type LoginMode = 'login' | 'register';

export interface LoginPageContextTypes {
  mode: LoginMode;
  setMode: (mode: LoginMode) => void;
}

export const LoginPageContext = createContext<LoginPageContextTypes>({
  mode: 'login',
  setMode: () => {},
});

export default function LoginPage() {
  const [mode, setMode] = useState<LoginMode>('login');

  return (
    <LoginPageContext.Provider value={{
      mode,
      setMode
    }}>
      {mode === 'login' ? <LoginForm /> : <UserRegister />}
    </LoginPageContext.Provider>
  )
}