import React, { useMemo, useRef, useState } from 'react';
import { Trip, BookingDetails } from '../types';
import { CheckCircleIcon, ArrowDownTrayIcon, PaperAirplaneIcon, SpinnerIcon } from './IconComponents';

// Since html2canvas is loaded from a CDN
declare const html2canvas: any;

interface ConfirmationProps {
  trip: Trip;
  bookingDetails: BookingDetails;
  onNewBooking: () => void;
}

const Confirmation: React.FC<ConfirmationProps> = ({ trip, bookingDetails, onNewBooking }) => {
  const boardingPassRef = useRef<HTMLDivElement>(null);
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  
  const bookingReference = useMemo(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = today.getFullYear();
    const dateStr = `${day}${month}${year}`;
    // Simulate a spot number. In a real app, this would come from the booking system.
    const spotNumber = String(Math.floor(Math.random() * 32) + 1).padStart(3, '0');
    return `SHA${dateStr}${spotNumber}`;
  }, []); // Empty dependency array ensures it's generated only once per component mount.

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=${encodeURIComponent(bookingReference)}&bgcolor=000000&color=ffffff&qzone=1`;

  const handleDownload = () => {
    if (boardingPassRef.current) {
      html2canvas(boardingPassRef.current, { 
        scale: 2, // For better image quality
        useCORS: true, // Important for external images
        backgroundColor: '#000000', // Match the component background for clean edges
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Tahwisa213-Billet-${bookingReference}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  const handleSendToAgency = () => {
    setSendStatus('sending');
    // Simulate API call to a backend
    setTimeout(() => {
      setSendStatus('sent');
    }, 1500);
  };

  return (
    <div className="text-center p-4">
      <CheckCircleIcon className="h-16 w-16 text-orange-500 mx-auto mb-4" />
      <h1 className="text-3xl font-bold text-white">Réservation Confirmée !</h1>
      <p className="text-gray-300 mt-2 mb-8">
        Merci, {bookingDetails.fullName.split(' ')[0]} ! Votre aventure vous attend. Un email de confirmation a été envoyé à {bookingDetails.email}.
      </p>

      {/* Boarding Pass */}
      <div ref={boardingPassRef} className="max-w-3xl mx-auto bg-black border-2 border-gray-800 rounded-xl shadow-2xl flex flex-col md:flex-row my-8 transform transition-all hover:scale-105 duration-300">
        <div className="md:w-2/3 p-6 text-left bg-cover bg-center rounded-t-xl md:rounded-l-xl md:rounded-tr-none" style={{ backgroundImage: `url(${trip.imageUrls[0]})` }}>
           <div className="bg-black bg-opacity-50 p-4 rounded-lg">
             <p className="text-sm font-light text-gray-300">VOUS ALLEZ À</p>
             <h2 className="text-4xl font-extrabold text-white tracking-wider uppercase">{trip.destination.split(',')[0]}</h2>
           </div>
        </div>
        <div className="md:w-1/3 p-6 flex flex-col justify-between bg-black rounded-b-xl md:rounded-r-xl md:rounded-bl-none">
          <div>
            <h3 className="text-xl font-bold text-gray-100 border-b-2 border-gray-700 pb-2">CARTE D'EMBARQUEMENT</h3>
            <div className="mt-4 space-y-3 text-sm">
                <div>
                    <p className="text-gray-400 font-semibold">PASSAGER</p>
                    <p className="text-white font-medium">{bookingDetails.fullName}</p>
                </div>
                 <div>
                    <p className="text-gray-400 font-semibold">BILLETS</p>
                    <p className="text-white font-medium">{bookingDetails.ticketCount}</p>
                </div>
                <div>
                    <p className="text-gray-400 font-semibold">DÉPART</p>
                    <p className="text-white font-medium">{trip.departureTime}</p>
                </div>
                <div>
                    <p className="text-gray-400 font-semibold">POINT DE RENDEZ-VOUS</p>
                    <p className="text-white font-medium">{bookingDetails.pickupPoint}</p>
                </div>
                 <div className="border-t border-gray-700 pt-3 space-y-2">
                    <div>
                        <p className="text-gray-400 font-semibold text-xs">PRIX TOTAL</p>
                        <p className="text-white font-medium">{bookingDetails.totalPrice.toFixed(2)} DZD</p>
                    </div>
                    <div>
                        <p className="text-gray-400 font-semibold text-xs">MONTANT PAYÉ (ACOMPTE)</p>
                        <p className="text-orange-500 font-bold">{bookingDetails.amountPaid.toFixed(2)} DZD</p>
                    </div>
                    <div>
                        <p className="text-whit-400 font-semibold text-xs">SOLDE RESTANT</p>
                        <p className="text-red-500 font-bold">{bookingDetails.remainingBalance.toFixed(2)} DZD</p>
                    </div>
                </div>
                <div>
                    <p className="text-gray-400 font-semibold">ID DE TRANSACTION</p>
                    <p className="text-white font-medium text-xs break-all">{bookingDetails.paymentId}</p>
                </div>
            </div>
          </div>
          <div className="mt-6 border-t border-dashed border-gray-600 pt-4 text-center">
            <img src={qrCodeUrl} alt="Booking QR Code" className="mx-auto h-24 w-24 rounded-md" />
            <p className="text-xs text-gray-300 font-mono mt-2">{bookingReference}</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
        <button
          onClick={onNewBooking}
          className="bg-orange-600 text-white font-bold py-3 px-6 rounded-full hover:bg-orange-700 transition-colors duration-300 shadow-lg w-full sm:w-auto"
        >
          Réserver un autre voyage
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center justify-center bg-gray-700 border border-gray-600 text-gray-200 font-bold py-3 px-6 rounded-full hover:bg-gray-600 transition-colors duration-300 shadow-lg w-full sm:w-auto"
        >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Télécharger le billet
        </button>
        <button
          onClick={handleSendToAgency}
          disabled={sendStatus !== 'idle'}
          className="flex items-center justify-center bg-orange-600 text-white font-bold py-3 px-6 rounded-full hover:bg-orange-700 transition-colors duration-300 shadow-lg w-full sm:w-auto disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
            {sendStatus === 'sending' && <SpinnerIcon className="h-5 w-5 mr-2 animate-spin" />}
            {sendStatus === 'sent' && <CheckCircleIcon className="h-5 w-5 mr-2" />}
            {sendStatus === 'idle' && <PaperAirplaneIcon className="h-5 w-5 mr-2" />}
            {sendStatus === 'idle' ? "Envoyer à l'agence" : sendStatus === 'sending' ? 'Envoi en cours...' : 'Envoyé avec succès !'}
        </button>
      </div>

    </div>
  );
};

export default Confirmation;