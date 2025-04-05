import { RegisterForm } from "@/components/register-form";
import type { Metadata } from 'next'

export default function RegisterPage() {
  return (
    <div className="flex w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Register as Patient | RogiSetu',
  description: 'Simplifying Hospital OPD Management System',
}
