'use client';

interface ThreeColumnFooterProps {
  businessName?: string;
  description?: string;
  phone?: string;
  email?: string;
  primaryColor?: string;
}

export default function ThreeColumnFooter(props: ThreeColumnFooterProps) {
  const businessName = props.businessName || "Your Business";
  const description = props.description || "Premium services for your needs";
  const phone = props.phone || "+1 (555) 123-4567";
  const email = props.email || "info@yourbusiness.com";
  const primaryColor = props.primaryColor || "#9333ea";

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Column 1 - About */}
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>
              {businessName}
            </h3>
            <p className="text-gray-400 mb-6">
              {description}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                📘
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                📷
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                🐦
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#home" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Testimonials</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Column 3 - Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6">Get In Touch</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <span className="text-xl">📞</span>
                <div>
                  <p className="text-white font-medium mb-1">Phone</p>
                  <p 
                    data-editable-footer-phone
                    dangerouslySetInnerHTML={{ __html: phone }}
                  />
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">📧</span>
                <div>
                  <p className="text-white font-medium mb-1">Email</p>
                  <p 
                    data-editable-footer-email
                    dangerouslySetInnerHTML={{ __html: email }}
                  />
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © 2024 {businessName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}