import React, { useState } from 'react';
import { Trip } from '../types';
import { ArrowRightIcon, StarIcon, LocationMarkerIcon, ExclamationTriangleIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon } from './IconComponents';

export const TripCard: React.FC<{ trip: Trip; onSelect: () => void }> = ({ trip, onSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  let difficultyColor;
  let difficultyText;
  switch(trip.difficulty) {
    case 'Difficult':
      difficultyColor = 'bg-red-900/50 text-red-300';
      difficultyText = 'Difficile';
      break;
    case 'Medium':
      difficultyColor = 'bg-yellow-900/50 text-yellow-300';
      difficultyText = 'Moyen';
      break;
    case 'Easy':
      difficultyColor = 'bg-green-900/50 text-green-300';
      difficultyText = 'Facile';
      break;
    default:
      difficultyColor = 'bg-gray-700 text-gray-200';
      difficultyText = trip.difficulty;
  }

  const renderStars = (rating: number) => {
    const stars = [];
    const roundedRating = Math.round(rating);
    for (let i = 0; i < 5; i++) {
        stars.push(
            <StarIcon key={i} className={`h-5 w-5 ${i < roundedRating ? 'text-yellow-400' : 'text-gray-500'}`} />
        );
    }
    return stars;
  };
  
  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? trip.imageUrls.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isLastSlide = currentIndex === trip.imageUrls.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (e: React.MouseEvent, slideIndex: number) => {
    e.stopPropagation();
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="bg-black border border-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl flex flex-col">
      <div className="relative group">
        <div 
          style={{ backgroundImage: `url(${trip.imageUrls[currentIndex]})` }} 
          className="w-full h-48 bg-center bg-cover transition-all duration-500 ease-in-out"
        ></div>
        {/* Left Arrow */}
        <button onClick={goToPrevious} className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 left-2 text-xl rounded-full p-1.5 bg-black/50 hover:bg-black/70 text-white cursor-pointer transition-opacity duration-300" aria-label="Image précédente">
            <ChevronLeftIcon className="h-5 w-5" />
        </button>
        {/* Right Arrow */}
        <button onClick={goToNext} className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 right-2 text-xl rounded-full p-1.5 bg-black/50 hover:bg-black/70 text-white cursor-pointer transition-opacity duration-300" aria-label="Image suivante">
            <ChevronRightIcon className="h-5 w-5" />
        </button>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
            {trip.imageUrls.map((_, slideIndex) => (
                <button
                    key={slideIndex}
                    onClick={(e) => goToSlide(e, slideIndex)}
                    className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-300 ${currentIndex === slideIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                    aria-label={`Aller à l'image ${slideIndex + 1}`}
                ></button>
            ))}
        </div>
        {trip.isNextWeekend && (
          <div className="absolute top-3 right-3 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
            Weekend Prochain
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div>
            <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${difficultyColor}`}>
                    {trip.difficulty === 'Difficult' && <ExclamationTriangleIcon className="h-4 w-4 mr-1.5" />}
                    {difficultyText}
                </span>
                <span className="inline-block px-3 py-1 text-xs font-semibold text-gray-300 bg-gray-800 rounded-full">
                    {trip.category}
                </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 min-h-[3.5rem]">{trip.title}</h3>
            
            <div className="flex items-center text-gray-300 mb-1">
              <LocationMarkerIcon className="h-5 w-5 mr-2 flex-shrink-0" />
              <p className="text-sm font-medium truncate" title={trip.destination}>{trip.destination}</p>
            </div>

            <div className="flex items-center text-gray-300 mb-3">
              <ClockIcon className="h-5 w-5 mr-2 flex-shrink-0" />
              <p className="text-sm font-medium">{trip.duration}</p>
            </div>

            <div className="flex items-center mb-4 min-h-[1.25rem]">
              {trip.reviewCount > 0 ? (
                <>
                  {renderStars(trip.rating)}
                  <span className="text-gray-300 text-sm ml-2 font-medium">{trip.reviewCount} avis</span>
                </>
              ) : (
                <span className="text-gray-400 text-sm">Aucun avis pour le moment</span>
              )}
            </div>
        </div>
        <div className="flex justify-between items-center border-t border-gray-700 pt-4 mt-auto">
          <div>
            <span className="text-lg font-bold text-orange-500">{trip.price} DZD</span>
            <span className="text-sm text-gray-400"> / personne</span>
          </div>
          <button
            onClick={onSelect}
            className="flex items-center bg-orange-600 text-white font-bold py-2 px-4 rounded-full hover:bg-orange-700 transition-colors duration-300"
          >
            Voir les Détails
            <ArrowRightIcon className="h-5 w-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};