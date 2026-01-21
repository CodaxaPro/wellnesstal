'use client';

interface ClassicHeaderProps {
  businessName?: string;
  menuItems?: string[];
  ctaText?: string;
  primaryColor?: string;
}

export default function ClassicHeader(props: ClassicHeaderProps) {
  const businessName = props.businessName || "Your Business";
  // const menuItems = props.menuItems || ["Home", "Services", "About", "Contact"];
  const ctaText = props.ctaText || "Book Now";
  const primaryColor = props.primaryColor || "#9333ea";

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div
              className="text-2xl font-bold"
              style={{ color: primaryColor }}
              data-editable-header-business
              dangerouslySetInnerHTML={{ __html: businessName }}
            />
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-gray-900 font-medium">Home</a>
            <a href="#services" className="text-gray-700 hover:text-gray-900 font-medium">Services</a>
            <a href="#about" className="text-gray-700 hover:text-gray-900 font-medium">About</a>
            <a href="#contact" className="text-gray-700 hover:text-gray-900 font-medium">Contact</a>
          </nav>

          <div className="flex items-center">
            <button
              className="px-6 py-2 rounded-lg font-semibold text-white"
              style={{ backgroundColor: primaryColor }}
              data-editable-header-cta
              dangerouslySetInnerHTML={{ __html: ctaText }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
