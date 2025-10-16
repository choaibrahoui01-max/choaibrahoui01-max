import React from 'react';
import { Trip } from '../types';
import { TripCard } from './TripCard';
import AboutUs from './AboutUs';
import SocialFeed from './InstagramFeed';
import { ArrowRightIcon } from './IconComponents';

interface HomePageProps {
  trips: Trip[];
  onSelectTrip: (tripId: number) => void;
}

const HomePage: React.FC<HomePageProps> = ({ trips, onSelectTrip }) => {
  // Select top 10 trips for featuring by rating and review count
  const featuredTrips = [...trips]
    .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
    .slice(0, 10);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="relative text-center bg-black text-white rounded-lg overflow-hidden shadow-2xl">
        <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&h=900&fit=crop" alt="Algerian mountain landscape" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative py-24 px-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-orange-500">Nature is calling, and we must go</h1>
          <p className="mt-4 text-xl max-w-2xl mx-auto">Explore breathtaking spots and live unforgettable adventures.</p>
        </div>
      </div>

      {/* Featured Trips Section */}
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-orange-500">Choisissez Votre Prochaine Aventure</h2>
        <p className="mt-2 text-lg text-gray-300">Pour des endroits à couper le souffle et des aventures inoubliables.</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredTrips.map(trip => (
            <TripCard key={trip.id} trip={trip} onSelect={() => onSelectTrip(trip.id)} />
          ))}
        </div>
      </div>

      <SocialFeed />
      <AboutUs />
    </div>
  );
};

export default HomePage;