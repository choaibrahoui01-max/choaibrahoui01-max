import React, { useState, useEffect } from 'react';
import { Trip } from '../types';
import { XIcon, LinkIcon } from './IconComponents';

interface ShareModalProps {
  trip: Trip;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ trip, onClose }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copier');
  
  // Use the actual origin for a dynamic URL
  const shareUrl = `${window.location.origin}/trips/${trip.id}`;
  const shareText = `Découvrez cette aventure incroyable : ${trip.title} !`;
  
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  const socialLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopyButtonText('Copié !');
      setTimeout(() => setCopyButtonText('Copier'), 2000);
    });
  };
  
  // Close modal on Escape key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
       if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-black border border-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
          <h2 className="text-xl font-bold text-white">Partager cette aventure</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300">
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-300">Partagez un lien vers ce voyage avec vos amis !</p>
          
          <div className="flex justify-around items-center py-4">
            <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-orange-500 font-semibold transition-colors">Twitter</a>
            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-orange-500 font-semibold transition-colors">Facebook</a>
            <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-orange-500 font-semibold transition-colors">WhatsApp</a>
          </div>

          <div className="relative">
            <LinkIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-24 py-2 text-gray-200 focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className={`absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                copyButtonText === 'Copié !' 
                ? 'bg-orange-600 text-white' 
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              }`}
            >
              {copyButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;