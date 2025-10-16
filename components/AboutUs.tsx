import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div id="about-us-section" className="bg-black rounded-lg shadow-lg p-8 sm:p-12 my-16">
      <h2 className="text-3xl font-extrabold text-white text-center mb-6">
        À Propos de Tahwisa 213
      </h2>
      <div className="max-w-3xl mx-auto text-center text-gray-300 text-lg space-y-4 leading-relaxed">
        <p>
          Votre agence de confiance à Alger, vous accompagne dans l’organisation de vos voyages, séjours, randonnées et bivouacs. Nous mettons notre professionnalisme à votre service pour une expérience fluide et sereine.
        </p>
        <p>
          Bénéficiez d’un accompagnement sur mesure, adapté à vos besoins.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;