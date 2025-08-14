import React from 'react';
import { TeamSelector } from './DropdownExamples';
import { VenueSelector } from './DropdownExamples';
import { GameTypeSelector } from './DropdownExamples';
import { CustomStyledDropdown } from './DropdownExamples';
import { NavigationDropdown } from './DropdownExamples';

const DropdownDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Reusable Dropdown Component Demo
          </h1>
          <p className="text-lg text-gray-600">
            A flexible, customizable dropdown component for React applications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Team Selector */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <TeamSelector />
          </div>

          {/* Venue Selector */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <VenueSelector />
          </div>

          {/* Game Type Selector */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <GameTypeSelector />
          </div>

          {/* Custom Styled Dropdown */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <CustomStyledDropdown />
          </div>

          {/* Navigation Dropdown */}
          <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
            <NavigationDropdown />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">🔍 Searchable</h3>
              <p className="text-sm text-gray-600">Filter options with real-time search</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">☑️ Multi-Select</h3>
              <p className="text-sm text-gray-600">Choose multiple options with checkboxes</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">🎨 Customizable</h3>
              <p className="text-sm text-gray-600">Custom styling and render functions</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">♿ Accessible</h3>
              <p className="text-sm text-gray-600">Keyboard navigation and ARIA support</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">📱 Responsive</h3>
              <p className="text-sm text-gray-600">Works on all screen sizes</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">⚡ TypeScript</h3>
              <p className="text-sm text-gray-600">Fully typed with TypeScript support</p>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Usage Examples</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Basic Usage</h3>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`<Dropdown
  items={[
    { id: '1', label: 'Option 1' },
    { id: '2', label: 'Option 2' }
  ]}
  onSelect={(item) => console.log(item)}
  placeholder="Select an option..."
/>`}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">With Search</h3>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`<Dropdown
  items={items}
  searchable={true}
  onSelect={handleSelect}
/>`}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Multi-Select</h3>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`<Dropdown
  items={items}
  multiSelect={true}
  onSelect={handleMultiSelect}
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropdownDemo;
