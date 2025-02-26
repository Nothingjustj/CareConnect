'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10">
      <p className="text-xl">Sorry, something went wrong</p>
      <p className="text-xl">Try refreshing the page or checking your connection</p>
      <Button className="mt-4" asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  )
}