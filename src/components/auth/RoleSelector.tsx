'use client';

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';

export default function RoleSelector() {
  const { user } = useUser();
  const [selectedRole, setSelectedRole] = useState<'job_seeker' | 'employer'>('job_seeker');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleUpdate = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Update user metadata using the correct Clerk API
      await fetch('/api/user/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          role: selectedRole,
        }),
      });

      // Redirect to appropriate dashboard
      const dashboardUrl = selectedRole === 'employer'
        ? '/dashboard/employer'
        : '/dashboard/job-seeker';
      window.location.href = dashboardUrl;
    } catch (error) {
      console.error('Error updating role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show if user already has a role
  if (user?.publicMetadata?.role) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Choose your role
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Let us know how you&apos;ll be using Jobs Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <label className="text-base font-medium text-gray-900">
                I am a:
              </label>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <input
                    id="job_seeker"
                    name="role"
                    type="radio"
                    value="job_seeker"
                    checked={selectedRole === 'job_seeker'}
                    onChange={(e) => setSelectedRole(e.target.value as 'job_seeker' | 'employer')}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <label htmlFor="job_seeker" className="ml-3 block text-sm font-medium text-gray-700">
                    Job Seeker
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="employer"
                    name="role"
                    type="radio"
                    value="employer"
                    checked={selectedRole === 'employer'}
                    onChange={(e) => setSelectedRole(e.target.value as 'job_seeker' | 'employer')}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <label htmlFor="employer" className="ml-3 block text-sm font-medium text-gray-700">
                    Employer
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <div className="text-sm text-gray-600">
                {selectedRole === 'job_seeker' ? (
                  <div>
                    <strong>As a Job Seeker, you can:</strong>
                    <ul className="mt-2 list-disc list-inside space-y-1">
                      <li>Browse and search job listings</li>
                      <li>Apply to jobs with one click</li>
                      <li>Track your applications</li>
                      <li>Get matched with relevant opportunities</li>
                    </ul>
                  </div>
                ) : (
                  <div>
                    <strong>As an Employer, you can:</strong>
                    <ul className="mt-2 list-disc list-inside space-y-1">
                      <li>Post job openings</li>
                      <li>Manage applications</li>
                      <li>Find qualified candidates</li>
                      <li>Build your employer brand</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleRoleUpdate}
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Setting up your account...' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
