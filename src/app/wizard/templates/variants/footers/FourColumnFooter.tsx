'use client';

interface FourColumnFooterProps {
  businessName?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  primaryColor?: string;
}

export default function FourColumnFooter(props: FourColumnFooterProps) {
  const businessName = props.businessName || "Your Business";
  const description = props.description || "Premium services for your needs";
  const phone = props.phone || "+1 (555) 123-4567";
  const email = props.email || "info@yourbusiness.com";
  const address = props.address || "123 Main St, City, State 12345";
  const primaryColor = props.primaryColor || "#9333ea";

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Column 1 - About */}
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>
              {businessName}
            </h3>
            <p className="text-gray-400 text-sm">
              {description}
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#home" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Column 3 - Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#service1" className="text-gray-400 hover:text-white transition-colors">Service One</a></li>
              <li><a href="#service2" className="text-gray-400 hover:text-white transition-colors">Service Two</a></li>
              <li><a href="#service3" className="text-gray-400 hover:text-white transition-colors">Service Three</a></li>
              <li><a href="#service4" className="text-gray-400 hover:text-white transition-colors">Service Four</a></li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start">
                <span className="mr-2">📞</span>
                <span 
                  data-editable-footer-phone
                  dangerouslySetInnerHTML={{ __html: phone }}
                />
              </li>
              <li className="flex items-start">
                <span className="mr-2">📧</span>
                <span 
                  data-editable-footer-email
                  dangerouslySetInnerHTML={{ __html: email }}
                />
              </li>
              <li className="flex items-start">
                <span className="mr-2">📍</span>
                <span>{address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2024 {businessName}. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}