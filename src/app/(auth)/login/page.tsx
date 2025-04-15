import { LoginForm } from "@/components/login-form";
import type { Metadata } from 'next'

export default function LoginPage() {
  return (
    <div className="flex w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Login',
  description: 'Simplifying Hospital OPD Management System',
}
