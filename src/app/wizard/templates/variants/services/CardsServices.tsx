'use client';

interface CardsServicesProps {
  title?: string;
  subtitle?: string;
  primaryColor?: string;
}

const defaultServices = [
  {
    title: 'Basic Package',
    price: '$99',
    duration: '60 min',
    features: ['Feature One', 'Feature Two', 'Feature Three'],
    popular: false
  },
  {
    title: 'Premium Package',
    price: '$199',
    duration: '90 min',
    features: ['All Basic Features', 'Feature Four', 'Feature Five', 'Feature Six'],
    popular: true
  },
  {
    title: 'VIP Package',
    price: '$299',
    duration: '120 min',
    features: ['All Premium Features', 'Feature Seven', 'Feature Eight', 'Priority Booking'],
    popular: false
  },
];

export default function CardsServices(props: CardsServicesProps) {
  const title = props.title || "Our Services";
  const subtitle = props.subtitle || "Choose the perfect package for you";
  const primaryColor = props.primaryColor || "#9333ea";

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl font-bold text-gray-900 mb-4"
            data-editable-services-title
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            data-editable-services-subtitle
            dangerouslySetInnerHTML={{ __html: subtitle }}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {defaultServices.map((service, index) => (
            <div 
              key={index}
              className={`
                bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all
                ${service.popular ? 'ring-4 scale-105' : ''}
              `}
              style={service.popular ? { 
                borderColor: primaryColor,
                boxShadow: `0 0 0 4px ${primaryColor}33`
              } : {}}
            >
              {service.popular && (
                <div 
                  className="text-white text-sm font-bold px-4 py-1 rounded-full inline-block mb-4"
                  style={{ backgroundColor: primaryColor }}
                >
                  MOST POPULAR
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {service.title}
              </h3>
              
              <div className="mb-6">
                <span className="text-5xl font-bold" style={{ color: primaryColor }}>
                  {service.price}
                </span>
                <span className="text-gray-500 ml-2">/ {service.duration}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-600">
                    <span className="mr-2" style={{ color: primaryColor }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className="w-full py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                style={{ 
                  backgroundColor: service.popular ? primaryColor : 'transparent',
                  color: service.popular ? 'white' : primaryColor,
                  border: service.popular ? 'none' : `2px solid ${primaryColor}`
                }}
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}