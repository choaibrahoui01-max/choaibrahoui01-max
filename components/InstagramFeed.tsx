import React from 'react';
import { InstagramIcon, FacebookIcon } from './IconComponents';

const testimonials = [
  {
    platform: 'Instagram',
    author: 'Aventurier_H',
    comment: "Une expérience inoubliable ! L'ascension de Lella Khedidja était difficile mais la vue en valait la peine. Organisation au top !",
    icon: (props: any) => <InstagramIcon {...props} />,
    color: 'text-orange-500',
  },
  {
    platform: 'Facebook',
    author: 'Mohammed Mohammed',
    comment: "Vraiment cest un magnifique",
    icon: (props: any) => <FacebookIcon {...props} />,
    color: 'text-orange-500',
  },
  {
    platform: 'Instagram',
    author: 'Voyageuse_DZ',
    comment: "La randonnée vers le Pic des Cèdres était incroyable. Des vues à couper le souffle et une organisation parfaite. Je referai une sortie avec Tahwisa 213 sans hésiter.",
    icon: (props: any) => <InstagramIcon {...props} />,
    color: 'text-orange-500',
  },
  {
      platform: 'Instagram',
      author: 'lara8294',
      comment: "Des bon moments avec tahwisa et sans oublié cenagal😂",
      icon: (props: any) => <InstagramIcon {...props} />,
      color: 'text-orange-500',
  }
];

const SocialFeed: React.FC = () => {
    const socialLinks = {
        instagram: "https://www.instagram.com/tahwisa213/",
        facebook: "https://www.facebook.com/profile.php?id=100064851663149",
    };

    return (
        <div className="bg-black rounded-lg p-8 sm:p-12 my-16">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-extrabold text-orange-500">
                    Rejoignez Notre Communauté
                </h2>
                <p className="mt-2 text-lg text-gray-300">
                    Suivez nos aventures et découvrez ce que les autres disent de leurs expériences !
                </p>
                <div className="flex justify-center items-center space-x-6 mt-4 mb-8">
                    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors"><InstagramIcon className="h-8 w-8" /></a>
                    <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors"><FacebookIcon className="h-8 w-8" /></a>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-black border border-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-start">
                                <div className={`mr-4 ${testimonial.color}`}>
                                    <testimonial.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-100">{testimonial.author}</p>
                                    <p className="text-gray-300 mt-2">"{testimonial.comment}"</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SocialFeed;