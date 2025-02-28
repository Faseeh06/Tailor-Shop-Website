import Image from "next/image"
import Link from "next/link"
import { LuScissors, LuHeart, LuSmile, LuStar } from "react-icons/lu"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#B17457] to-[#9A6349] text-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">Custom Tailoring for Your Perfect Fit</h1>
              <p className="text-xl text-blue-100">
                Experience the luxury of perfectly fitted clothing, tailored just for you by our expert craftsmen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/custom-order"
                  className="bg-white text-[#B17457] px-8 py-3 rounded-lg font-semibold hover:bg-[#FFF8F5] transition-colors text-center"
                >
                  Start Your Order
                </Link>
                <Link
                  href="/gallery"
                  className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors text-center"
                >
                  View Gallery
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <Image
                src="/images/main.jpg"
                alt="Tailor at work"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-[#F5E6E0] rounded-full flex items-center justify-center mx-auto mb-4">
                <LuScissors className="w-6 h-6 text-[#B17457]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Tailors</h3>
              <p className="text-gray-600">Skilled craftsmen with years of experience</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-[#F5E6E0] rounded-full flex items-center justify-center mx-auto mb-4">
                <LuHeart className="w-6 h-6 text-[#B17457]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Materials</h3>
              <p className="text-gray-600">Premium fabrics and materials</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-[#F5E6E0] rounded-full flex items-center justify-center mx-auto mb-4">
                <LuSmile className="w-6 h-6 text-[#B17457]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Perfect Fit</h3>
              <p className="text-gray-600">Guaranteed satisfaction with every order</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-[#F5E6E0] rounded-full flex items-center justify-center mx-auto mb-4">
                <LuStar className="w-6 h-6 text-[#B17457]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Custom Design</h3>
              <p className="text-gray-600">Create your perfect style</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <LuStar key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "The quality and fit of my custom suit exceeded my expectations. The attention to detail and customer
                  service was outstanding."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-semibold">John Doe</h4>
                    <p className="text-sm text-gray-500">Satisfied Customer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#B17457] text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our satisfied customers and experience the perfect fit today.
          </p>
          <Link
            href="/register"
            className="bg-white text-[#B17457] px-8 py-3 rounded-lg font-semibold hover:bg-[#FFF8F5] transition-colors inline-block"
          >
            Create an Account
          </Link>
        </div>
      </section>
    </div>
  )
}

