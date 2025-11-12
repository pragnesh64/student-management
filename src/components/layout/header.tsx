import Link from "next/link"
import { GraduationCap } from "lucide-react"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6" />
          <span className="font-bold text-xl">Student Management</span>
        </Link>
        <nav className="ml-auto flex gap-6">
          <Link
            href="/students"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Students
          </Link>
        </nav>
      </div>
    </header>
  )
}
