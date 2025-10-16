import React, { useState, useEffect } from 'react';
import { Trip, BookingDetails } from '../types';
import { ArrowLeftIcon, XIcon, ChatBubbleLeftRightIcon, CheckCircleIcon } from './IconComponents';

interface FeedbackModalProps {
  trip: Trip;
  onClose: () => void;
  onSave: (feedback: string) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ trip, onClose, onSave }) => {
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
       if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      onSave(feedback);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-black border border-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
          <h2 className="text-xl font-bold text-white">Laisser un avis pour {trip.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Partagez votre expérience..."
            className="w-full h-32 p-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          />
          <div className="mt-4 flex justify-end space-x-3">
             <button type="button" onClick={onClose} className="bg-gray-700 text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                Annuler
             </button>
             <button type="submit" className="bg-orange-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors">
                Soumettre l'avis
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};


interface PastTripsProps {
  pastTrips: Trip[];
  bookingHistory: BookingDetails[];
  onSaveFeedback: (tripId: number, feedback: string) => void;
  onBack: () => void;
}

const PastTripCard: React.FC<{ trip: Trip, booking: BookingDetails | undefined, onLeaveFeedback: () => void }> = ({ trip, booking, onLeaveFeedback }) => {
  const hasFeedback = booking && booking.feedback;

  return (
    <div className="bg-black border border-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
      <div className="sm:w-1/3 h-40 sm:h-auto">
        <img src={trip.imageUrls[0]} alt={trip.title} className="w-full h-full object-cover filter grayscale" />
      </div>
      <div className="p-4 flex flex-col justify-between w-full sm:w-2/3">
        <div>
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gray-700 text-gray-200 mb-2">
            Effectué par {booking?.fullName.split(' ')[0] || 'Vous'}
          </span>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-white">{trip.title}</h3>
            {hasFeedback && (
                <CheckCircleIcon className="h-5 w-5 text-orange-500 flex-shrink-0">
                  <title>Avis soumis</title>
                </CheckCircleIcon>
            )}
          </div>
          <p className="text-gray-400 text-sm mt-1">{trip.destination}</p>
        </div>
        <div className="mt-4">
          <button 
            onClick={onLeaveFeedback}
            disabled={!!hasFeedback}
            className={`flex items-center justify-center font-bold py-2 px-4 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-300 ${
              hasFeedback 
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
              : 'bg-gray-800 border border-gray-600 text-gray-200 hover:bg-gray-700'
            }`}
          >
            <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
            {hasFeedback ? 'Avis Soumis' : 'Laisser un avis'}
          </button>
        </div>
      </div>
    </div>
  );
};

const PastTrips: React.FC<PastTripsProps> = ({ pastTrips, bookingHistory, onSaveFeedback, onBack }) => {
  const [feedbackModalTrip, setFeedbackModalTrip] = useState<Trip | null>(null);

  const handleSaveAndClose = (feedback: string) => {
    if (feedbackModalTrip) {
      onSaveFeedback(feedbackModalTrip.id, feedback);
      setFeedbackModalTrip(null);
    }
  };

  return (
    <div className="space-y-8">
      {feedbackModalTrip && (
        <FeedbackModal 
          trip={feedbackModalTrip} 
          onClose={() => setFeedbackModalTrip(null)} 
          onSave={handleSaveAndClose} 
        />
      )}
      <button onClick={onBack} className="flex items-center text-sm text-gray-300 hover:text-orange-500 font-medium">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Retour aux voyages actuels
      </button>
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-white">Vos Aventures Passées</h1>
        <p className="mt-2 text-lg text-gray-300">Un retour sur les incroyables voyages que vous avez effectués.</p>
      </div>
      
      {pastTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pastTrips.map(trip => {
            const booking = bookingHistory.find(b => b.tripId === trip.id);
            return (
              <PastTripCard 
                key={trip.id} 
                trip={trip} 
                booking={booking}
                onLeaveFeedback={() => setFeedbackModalTrip(trip)}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-white">Aucun voyage passé pour le moment</h3>
          <p className="text-gray-400 mt-1">Une fois que vous réservez et terminez une aventure, elle apparaîtra ici.</p>
        </div>
      )}
    </div>
  );
};

export default PastTrips;