import React, { useState, useEffect } from 'react';
import { Trip } from '../types';
import { ArrowLeftIcon, LocationMarkerIcon, StarIcon, UserGroupIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon, ShareIcon, MagnifyingGlassPlusIcon, XIcon, TagIcon } from './IconComponents';
import ShareModal from './ShareModal';

interface TripDetailsProps {
  trip: Trip;
  onBack: () => void;
  onProceed: (ticketCount: number) => void;
}

const TripDetails: React.FC<TripDetailsProps> = ({ trip, onBack, onProceed }) => {
  const [ticketCount, setTicketCount] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const totalPrice = trip.price * ticketCount;
  const depositAmount = totalPrice * 0.25;
  const remainingBalance = totalPrice - depositAmount;
  
  let difficultyColor;
  let difficultyText;
  switch(trip.difficulty) {
    case 'Difficult':
      difficultyColor = 'text-red-500';
      difficultyText = 'Difficile';
      break;
    case 'Medium':
      difficultyColor = 'text-yellow-500';
      difficultyText = 'Moyen';
      break;
    case 'Easy':
      difficultyColor = 'text-green-500';
      difficultyText = 'Facile';
      break;
    default:
      difficultyColor = 'text-gray-300';
      difficultyText = trip.difficulty;
  }

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? trip.imageUrls.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === trip.imageUrls.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
       if (event.key === 'Escape') {
        setIsLightboxOpen(false);
      }
    };
    if (isLightboxOpen) {
        window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isLightboxOpen]);


  const renderStars = (rating: number) => {
    const stars = [];
    const roundedRating = Math.round(rating);
    for (let i = 0; i < 5; i++) {
        stars.push(
            <StarIcon key={i} className={`h-5 w-5 ${i < roundedRating ? 'text-yellow-400' : 'text-gray-400'}`} />
        );
    }
    return stars;
  };

  return (
    <div className="bg-black rounded-lg shadow-xl overflow-hidden">
        {isShareModalOpen && <ShareModal trip={trip} onClose={() => setIsShareModalOpen(false)} />}
        
        {isLightboxOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 transition-opacity duration-300"
            onClick={() => setIsLightboxOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Galerie d'images"
          >
            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute top-1/2 -translate-y-1/2 left-5 text-2xl rounded-full p-2 bg-black/50 hover:bg-black/70 text-white cursor-pointer transition-all duration-300 z-50"
              aria-label="Image précédente"
            >
              <ChevronLeftIcon className="h-8 w-8" />
            </button>
            
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <img src={trip.imageUrls[currentIndex]} alt={`${trip.title} - Image ${currentIndex + 1}`} className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl" />
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute top-1/2 -translate-y-1/2 right-5 text-2xl rounded-full p-2 bg-black/50 hover:bg-black/70 text-white cursor-pointer transition-all duration-300 z-50"
              aria-label="Image suivante"
            >
              <ChevronRightIcon className="h-8 w-8" />
            </button>
            
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-5 right-5 text-2xl rounded-full p-2 bg-black/50 hover:bg-black/70 text-white cursor-pointer transition-all duration-300 z-50"
              aria-label="Fermer la galerie"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>
        )}

        <div className="p-4 sm:p-6 flex justify-between items-center">
            <button onClick={onBack} className="flex items-center text-sm text-gray-300 hover:text-orange-500 font-medium">
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Retour à tous les voyages
            </button>
            <button onClick={() => setIsShareModalOpen(true)} className="flex items-center text-sm text-gray-300 hover:text-orange-500 font-medium py-2 px-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
              <ShareIcon className="h-4 w-4 mr-2" />
              Partager
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Left Column: Details */}
            <div className="lg:col-span-2 p-6">
                <div 
                  className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-6 group shadow-lg cursor-pointer"
                  onClick={() => setIsLightboxOpen(true)}
                  aria-label="Ouvrir la galerie d'images"
                >
                    <div 
                        style={{ backgroundImage: `url(${trip.imageUrls[currentIndex]})` }} 
                        className="w-full h-full bg-center bg-cover transition-all duration-500 ease-in-out"
                    ></div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                      <MagnifyingGlassPlusIcon className="h-16 w-16 text-white opacity-0 group-hover:opacity-80 transform scale-50 group-hover:scale-100 transition-all duration-300"/>
                    </div>
                    {/* Left Arrow */}
                    <button onClick={(e) => { e.stopPropagation(); goToPrevious(); }} className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 left-5 text-2xl rounded-full p-2 bg-black/50 hover:bg-black/70 text-white cursor-pointer transition-opacity duration-300" aria-label="Image précédente">
                        <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                    {/* Right Arrow */}
                    <button onClick={(e) => { e.stopPropagation(); goToNext(); }} className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 right-5 text-2xl rounded-full p-2 bg-black/50 hover:bg-black/70 text-white cursor-pointer transition-opacity duration-300" aria-label="Image suivante">
                        <ChevronRightIcon className="h-6 w-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {trip.imageUrls.map((_, slideIndex) => (
                            <button
                                key={slideIndex}
                                onClick={(e) => { e.stopPropagation(); setCurrentIndex(slideIndex); }}
                                className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-300 ${currentIndex === slideIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                                aria-label={`Aller à l'image ${slideIndex + 1}`}
                            ></button>
                        ))}
                    </div>
                </div>
                <h1 className="text-3xl font-extrabold text-white mb-2">{trip.title}</h1>
                <div className="flex items-center mb-4 flex-wrap gap-x-4 gap-y-2">
                    <div className="flex items-center">
                        <LocationMarkerIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <p className="text-gray-300">{trip.destination}</p>
                    </div>
                    <div className="flex items-center">
                        <TagIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <p className="text-gray-300 font-medium">{trip.category}</p>
                    </div>
                </div>
                
                <div className="border-t border-b border-gray-700 py-4 my-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <p className="font-bold text-orange-500 text-xl">{trip.distance || 'N/A'} {trip.distance ? 'km' : ''}</p>
                        <p className="text-sm text-gray-400">Distance</p>
                    </div>
                    <div>
                        <p className={`font-bold ${difficultyColor} text-xl`}>{difficultyText}</p>
                        <p className="text-sm text-gray-400">Difficulté</p>
                    </div>
                     <div>
                        <p className="font-bold text-orange-500 text-xl">{trip.duration}</p>
                        <p className="text-sm text-gray-400">Durée</p>
                    </div>
                     <div>
                        <UserGroupIcon className="h-6 w-6 text-orange-500 mx-auto mb-1" />
                        <p className="text-sm text-gray-400">{trip.type}</p>
                    </div>
                </div>

                <div className="space-y-4 text-gray-300">
                    <h2 className="text-xl font-bold text-gray-100">Informations sur le voyage</h2>
                    <p>{trip.purpose}</p>
                    <p><strong className="font-semibold text-gray-200">Point de Rendez-vous :</strong> {trip.meetingPoint}</p>
                    <p><strong className="font-semibold text-gray-200">Horaires :</strong> Départ à {trip.departureTime}, retour prévu vers {trip.returnTime}.</p>
                    <p><strong className="font-semibold text-gray-200">Ce qui est inclus :</strong> {trip.includes.join(', ')}</p>
                    <p><strong className="font-semibold text-gray-200">Équipement Requis :</strong> {trip.equipment.join(', ')}</p>
                </div>
            </div>

            {/* Right Column: Booking */}
            <div className="lg:col-span-1 bg-gray-900 p-6 border-l border-gray-800">
                <div className="sticky top-6">
                    <h2 className="text-2xl font-bold text-gray-100 mb-4">Réservez Votre Place</h2>
                    
                    <div className="bg-orange-900/50 border border-orange-700 text-orange-200 p-3 rounded-lg text-center mb-4">
                        <p className="font-semibold">Les billets sont disponibles !</p>
                        <p className="text-sm">Réservez maintenant avant qu'ils ne soient épuisés.</p>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="tickets" className="block text-sm font-medium text-gray-200 mb-1">Nombre de Billets</label>
                        <select
                            id="tickets"
                            value={ticketCount}
                            onChange={(e) => setTicketCount(Number(e.target.value))}
                            className="w-full bg-gray-800 text-white border-gray-600 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>
                    
                    <div className="space-y-2 text-sm border border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between text-gray-300">
                            <span>Prix Total ({ticketCount} x {trip.price.toFixed(2)} DZD)</span>
                            <span className="font-semibold">{totalPrice.toFixed(2)} DZD</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t mt-2 border-gray-700">
                            <span className="font-semibold">Payable maintenant (acompte de 25%)</span>
                            <span className="font-bold text-orange-400 text-lg">{depositAmount.toFixed(2)} DZD</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>Solde restant</span>
                            <span>{remainingBalance.toFixed(2)} DZD</span>
                        </div>
                    </div>

                    <button
                        onClick={() => onProceed(ticketCount)}
                        className="w-full bg-orange-600 text-white font-bold py-3 px-4 rounded-lg mt-6 hover:bg-orange-700 transition-colors duration-300 shadow-lg"
                    >
                        Réserver & Payer {depositAmount.toFixed(2)} DZD
                    </button>
                    
                    <div className="mt-6 border-t border-gray-700 pt-4">
                        <div className="flex justify-center items-center">
                            {renderStars(trip.rating)}
                        </div>
                        <p className="text-center text-sm text-gray-300 mt-1">
                            <span className="font-bold">{trip.rating.toFixed(1)}</span> sur 5 basé sur <span className="font-bold">{trip.reviewCount}</span> avis
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default TripDetails;