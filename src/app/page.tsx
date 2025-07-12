import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your Dream Job
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with top employers and discover opportunities that match your skills and aspirations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/auth/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition duration-200"
            >
              Get Started
            </Link>
            <Link
              href="/jobs"
              className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-600 px-8 py-3 rounded-lg text-lg font-semibold transition duration-200"
            >
              Browse Jobs
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">For Job Seekers</h2>
            <ul className="space-y-4 text-lg text-gray-600">
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Browse thousands of job opportunities
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Apply with one click
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Track your applications
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Get matched with relevant opportunities
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">For Employers</h2>
            <ul className="space-y-4 text-lg text-gray-600">
              <li className="flex items-center">
                <svg className="h-6 w-6 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Post job openings easily
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Manage applications efficiently
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Find qualified candidates
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Build your employer brand
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Ready to Get Started?</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Job Seekers</h3>
              <p className="text-gray-600 mb-4">Create your profile and start applying to jobs today.</p>
              <Link
                href="/auth/signup?role=job_seeker"
                className="block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
              >
                Sign Up as Job Seeker
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Employers</h3>
              <p className="text-gray-600 mb-4">Post jobs and find the perfect candidates for your team.</p>
              <Link
                href="/auth/signup?role=employer"
                className="block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
              >
                Sign Up as Employer
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
