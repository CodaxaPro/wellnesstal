'use client';

interface Grid3FeaturesProps {
  title?: string;
  subtitle?: string;
  primaryColor?: string;
}

const defaultFeatures = [
  {
    icon: '⚡',
    title: 'Fast & Efficient',
    description: 'Quick service delivery with professional quality'
  },
  {
    icon: '🎯',
    title: 'Expert Team',
    description: 'Experienced professionals at your service'
  },
  {
    icon: '💎',
    title: 'Premium Quality',
    description: 'Top-tier materials and execution'
  },
];

export default function Grid3Features(props: Grid3FeaturesProps) {
  const title = props.title || "Why Choose Us";
  const subtitle = props.subtitle || "Discover what makes us different";
  const primaryColor = props.primaryColor || "#9333ea";

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl font-bold text-gray-900 mb-4"
            data-editable-features-title
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            data-editable-features-subtitle
            dangerouslySetInnerHTML={{ __html: subtitle }}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {defaultFeatures.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-all hover:-translate-y-2"
            >
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl mb-6 shadow-lg"
                style={{ backgroundColor: `${primaryColor}22`, color: primaryColor }}
              >
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}