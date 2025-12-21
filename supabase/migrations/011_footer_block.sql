-- =============================================
-- FOOTER BLOCK TYPE
-- Enterprise footer block - exact copy of homepage footer
-- =============================================

INSERT INTO block_types (id, name, description, icon, category, default_content, sort_order) VALUES
('footer', 'Footer', 'Sayfa altligi blogu - marka, sosyal medya, newsletter, linkler ve iletisim bilgileri', 'rectangle-group', 'layout',
  '{
    "useGlobalFooter": true,
    "brandName": "Wellnesstal",
    "brandEmoji": "🌿",
    "description": "Ihre Oase der Entspannung im Herzen von Köln. Professionelle Wellness-Behandlungen für Körper und Seele.",
    "socialMedia": {
      "instagram": "https://instagram.com/wellnesstal",
      "facebook": "https://facebook.com/wellnesstal",
      "whatsapp": "https://wa.me/4922112345678"
    },
    "newsletter": {
      "enabled": true,
      "title": "Newsletter abonnieren",
      "subtitle": "Bleiben Sie auf dem Laufenden über neue Behandlungen, Angebote und Wellness-Tipps.",
      "placeholder": "Ihre E-Mail-Adresse",
      "buttonText": "Anmelden",
      "disclaimer": "Kein Spam. Jederzeit abmeldbar."
    },
    "quickLinks": [
      {"label": "Start", "href": "#home"},
      {"label": "Leistungen", "href": "#services"},
      {"label": "Über uns", "href": "#about"},
      {"label": "Kontakt", "href": "#contact"}
    ],
    "legalLinks": [
      {"label": "Impressum", "href": "/impressum"},
      {"label": "Datenschutz", "href": "/datenschutz"},
      {"label": "AGB", "href": "/agb"},
      {"label": "Widerrufsrecht", "href": "/widerruf"}
    ],
    "services": [
      {"label": "Premium Headspa", "href": "/services/headspa"},
      {"label": "Aromatherapie", "href": "/services/aromatherapie"},
      {"label": "Wellness Massage", "href": "/services/massage"},
      {"label": "Gesichtspflege", "href": "/services/gesichtspflege"}
    ],
    "copyright": "© 2024 Wellnesstal. Alle Rechte vorbehalten.",
    "styles": {
      "brandName": {
        "fontFamily": "system-ui",
        "fontSize": "30px",
        "fontWeight": "700",
        "color": "#9CAF88"
      },
      "description": {
        "fontFamily": "system-ui",
        "fontSize": "16px",
        "fontWeight": "400",
        "color": "#D1D5DB"
      },
      "sectionTitle": {
        "fontFamily": "system-ui",
        "fontSize": "18px",
        "fontWeight": "600",
        "color": "#9CAF88"
      },
      "link": {
        "fontFamily": "system-ui",
        "fontSize": "16px",
        "fontWeight": "400",
        "color": "#D1D5DB"
      },
      "newsletterTitle": {
        "fontFamily": "system-ui",
        "fontSize": "20px",
        "fontWeight": "600",
        "color": "#FFFFFF"
      },
      "copyright": {
        "fontFamily": "system-ui",
        "fontSize": "14px",
        "fontWeight": "400",
        "color": "#9CA3AF"
      }
    },
    "contact": {
      "businessName": "Wellnesstal",
      "phone": "+49 221 12345678",
      "email": "info@wellnesstal.de",
      "address": {
        "street": "Musterstraße 123",
        "city": "Köln",
        "postalCode": "50667",
        "country": "Deutschland"
      },
      "openingHours": {
        "monday": {"open": "09:00", "close": "19:00", "closed": false},
        "tuesday": {"open": "09:00", "close": "19:00", "closed": false},
        "wednesday": {"open": "09:00", "close": "19:00", "closed": false},
        "thursday": {"open": "09:00", "close": "19:00", "closed": false},
        "friday": {"open": "09:00", "close": "19:00", "closed": false},
        "saturday": {"open": "10:00", "close": "16:00", "closed": false},
        "sunday": {"open": "", "close": "", "closed": true}
      }
    }
  }', 19)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  default_content = EXCLUDED.default_content,
  sort_order = EXCLUDED.sort_order;
