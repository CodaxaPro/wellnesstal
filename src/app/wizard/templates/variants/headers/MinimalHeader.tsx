'use client';

interface MinimalHeaderProps {
  businessName?: string;
  menuItems?: string[];
  primaryColor?: string;
}

export default function MinimalHeader(props: MinimalHeaderProps) {
  const businessName = props.businessName || "Your Business";
  // const menuItems = props.menuItems || ["Home", "Services", "About", "Contact"];
  const primaryColor = props.primaryColor || "#9333ea";

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div
            className="text-lg font-semibold text-gray-900"
            data-editable-header-business
            dangerouslySetInnerHTML={{ __html: businessName }}
          />

          <nav className="hidden md:flex items-center space-x-6">
            <a href="#home" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </a>
            <a href="#services" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Services
            </a>
            <a href="#about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              About
            </a>
            <a
              href="#contact"
              className="text-sm font-medium px-4 py-2 rounded transition-colors"
              style={{ color: primaryColor }}
            >
              Contact
            </a>
          </nav>

          <button className="md:hidden text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
