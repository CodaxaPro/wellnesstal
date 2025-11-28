'use client';

interface FullBGHeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  backgroundImage?: string;
  primaryColor?: string;
}

export default function FullBGHero(props: FullBGHeroProps) {
  const title = props.title || "Welcome to Your Business";
  const subtitle = props.subtitle || "Premium services designed for you";
  const ctaText = props.ctaText || "Get Started";
  const backgroundImage = props.backgroundImage || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1920";
  const primaryColor = props.primaryColor || "#9333ea";

  return (
    <section 
      className="relative py-40 bg-cover bg-center"
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h1 
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-2xl"
          data-editable-hero-title
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <p 
          className="text-xl md:text-2xl mb-10 text-gray-200 max-w-3xl mx-auto drop-shadow-lg"
          data-editable-hero-subtitle
          dangerouslySetInnerHTML={{ __html: subtitle }}
        />
        
        <button
          className="px-12 py-5 rounded-lg font-bold text-lg shadow-2xl hover:shadow-3xl transition-all hover:scale-105"
          style={{ backgroundColor: primaryColor }}
          data-editable-hero-cta
          dangerouslySetInnerHTML={{ __html: ctaText }}
        />

        {/* Scroll indicator */}
        <div className="mt-16 animate-bounce">
          <svg className="w-6 h-6 mx-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}