import React, { useState, useEffect, useMemo } from 'react';
import { Trip, BookingDetails } from './types';
import { ALL_TRIPS_DATA } from './data';
import TripDetails from './components/TripDetails';
import BookingForm from './components/BookingForm';
import Confirmation from './components/Confirmation';
import Header from './components/Header';
import HomePage from './components/HomePage';
import NextWeekendTrips from './components/NextWeekendTrips';
import ScrollToTopButton from './components/ScrollToTopButton';

type AppState = 'selecting' | 'details' | 'booking' | 'confirmed';

const getCurrentRoute = () => window.location.hash || '#/';

const App: React.FC = () => {
  const [route, setRoute] = useState(getCurrentRoute());
  const [appState, setAppState] = useState<AppState>('selecting');
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [ticketCount, setTicketCount] = useState<number>(1);
  const [allTrips, setAllTrips] = useState<Trip[]>(ALL_TRIPS_DATA);
  const [bookingHistory, setBookingHistory] = useState<BookingDetails[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('bookingHistory');
      if (storedHistory) {
        setBookingHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to parse booking history from localStorage", error);
    }
  }, []);
  
  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getCurrentRoute());
      // If user navigates away using browser back/forward during a booking, cancel the booking flow.
      if (appState !== 'selecting') {
          handleBackToSelection();
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [appState]);

  const updateBookingHistory = (newHistory: BookingDetails[]) => {
    setBookingHistory(newHistory);
    try {
        localStorage.setItem('bookingHistory', JSON.stringify(newHistory));
    } catch (error) {
        console.error("Failed to save booking history to localStorage", error);
    }
  };
  
  const currentTrips = useMemo(() => {
    const bookedTripIds = new Set(bookingHistory.map(b => b.tripId));
    return allTrips.filter(trip => !bookedTripIds.has(trip.id));
  }, [allTrips, bookingHistory]);

  const selectedTrip = useMemo(() => {
    return allTrips.find(trip => trip.id === selectedTripId) || null;
  }, [selectedTripId, allTrips]);


  const handleSelectTrip = (tripId: number) => {
    setSelectedTripId(tripId);
    setTicketCount(1);
    setAppState('details');
  };

  const handleBackToSelection = () => {
    setSelectedTripId(null);
    setAppState('selecting');
  };

  const handleProceedToBooking = (count: number) => {
    setTicketCount(count);
    setAppState('booking');
  };
  
  const handleBackToDetails = () => {
      setAppState('details');
  }

  const handleConfirmBooking = (details: BookingDetails) => {
    setBookingDetails(details);
    updateBookingHistory([...bookingHistory, details]);
    setAppState('confirmed');
  };
  
  const handleStartNewBooking = () => {
      setSelectedTripId(null);
      setBookingDetails(null);
      setTicketCount(1);
      setAppState('selecting');
      window.location.hash = '#/';
  }

  const renderPage = () => {
    switch (route) {
        case '#/next-weekend':
            const nextWeekendTrips = currentTrips.filter(trip => trip.isNextWeekend);
            return <NextWeekendTrips trips={nextWeekendTrips} onSelectTrip={handleSelectTrip} />;
        case '#/':
        default:
            return <HomePage trips={allTrips} onSelectTrip={handleSelectTrip} />;
    }
  };

  const renderContent = () => {
    if (appState === 'selecting') {
      return renderPage();
    }

    switch (appState) {
      case 'details':
        if (selectedTrip) {
          return <TripDetails trip={selectedTrip} onBack={handleBackToSelection} onProceed={handleProceedToBooking} />;
        }
        return null;
      case 'booking':
        if (selectedTrip) {
          return <BookingForm trip={selectedTrip} ticketCount={ticketCount} onConfirm={handleConfirmBooking} onBack={handleBackToDetails} />;
        }
        return null;
      case 'confirmed':
        if (selectedTrip && bookingDetails) {
            return <Confirmation trip={selectedTrip} bookingDetails={bookingDetails} onNewBooking={handleStartNewBooking} />;
        }
        return null;
      default:
        return renderPage();
    }
  };

  return (
    <div className="min-h-screen font-sans text-white bg-black">
      <Header />
      <main className="max-w-4xl mx-auto p-4 md:p-6">
        {renderContent()}
      </main>
      <ScrollToTopButton />
    </div>
  );
};

export default App;
