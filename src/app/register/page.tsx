import RegisterForm from "@/components/RegisterForm"

export default function Register() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 mb-8">
          Create an Account
        </h2>
        <RegisterForm />
      </div>
    </div>
  )
}

