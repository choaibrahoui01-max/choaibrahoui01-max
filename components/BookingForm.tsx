import React, { useState } from 'react';
import { Trip, BookingDetails } from '../types';
import { ArrowLeftIcon, SpinnerIcon, DevicePhoneMobileIcon, AlgPosteLogo, CibLogo } from './IconComponents';

interface BookingFormProps {
  trip: Trip;
  ticketCount: number;
  onConfirm: (details: BookingDetails) => void;
  onBack: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ trip, ticketCount, onConfirm, onBack }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    photoId: '', // Will store base64 string
    pickupPoint: 'Grand parking - Ruisseau', // Default pickup point
    phone: '',
    email: '',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [cardType, setCardType] = useState('poste');
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoIdFileName, setPhotoIdFileName] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing'>('idle');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const totalPrice = trip.price * ticketCount;
  const depositAmount = totalPrice * 0.25;
  const remainingBalance = totalPrice - depositAmount;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (paymentError) setPaymentError(null);
    if (errors[name]) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoId: reader.result as string }));
        setPhotoIdFileName(file.name);
        if (errors.photoId) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.photoId;
                return newErrors;
            });
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const validatePassengerInfo = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Le nom complet est requis.';
    if (!formData.photoId) newErrors.photoId = 'Une photo de votre pièce d\'identité est requise.';
    if (!formData.pickupPoint.trim()) newErrors.pickupPoint = 'Le point de rendez-vous est requis.';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est requis.';
    } else if (!/^\+?\d{10,14}$/.test(formData.phone)) {
      newErrors.phone = 'Veuillez entrer un numéro de téléphone valide.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email est invalide.';
    }
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentInfo = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.cardName.trim()) newErrors.cardName = 'Le nom sur la carte est requis.';
    if (!formData.cardNumber.replace(/\s/g, '')) {
      newErrors.cardNumber = 'Le numéro de carte est requis.';
    } else if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Le numéro de carte doit comporter 16 chiffres.';
    }
    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = 'La date d\'expiration est requise.';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'La date d\'expiration doit être au format MM/AA.';
    } else {
      const [month, year] = formData.expiryDate.split('/');
      const expiry = new Date(2000 + parseInt(year, 10), parseInt(month, 10) - 1);
      const lastDayOfMonth = new Date(expiry.getFullYear(), expiry.getMonth() + 1, 0);
      if (lastDayOfMonth < new Date()) {
        newErrors.expiryDate = 'La carte a expiré.';
      }
    }
    if (!formData.cvv.trim()) {
      newErrors.cvv = 'Le CVV est requis.';
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'Le CVV doit comporter 3 ou 4 chiffres.';
    }
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };
  
  const validateOtp = () => {
    const newErrors: Record<string, string> = {};
    if (!otp.trim()) {
        newErrors.otp = 'L\'OTP est requis.';
    } else if (!/^\d{4}$/.test(otp)) {
        newErrors.otp = 'L\'OTP doit comporter 4 chiffres.';
    }
    setErrors(prev => ({ ...prev, otp: newErrors.otp }));
    return Object.keys(newErrors).length === 0;
  }

  const handleCardPaymentStart = () => {
    setPaymentStatus('processing');
    setPaymentError(null);
    // Simulate checking card details
    setTimeout(() => {
      if (formData.cardNumber.endsWith('1111')) {
          setPaymentError('Votre carte a été refusée. Veuillez vérifier vos informations ou essayer une autre carte.');
          setPaymentStatus('idle');
          return;
      }
      if (formData.cvv === '123') {
          setPaymentError('Le CVV saisi est incorrect. Veuillez vérifier le code à 3 ou 4 chiffres au dos de votre carte.');
          setPaymentStatus('idle');
          return;
      }
      setPaymentStatus('idle');
      setStep(2);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const isPassengerInfoValid = validatePassengerInfo();
    if (!isPassengerInfoValid) return;

    const isPaymentInfoValid = validatePaymentInfo();
    if (isPaymentInfoValid) {
      handleCardPaymentStart();
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentStatus === 'processing' || !validateOtp()) {
        return;
    }
    
    setPaymentStatus('processing');
    setPaymentError(null);

    setTimeout(() => {
        if (otp === '0000') {
            setPaymentError('L\'OTP ne correspond pas. Veuillez vérifier le code envoyé sur votre téléphone et réessayer.');
            setPaymentStatus('idle');
            setOtp('');
            return;
        }
        const mockPaymentId = `pi_${crypto.randomUUID().replace(/-/g, '')}`;
        const { cardName, cardNumber, expiryDate, cvv, ...rest } = formData;
        
        const bookingDetails: BookingDetails = {
            tripId: trip.id,
            ...rest,
            ticketCount: ticketCount,
            totalPrice: totalPrice,
            amountPaid: depositAmount,
            remainingBalance: remainingBalance,
            paymentId: mockPaymentId,
            paymentMethod: 'card',
        };
        onConfirm(bookingDetails);

    }, 2000);
  };
  
  const FormInput: React.FC<{label: string, name: string, value: string, required?: boolean, type?: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, error?: string, placeholder?: string}> = 
  ({ label, name, value, required = false, type = 'text', onChange, error, placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-200 mb-1">{label}{required ? '*' : ''}</label>
        <input 
            type={type} 
            name={name} 
            id={name}
            placeholder={placeholder || label}
            value={value} 
            onChange={onChange} 
            className={`w-full bg-gray-900 text-white border-gray-600 rounded-md shadow-sm ${error ? 'border-red-500 ring-1 ring-red-500' : 'focus:border-orange-500 focus:ring-orange-500'}`}
        />
        {error && <p className="text-red-600 text-sm font-medium mt-1 error-message-animation">{error}</p>}
    </div>
  );

  const FormSelect: React.FC<{label: string, name: string, value: string, required?: boolean, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, error?: string, children: React.ReactNode}> = 
  ({ label, name, value, required = false, onChange, error, children }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-200 mb-1">{label}{required ? '*' : ''}</label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full bg-gray-900 text-white border-gray-600 rounded-md shadow-sm ${error ? 'border-red-500 ring-1 ring-red-500' : 'focus:border-orange-500 focus:ring-orange-500'}`}
      >
        {children}
      </select>
      {error && <p className="text-red-600 text-sm font-medium mt-1 error-message-animation">{error}</p>}
    </div>
  );

  const StepIndicator = () => (
    <div className="w-full max-w-sm mx-auto mb-8">
        <div className="flex items-center">
            <div className={`flex items-center ${step >= 1 ? 'text-orange-500' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full border-2 ${step >= 1 ? 'border-orange-500 bg-orange-500 text-black' : 'border-gray-600'} flex items-center justify-center font-bold transition-colors`}>
                    {step > 1 ? '✓' : '1'}
                </div>
            </div>
            <div className={`flex-auto border-t-2 transition-colors duration-500 ${step >= 2 ? 'border-orange-500' : 'border-gray-700'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-orange-500' : 'text-gray-500'}`}>
                 <div className={`w-8 h-8 rounded-full border-2 ${step >= 2 ? 'border-orange-500' : 'border-gray-600'} flex items-center justify-center font-bold transition-colors`}>
                    2
                </div>
            </div>
        </div>
        <div className="flex justify-between font-medium mt-2 text-sm px-2">
            <span className={step >= 1 ? 'text-orange-400' : 'text-gray-400'}>Infos & Paiement</span>
            <span className={step >= 2 ? 'text-orange-400' : 'text-gray-400'}>Confirmer OTP</span>
        </div>
    </div>
  );

  return (
    <div className="bg-black rounded-lg shadow-xl p-6 sm:p-8">
        <button onClick={onBack} className="flex items-center text-sm text-gray-300 hover:text-orange-500 font-medium mb-4">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Retour aux détails du voyage
        </button>
      <h1 className="text-3xl font-bold text-center mb-2 text-white">Paiement</h1>
      <p className="text-center text-gray-300 mb-8">{trip.title}</p>
      
      <StepIndicator />

      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-2">
              <div>
                <h2 className="text-xl font-semibold text-white">Informations du Passager</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <FormInput label="Nom Complet" name="fullName" value={formData.fullName} onChange={handleChange} required error={errors.fullName} />
                  <FormInput label="Adresse Email" name="email" value={formData.email} onChange={handleChange} required type="email" error={errors.email} />
                  <FormInput label="Numéro de Téléphone" name="phone" value={formData.phone} onChange={handleChange} required type="tel" error={errors.phone} />
                  <FormSelect label="Point de Rendez-vous" name="pickupPoint" value={formData.pickupPoint} onChange={handleChange} required error={errors.pickupPoint}>
                      <option>Grand parking - Ruisseau</option>
                      <option>Le pont - Bab Ezzouar</option>
                      <option>Family shop - Blida</option>
                  </FormSelect>
                </div>
                <div className="mt-4">
                    <label htmlFor="photoId" className="block text-sm font-medium text-gray-200 mb-1">Photo d'une pièce d'identité*</label>
                    <label htmlFor="photoId" className={`w-full text-sm font-medium py-3 px-4 border rounded-md shadow-sm flex items-center justify-between cursor-pointer ${errors.photoId ? 'border-red-500 text-red-300' : 'border-gray-600 text-gray-300'}`}>
                        <span>{photoIdFileName || 'Télécharger la photo'}</span>
                        <span className="bg-gray-700 border border-gray-600 rounded-md px-3 py-1 text-xs font-semibold">Choisir un fichier</span>
                    </label>
                    <input type="file" id="photoId" name="photoId" accept="image/*" onChange={handleFileChange} className="sr-only" />
                    {errors.photoId && <p className="text-red-600 text-sm font-medium mt-1 error-message-animation">{errors.photoId}</p>}
                </div>
              </div>
              
              <div className="pt-4">
                 <h2 className="text-xl font-semibold text-white">Paiement Sécurisé</h2>
                 <div className="mt-4 space-y-4">
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                        <div
                            onClick={() => setCardType('poste')}
                            className={`flex-1 flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${cardType === 'poste' ? 'border-orange-500 bg-orange-500/10' : 'border-gray-600 hover:border-gray-500'}`}
                        >
                            <input type="radio" name="cardType" id="poste" value="poste" checked={cardType === 'poste'} onChange={() => setCardType('poste')} className="h-4 w-4 text-orange-600 bg-gray-800 border-gray-500 focus:ring-orange-500" />
                            <label htmlFor="poste" className="ml-3 flex items-center cursor-pointer w-full"><AlgPosteLogo className="h-8 mr-3 flex-shrink-0" /><span className="font-semibold text-white">ALGÉRIE POSTE</span></label>
                        </div>
                        <div
                            onClick={() => setCardType('satim')}
                            className={`flex-1 flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${cardType === 'satim' ? 'border-orange-500 bg-orange-500/10' : 'border-gray-600 hover:border-gray-500'}`}
                        >
                            <input type="radio" name="cardType" id="satim" value="satim" checked={cardType === 'satim'} onChange={() => setCardType('satim')} className="h-4 w-4 text-orange-600 bg-gray-800 border-gray-500 focus:ring-orange-500" />
                            <label htmlFor="satim" className="ml-3 flex items-center cursor-pointer w-full"><CibLogo className="h-6 mr-3 flex-shrink-0" /><span className="font-semibold text-white">DAHABIA / SATIM</span></label>
                        </div>
                    </div>
                    <div className="border border-gray-700 rounded-lg p-4 space-y-4 bg-gray-900">
                        <FormInput label="Numéro de carte" name="cardNumber" value={formData.cardNumber} onChange={handleChange} required error={errors.cardNumber} placeholder="1234 5678 9123 4567" />
                        <div className="grid grid-cols-2 gap-4">
                          <FormInput label="Expiration (MM/AA)" name="expiryDate" value={formData.expiryDate} onChange={handleChange} required error={errors.expiryDate} placeholder="12/26" />
                          <FormInput label="CVV" name="cvv" value={formData.cvv} onChange={handleChange} required error={errors.cvv} placeholder="123" />
                        </div>
                        <FormInput label="Nom sur la carte" name="cardName" value={formData.cardName} onChange={handleChange} required error={errors.cardName} placeholder="Nom sur la carte" />
                    </div>
                 </div>
              </div>
              {paymentError && <p className="text-red-600 text-sm font-medium text-center py-2">{paymentError}</p>}
              <button type="submit" disabled={paymentStatus === 'processing'} className="w-full bg-orange-600 text-white font-bold py-3 px-4 rounded-lg mt-6 hover:bg-orange-700 transition-colors duration-300 shadow-lg flex justify-center items-center disabled:bg-gray-600 disabled:cursor-wait">
                {paymentStatus === 'processing' ? (<><SpinnerIcon className="h-5 w-5 mr-2 animate-spin" />Traitement...</>) : 
                  `Payer l'acompte ${depositAmount.toFixed(2)} DZD`
                }
              </button>
            </form>

            <div className="lg:col-span-1">
                <div className="sticky top-24 bg-gray-900 border border-gray-800 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-white uppercase border-b border-gray-700 pb-3 mb-4">Récapitulatif de la commande</h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-300">
                            <span>Sous-total</span>
                            <span>{totalPrice.toFixed(2)} DZD</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                            <span>Billets</span>
                            <span>{ticketCount} x {trip.price.toFixed(2)} DZD</span>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 my-4"></div>
                    <div className="space-y-2">
                        <div className="flex justify-between font-bold text-white text-lg">
                            <span>Total</span>
                            <span className="text-orange-500">{totalPrice.toFixed(2)} DZD</span>
                        </div>
                        <div className="text-right mt-4 text-xs">
                           <p className="text-gray-300">Payable maintenant (25%): <span className="font-semibold text-orange-400">{depositAmount.toFixed(2)} DZD</span></p>
                           <p className="text-gray-400">Restant: <span className="font-semibold">{remainingBalance.toFixed(2)} DZD</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
      
      {step === 2 && (
        <form onSubmit={handleFinalSubmit} className="space-y-4 max-w-md mx-auto">
          <div className="text-center">
            <DevicePhoneMobileIcon className="h-12 w-12 mx-auto text-orange-500" />
            <h2 className="text-xl font-semibold mt-4 text-white">Confirmez Votre OTP</h2>
            <p className="text-gray-300 mt-2">
              Un SMS avec un mot de passe à usage unique a été envoyé à votre numéro de téléphone : <span className="font-semibold">{formData.phone}</span>.
            </p>
          </div>

          <div>
            <input 
                type="text" 
                name="otp" 
                placeholder="____"
                value={otp} 
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                className={`w-full text-center tracking-[1em] sm:tracking-[2em] text-2xl font-bold bg-gray-900 text-white border-gray-600 rounded-md shadow-sm p-3 ${errors.otp ? 'border-red-500 ring-1 ring-red-500' : 'focus:border-orange-500 focus:ring-orange-500'}`}
                maxLength={4}
                autoComplete="one-time-code"
                inputMode="numeric"
            />
            {errors.otp && <p className="text-red-600 text-sm font-medium mt-1 text-center error-message-animation">{errors.otp}</p>}
          </div>

          {paymentError && <p className="text-red-600 text-sm font-medium text-center">{paymentError}</p>}

          <div className="flex gap-4 mt-6">
            <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-gray-700 text-gray-200 font-bold py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-300">
                Retour
            </button>
            <button 
                type="submit" 
                disabled={paymentStatus === 'processing'}
                className="w-2/3 bg-orange-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors duration-300 shadow-lg flex justify-center items-center disabled:bg-gray-600 disabled:cursor-wait"
            >
                {paymentStatus === 'processing' ? (
                    <>
                        <SpinnerIcon className="h-5 w-5 mr-2 animate-spin" />
                        Vérification...
                    </>
                ) : `Confirmer & Payer ${depositAmount.toFixed(2)} DZD`}
            </button>
          </div>
        </form>
      )}

    </div>
  );
};

export default BookingForm;