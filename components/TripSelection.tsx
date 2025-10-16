import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Trip } from '../types';
import { SearchIcon, ChevronDownIcon } from './IconComponents';
import { TripCard } from './TripCard';

interface TripSelectionProps {
  trips: Trip[];
  onSelectTrip: (tripId: number) => void;
}

const TripSelection: React.FC<TripSelectionProps> = ({ trips, onSelectTrip }) => {
  const [searchQuery, setSearchQuery] = useState(() => {
    try { return localStorage.getItem('tahwisa_searchQuery') || ''; } catch (e) { return ''; }
  });
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Tous' | 'Facile' | 'Moyen' | 'Difficile'>(() => {
    try { return (localStorage.getItem('tahwisa_selectedDifficulty') as any) || 'Tous'; } catch (e) { return 'Tous'; }
  });
  const [selectedType, setSelectedType] = useState(() => {
    try { return localStorage.getItem('tahwisa_selectedType') || 'Tous'; } catch (e) { return 'Tous'; }
  });

  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const typeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try { localStorage.setItem('tahwisa_searchQuery', searchQuery); } catch (e) { console.error("Could not save search query", e); }
  }, [searchQuery]);

  useEffect(() => {
    try { localStorage.setItem('tahwisa_selectedDifficulty', selectedDifficulty); } catch (e) { console.error("Could not save difficulty", e); }
  }, [selectedDifficulty]);

  useEffect(() => {
    try { localStorage.setItem('tahwisa_selectedType', selectedType); } catch (e) { console.error("Could not save type", e); }
  }, [selectedType]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setIsTypeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tripTypes = useMemo(() => ['Tous', ...Array.from(new Set(trips.map(trip => trip.type)))], [trips]);

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          trip.destination.toLowerCase().includes(searchQuery.toLowerCase());
    
    // FIX: Map the French difficulty from the UI state to the English difficulty in the data model for correct comparison.
    const difficultyMap: { [key: string]: Trip['difficulty'] } = {
      'Facile': 'Easy',
      'Moyen': 'Medium',
      'Difficile': 'Difficult',
    };
    const matchesDifficulty = selectedDifficulty === 'Tous' || trip.difficulty === difficultyMap[selectedDifficulty];
    
    const matchesType = selectedType === 'Tous' || trip.type === selectedType;

    return matchesSearch && matchesDifficulty && matchesType;
  });

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedDifficulty('Tous');
    setSelectedType('Tous');
  };

  const filtersAreActive = searchQuery !== '' || selectedDifficulty !== 'Tous' || selectedType !== 'Tous';


  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-white">Choisissez Votre Prochaine Aventure</h1>
        <p className="mt-2 text-lg text-gray-300">Explorez des expériences de randonnée inoubliables au cœur de l'Algérie.</p>
      </div>
      
      <div className="p-4 bg-black border border-gray-800 rounded-lg space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Rechercher une destination ou une randonnée..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 bg-gray-900 text-white border-gray-700 rounded-full shadow-sm focus:ring-orange-500 focus:border-orange-500 text-lg"
          />
        </div>

        <div className="flex flex-col md:flex-row items-start gap-4">
            <div ref={typeDropdownRef} className="relative w-full md:w-auto">
                <label className="block text-sm font-medium text-gray-200 mb-1">Type</label>
                <button
                    type="button"
                    onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                    className="w-full md:w-56 flex items-center justify-between bg-gray-900 border border-gray-700 rounded-md shadow-sm px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                    <span className="truncate">{selectedType}</span>
                    <ChevronDownIcon className={`h-5 w-5 ml-2 text-gray-400 transform transition-transform flex-shrink-0 ${isTypeDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isTypeDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full md:w-56 rounded-md bg-gray-900 shadow-lg ring-1 ring-gray-700 focus:outline-none">
                    <div className="py-1 max-h-60 overflow-auto">
                        {tripTypes.map(type => (
                        <button
                            key={type}
                            onClick={() => {
                            setSelectedType(type);
                            setIsTypeDropdownOpen(false);
                            }}
                            className={`text-left w-full block px-4 py-2 text-sm ${selectedType === type ? 'bg-gray-700 text-white' : 'text-gray-200 hover:bg-gray-800 hover:text-white'}`}
                        >
                            {type}
                        </button>
                        ))}
                    </div>
                    </div>
                )}
            </div>
            <div className="w-full md:w-auto">
                <label className="block text-sm font-medium text-gray-200 mb-1">Difficulté</label>
                <div className="flex space-x-1 rounded-lg bg-gray-900 p-1 w-full">
                    {(['Tous', 'Facile', 'Moyen', 'Difficile'] as const).map(difficulty => {
                        const difficultyMapping = {
                            'Tous': 'All',
                            'Facile': 'Easy',
                            'Moyen': 'Medium',
                            'Difficile': 'Difficult'
                        };
                        const difficultyValue = difficultyMapping[difficulty] as 'All' | 'Easy' | 'Medium' | 'Difficult';

                        return (
                            <button
                                key={difficulty}
                                onClick={() => setSelectedDifficulty(difficulty)}
                                className={`w-full rounded-md py-1.5 px-3 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                                    selectedDifficulty === difficulty
                                    ? 'bg-orange-600 text-white shadow'
                                    : 'bg-transparent text-gray-300 hover:bg-gray-800'
                                }`}
                            >
                                {difficulty}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
         {filtersAreActive && (
          <div className="text-center pt-2">
            <button
                onClick={handleClearFilters}
                className="text-sm font-semibold text-orange-500 hover:text-orange-400 transition-colors"
            >
                Effacer tous les filtres
            </button>
          </div>
        )}
      </div>


      {filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredTrips.map(trip => (
            <TripCard key={trip.id} trip={trip} onSelect={() => onSelectTrip(trip.id)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <SearchIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white">Aucun Résultat Trouvé</h3>
          <p className="text-gray-400 mt-1">Essayez d'ajuster votre recherche ou vos filtres pour trouver votre voyage parfait.</p>
        </div>
      )}
    </div>
  );
};

export default TripSelection;