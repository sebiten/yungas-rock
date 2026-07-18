"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/admin/actions/auth";

const initialState: LoginState = { error: "" };

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <form className="admin-login-form" action={action}>
      <label>Email<input type="email" name="email" autoComplete="email" required /></label>
      <label>Contraseña<input type="password" name="password" autoComplete="current-password" required /></label>
      {state.error && <p className="admin-form-error" role="alert">{state.error}</p>}
      <button type="submit" disabled={pending}>{pending ? "Ingresando..." : "Ingresar al panel"}</button>
    </form>
  );
}
