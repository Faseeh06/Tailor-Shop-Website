import Link from "next/link"
import LoginForm from "@/components/LoginForm"

export default function Login() {
  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
      <LoginForm />
      <p className="mt-4 text-center">
        Don't have an account?{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          Register here
        </Link>
      </p>
    </div>
  )
}

