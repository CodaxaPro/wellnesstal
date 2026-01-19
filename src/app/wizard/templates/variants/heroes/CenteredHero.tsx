'use client';

interface CenteredHeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  secondaryCtaText?: string;
  primaryColor?: string;
}

export default function CenteredHero(props: CenteredHeroProps) {
  const title = props.title || "Welcome to Your Business";
  const subtitle = props.subtitle || "Premium services designed for you";
  const ctaText = props.ctaText || "Get Started";
  const secondaryCtaText = props.secondaryCtaText || "Learn More";
  const primaryColor = props.primaryColor || "#9333ea";

  return (
    <section className="relative py-32 bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 
          className="text-6xl md:text-7xl font-bold mb-6 leading-tight"
          data-editable-hero-title
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <p 
          className="text-2xl text-gray-200 mb-10 max-w-3xl mx-auto"
          data-editable-hero-subtitle
          dangerouslySetInnerHTML={{ __html: subtitle }}
        />
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            className="px-10 py-5 rounded-lg font-bold text-lg shadow-2xl hover:shadow-3xl transition-all hover:scale-105"
            style={{ backgroundColor: primaryColor }}
            data-editable-hero-cta
            dangerouslySetInnerHTML={{ __html: ctaText }}
          />
          <button className="px-10 py-5 rounded-lg font-bold text-lg bg-white text-gray-900 hover:bg-gray-100 transition-all hover:scale-105 shadow-xl">
            {secondaryCtaText}
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 flex justify-center items-center gap-8 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span>5.0 Rating</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">👥</span>
            <span>1000+ Clients</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span>Verified</span>
          </div>
        </div>
      </div>
    </section>
  );
}