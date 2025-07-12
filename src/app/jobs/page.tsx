export default function Jobs() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Jobs</h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover your next career opportunity
          </p>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center text-gray-500">
              <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8zM8 14v.01M12 14v.01M16 14v.01" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Listings Coming Soon</h2>
              <p className="text-gray-600 mb-6">
                We&apos;re working on bringing you the best job opportunities.
                This feature will be available in Sprint 3 of our development plan.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Sprint 3: Job Seeker Features - Job Discovery</strong><br />
                  Coming in the next phase of development, you&apos;ll be able to:
                </p>
                <ul className="text-blue-700 text-sm mt-2 text-left list-disc list-inside">
                  <li>Browse all available job postings</li>
                  <li>Search jobs by keywords and location</li>
                  <li>Filter jobs by type and category</li>
                  <li>View detailed job descriptions</li>
                  <li>Apply to jobs with one click</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
