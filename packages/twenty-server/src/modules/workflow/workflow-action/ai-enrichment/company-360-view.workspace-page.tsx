import React from 'react';

export const Company360View: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Account 360 View</h1>
      </div>
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Contact Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Company Name</label>
              <span className="text-base font-medium">TechCorp Inc.</span>
            </div>
            <div>
              <label className="text-sm text-gray-600">Website</label>
              <span className="text-base font-medium">techcorp.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Company360View;
