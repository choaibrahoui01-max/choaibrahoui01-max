import React from 'react';
import { MountainIcon, InstagramIcon, FacebookIcon } from './IconComponents';

const Header: React.FC = () => {
  const navLinkClasses = "text-gray-200 hover:text-orange-500 transition-colors duration-200 cursor-pointer";

  return (
    <header className="bg-black border-b border-orange-500/20 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#/" className="flex items-center focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg">
            <MountainIcon className="h-8 w-8 text-orange-500" />
            <span className="ml-2 text-2xl font-bold text-white">Tahwisa 213</span>
          </a>
          <div className="flex items-center space-x-6">
            <a href="#/" className={navLinkClasses}>Accueil</a>
            <a href="#/next-weekend" className={navLinkClasses}>Weekend Prochain</a>
            <div className="flex items-center space-x-4">
              <a href="https://www.instagram.com/tahwisa213/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors">
                <InstagramIcon className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </a>
               <a href="https://www.facebook.com/profile.php?id=100064851663149" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors">
                <FacebookIcon className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
