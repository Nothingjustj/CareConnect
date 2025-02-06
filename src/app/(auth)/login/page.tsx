import { LoginForm } from "@/components/login-form";
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Login - RogiSetu',
  description: 'Simplifying Hospital OPD Management System',
}

export default function LoginPage() {
  return (
    <div className="flex w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
