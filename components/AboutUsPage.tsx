import React from 'react';
import { MountainIcon } from './IconComponents';

const AboutUsPage: React.FC = () => {
  return (
    <div className="bg-black rounded-lg shadow-xl p-8 sm:p-12 animate-fadeIn">
        <div className="text-center mb-8">
            <MountainIcon className="h-16 w-16 text-orange-500 mx-auto" />
            <h1 className="text-4xl font-extrabold text-white mt-4">À Propos de Tahwisa 213</h1>
            <p className="mt-2 text-lg text-gray-400">Votre Guide pour les Aventures Algériennes</p>
        </div>
      <div className="max-w-3xl mx-auto text-gray-300 text-lg space-y-6 leading-relaxed text-justify">
        <p>
          Votre agence de confiance à Alger, vous accompagne dans l’organisation de vos voyages, séjours, randonnées et bivouacs. Nous mettons notre professionnalisme à votre service pour une expérience fluide et sereine.
        </p>
        <p>
          Bénéficiez d’un accompagnement sur mesure, adapté à vos besoins.
        </p>
        <p>
          Chez Tahwisa 213, nous croyons que l'aventure est plus qu'un simple voyage ; c'est une façon de se connecter avec la nature, de se dépasser et de créer des souvenirs impérissables. Notre équipe de guides expérimentés est passionnée par le partage des joyaux cachés de l'Algérie, des sommets majestueux du Djurdjura aux oasis sereines du Sahara.
        </p>
        <p>
          Nous nous engageons pour un tourisme responsable, en veillant à ce que nos aventures respectent l'environnement et les communautés locales. La sécurité est notre priorité absolue, et nous fournissons tout l'équipement et le soutien nécessaires pour vous assurer une expérience sûre et agréable. Rejoignez-nous et découvrez l'aventure qui vous attend.
        </p>
      </div>
    </div>
  );
};

export default AboutUsPage;