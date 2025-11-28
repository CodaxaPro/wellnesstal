'use client';

interface ModernHeaderProps {
  businessName?: string;
  menuItems?: string[];
  ctaText?: string;
  primaryColor?: string;
}

export default function ModernHeader(props: ModernHeaderProps) {
  const businessName = props.businessName || "Your Business";
  const menuItems = props.menuItems || ["Home", "Services", "About", "Contact"];
  const ctaText = props.ctaText || "Book Now";
  const primaryColor = props.primaryColor || "#9333ea";

  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <div 
              className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
              data-editable-header-business
              dangerouslySetInnerHTML={{ __html: businessName }}
            />
          </div>

          <nav className="hidden md:flex items-center space-x-10">
            <a href="#home" className="text-gray-300 hover:text-white font-medium transition-all hover:scale-110">
              Home
            </a>
            <a href="#services" className="text-gray-300 hover:text-white font-medium transition-all hover:scale-110">
              Services
            </a>
            <a href="#about" className="text-gray-300 hover:text-white font-medium transition-all hover:scale-110">
              About
            </a>
            <a href="#contact" className="text-gray-300 hover:text-white font-medium transition-all hover:scale-110">
              Contact
            </a>
          </nav>

          <div className="flex items-center">
            <button
              className="px-8 py-3 rounded-full font-bold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
              style={{ 
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`
              }}
              data-editable-header-cta
              dangerouslySetInnerHTML={{ __html: ctaText }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}