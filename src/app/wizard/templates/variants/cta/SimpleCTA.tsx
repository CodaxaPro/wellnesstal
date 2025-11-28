'use client';

interface SimpleCTAProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  primaryColor?: string;
}

export default function SimpleCTA(props: SimpleCTAProps) {
  const title = props.title || "Ready to Get Started?";
  const subtitle = props.subtitle || "Join thousands of satisfied customers today";
  const ctaText = props.ctaText || "Book Appointment";
  const primaryColor = props.primaryColor || "#9333ea";

  return (
    <section className="py-20" style={{ backgroundColor: `${primaryColor}11` }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          data-editable-cta-title
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <p 
          className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
          data-editable-cta-subtitle
          dangerouslySetInnerHTML={{ __html: subtitle }}
        />
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            className="px-12 py-5 rounded-lg font-bold text-lg text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            style={{ backgroundColor: primaryColor }}
            data-editable-cta-button
            dangerouslySetInnerHTML={{ __html: ctaText }}
          />
          
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-2xl">✓</span>
            <span>No credit card required</span>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔒</span>
            <span>Secure & Safe</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span>Instant Confirmation</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">💯</span>
            <span>Money Back Guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
}