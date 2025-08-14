import React, { useState, useEffect } from 'react';
import Dropdown, { DropdownItem } from './dropdown';

// Example 1: Simple Team Selection
export const TeamSelector: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState<DropdownItem | null>(null);
  const [teams, setTeams] = useState<DropdownItem[]>([]);

  useEffect(() => {
    // Fetch teams from API
    fetch('http://localhost:8000/api/teams')
      .then(res => res.json())
      .then(data => {
        const teamItems: DropdownItem[] = data.map((team: any) => ({
          id: team.id,
          label: team.name,
          value: team
        }));
        setTeams(teamItems);
      })
      .catch(err => console.error('Error fetching teams:', err));
  }, []);

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Select Team</h3>
      <Dropdown
        items={teams}
        placeholder="Choose a team..."
        onSelect={setSelectedTeam}
        selectedItem={selectedTeam}
        className="w-64"
      />
      {selectedTeam && (
        <p className="mt-2 text-sm text-gray-600">
          Selected: {selectedTeam.label}
        </p>
      )}
    </div>
  );
};

// Example 2: Venue Selection with Search
export const VenueSelector: React.FC = () => {
  const [selectedVenue, setSelectedVenue] = useState<DropdownItem | null>(null);
  const [venues, setVenues] = useState<DropdownItem[]>([]);

  useEffect(() => {
    // Fetch venues from API
    fetch('http://localhost:8000/api/venues')
      .then(res => res.json())
      .then(data => {
        const venueItems: DropdownItem[] = data.map((venue: any) => ({
          id: venue.id,
          label: venue.name,
          value: venue,
          // Custom data for display
          home_multiplier: venue.home_multiplier
        }));
        setVenues(venueItems);
      })
      .catch(err => console.error('Error fetching venues:', err));
  }, []);

  // Custom item renderer to show multiplier
  const renderVenueItem = (item: DropdownItem, isSelected: boolean) => (
    <div className={`flex justify-between items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
      isSelected ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
    }`}>
      <span>{item.label}</span>
      <span className="text-xs text-gray-500">
        Multiplier: {item.home_multiplier}
      </span>
    </div>
  );

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Select Venue</h3>
      <Dropdown
        items={venues}
        placeholder="Choose a venue..."
        onSelect={setSelectedVenue}
        selectedItem={selectedVenue}
        searchable={true}
        renderItem={renderVenueItem}
        className="w-80"
      />
      {selectedVenue && (
        <p className="mt-2 text-sm text-gray-600">
          Selected: {selectedVenue.label} (Multiplier: {selectedVenue.home_multiplier})
        </p>
      )}
    </div>
  );
};

// Example 3: Multi-select for Game Types
export const GameTypeSelector: React.FC = () => {
  const [selectedTypes, setSelectedTypes] = useState<DropdownItem[]>([]);

  const gameTypes: DropdownItem[] = [
    { id: 'historical', label: 'Historical Games', value: 'historical' },
    { id: 'simulations', label: 'Simulations', value: 'simulations' },
    { id: 'predictions', label: 'Predictions', value: 'predictions' },
    { id: 'analysis', label: 'Analysis', value: 'analysis' }
  ];

  const handleMultiSelect = (item: DropdownItem) => {
    const isSelected = selectedTypes.some(selected => selected.id === item.id);
    if (isSelected) {
      setSelectedTypes(selectedTypes.filter(selected => selected.id !== item.id));
    } else {
      setSelectedTypes([...selectedTypes, item]);
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Select Game Types</h3>
      <Dropdown
        items={gameTypes}
        placeholder="Choose game types..."
        onSelect={handleMultiSelect}
        multiSelect={true}
        className="w-72"
      />
      {selectedTypes.length > 0 && (
        <div className="mt-2">
          <p className="text-sm text-gray-600">Selected:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {selectedTypes.map(type => (
              <span
                key={type.id}
                className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full"
              >
                {type.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Example 4: Custom Styled Dropdown
export const CustomStyledDropdown: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<DropdownItem | null>(null);

  const options: DropdownItem[] = [
    { id: 'option1', label: 'Option 1', value: 'option1' },
    { id: 'option2', label: 'Option 2', value: 'option2' },
    { id: 'option3', label: 'Option 3', value: 'option3', disabled: true },
    { id: 'option4', label: 'Option 4', value: 'option4' }
  ];

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Custom Styled Dropdown</h3>
      <Dropdown
        items={options}
        placeholder="Select an option..."
        onSelect={setSelectedOption}
        selectedItem={selectedOption}
        buttonClassName="bg-blue-500 text-white hover:bg-blue-600 border-blue-500"
        menuClassName="bg-blue-50 border-blue-200"
        itemClassName="hover:bg-blue-100"
        className="w-64"
      />
    </div>
  );
};

// Example 5: Navigation Dropdown (like your original)
export const NavigationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems: DropdownItem[] = [
    { 
      id: 'historical', 
      label: 'Historical Games', 
      href: '/historical-games',
      onClick: () => console.log('Navigate to Historical Games')
    },
    { 
      id: 'custom', 
      label: 'Custom Match Ups', 
      href: '/custom-match-ups',
      onClick: () => console.log('Navigate to Custom Match Ups')
    },
    { 
      id: 'analysis', 
      label: 'Analysis', 
      href: '/analysis',
      onClick: () => console.log('Navigate to Analysis')
    }
  ];

  // Custom button renderer for navigation
  const renderNavButton = (selectedItem: DropdownItem | null, isOpen: boolean) => (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
    >
      Navigation
      <svg
        className={`w-4 h-4 ml-2 inline transition-transform ${isOpen ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  // Custom item renderer for navigation
  const renderNavItem = (item: DropdownItem, isSelected: boolean) => (
    <a
      href={item.href}
      onClick={(e) => {
        e.preventDefault();
        item.onClick?.();
        setIsOpen(false);
      }}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    >
      {item.label}
    </a>
  );

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Navigation Dropdown</h3>
      <Dropdown
        items={navItems}
        renderButton={renderNavButton}
        renderItem={renderNavItem}
        className="w-auto"
      />
    </div>
  );
};
