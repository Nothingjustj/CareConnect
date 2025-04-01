"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/actions/auth";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>("");
  const router = useRouter();
  const dispatch = useDispatch();

  const handleTestLogin = async () => {
    setLoading(true);
    setError("");

    const testCredentials = new FormData();
    testCredentials.append("email", "test@test.com");
    testCredentials.append("password", "123456789");

    const result = await signIn(testCredentials);
    console.log(result)

    if (result.status == "success") {
      router.prefetch("/dashboard");
      toast.success("Logged in as Test User");
      router.push("/dashboard");

      dispatch(
        setUser({
          id: result.userId,
          role: result.role,
          name: result.name,
          email: result.email,
        })
      );
    } else {
      toast.error(`An error occurred: ${result.status}`);
      setError(result.status);
    }

    setLoading(false);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const result = await signIn(formData);
    console.log(result)

    if (result.status == "success") {
      router.prefetch("/dashboard");
      router.prefetch("/admin/dashboard");
      router.prefetch("/hospital-admin/dashboard");
      router.prefetch("/super-admin/dashboard");

      toast.success("Logged in successfully");

      if (result.role === "patient") {
        router.push("/dashboard");
      } else if (result.role === "department_admin") {
        router.push("/admin/dashboard");
      } else if (result.role === "hospital_admin") {
        router.push("/hospital-admin/dashboard");
      } else {
        router.push("/super-admin/dashboard");
      }

      dispatch(
        setUser({
          id: result.userId,
          role: result.role,
          name: result.name,
          email: result.email,
        })
      );

    } else {
      toast.error(`An error occurred: ${result.status}`);
      setError(result.status);
    }

    setLoading(false);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {error && <p className="text-red-600">{error}</p>}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-xs underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" name="password" required />
              </div>
              <div className="space-y-2">

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
              <Button variant="secondary" onClick={handleTestLogin} className="w-full">Login as Test User</Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline underline-offset-4 text-primary">
                Register
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
