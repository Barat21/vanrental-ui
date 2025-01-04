import React from 'react';
import { Package } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">VanRental</span>
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} VanRental. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}