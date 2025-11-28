-- Wellnesstal Content Seed Data
-- Run this AFTER 002_seed_data.sql

-- =====================================================
-- SEED: Content Sections
-- =====================================================

-- Hero Section
INSERT INTO content (section, title, description, content, defaults, updated_by)
VALUES (
  'hero',
  'Ana Sayfa Hero Bölümü',
  'Ana sayfa üst bölümünün içeriği',
  '{
    "mainTitle": "Wellness & Entspannung in Baesweiler",
    "subtitle": "Entdecken Sie professionelle Headspa-Behandlungen und Wellness-Therapien für Ihr körperliches und seelisches Wohlbefinden.",
    "primaryButton": "Jetzt anrufen",
    "primaryButtonLink": "tel:+491733828581",
    "secondaryButton": "Leistungen entdecken",
    "secondaryButtonLink": "#services",
    "trustIndicator": "500+ zufriedene Kunden",
    "badge": "🌿 Willkommen in Baesweiler",
    "image": {
      "url": "/uploads/hero/1764360287833-d9vohe.jpeg",
      "alt": "Entspannende Spa-Behandlung bei Wellnesstal"
    }
  }'::jsonb,
  '{
    "mainTitle": "Wellness & Entspannung in Baesweiler",
    "subtitle": "Entdecken Sie professionelle Headspa-Behandlungen und Wellness-Therapien.",
    "primaryButton": "Jetzt anrufen",
    "secondaryButton": "Leistungen entdecken"
  }'::jsonb,
  'Admin'
) ON CONFLICT (section) DO UPDATE SET content = EXCLUDED.content;

-- About Section
INSERT INTO content (section, title, description, content, defaults, updated_by)
VALUES (
  'about',
  'Über Uns Bölümü',
  'Hakkımızda bölümü içeriği',
  '{
    "badge": "Über Wellnesstal Studio",
    "title": "Ihre Wellness-Oase im Herzen von Baesweiler",
    "description": "Seit über 5 Jahren widmen wir uns mit Leidenschaft Ihrem Wohlbefinden. Unser erfahrenes Team aus zertifizierten Wellness-Therapeuten bietet Ihnen individuelle Behandlungen in entspannter Atmosphäre.",
    "stats": [
      {"label": "Zufriedene Kunden", "value": "500+"},
      {"label": "Jahre Erfahrung", "value": "5+"}
    ],
    "primaryButton": "Persönliche Beratung",
    "primaryButtonLink": "tel:+491733828581",
    "secondaryButton": "Mehr erfahren",
    "secondaryButtonLink": "#contact"
  }'::jsonb,
  '{}'::jsonb,
  'Admin'
) ON CONFLICT (section) DO UPDATE SET content = EXCLUDED.content;

-- Contact Section
INSERT INTO content (section, title, description, content, defaults, updated_by)
VALUES (
  'contact',
  'İletişim Bilgileri',
  'İletişim sayfası içeriği',
  '{
    "businessName": "Wellnesstal",
    "phone": "+49 1733828581",
    "email": "info@wellnesstal.de",
    "address": {
      "street": "Reyplatz 10",
      "city": "Baesweiler",
      "postalCode": "52499",
      "country": "Almanya"
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
  }'::jsonb,
  '{}'::jsonb,
  'Admin'
) ON CONFLICT (section) DO UPDATE SET content = EXCLUDED.content;

-- Footer Section
INSERT INTO content (section, title, description, content, defaults, updated_by)
VALUES (
  'footer',
  'Footer Bölümü',
  'Alt bilgi bölümü içeriği',
  '{
    "description": "Ihre Oase der Entspannung im Herzen von Baesweiler. Professionelle Wellness-Behandlungen für Körper und Seele.",
    "socialMedia": {
      "instagram": "https://instagram.com/wellnesstal",
      "facebook": "https://facebook.com/wellnesstal",
      "whatsapp": "https://wa.me/491733828581"
    },
    "copyright": "© 2025 Wellnesstal. Alle Rechte vorbehalten."
  }'::jsonb,
  '{}'::jsonb,
  'Admin'
) ON CONFLICT (section) DO UPDATE SET content = EXCLUDED.content;

-- Meta/SEO Section
INSERT INTO content (section, title, description, content, defaults, updated_by)
VALUES (
  'meta',
  'SEO & Meta Bilgileri',
  'Site geneli SEO ayarları',
  '{
    "siteTitle": "Wellnesstal - Premium Wellness & Headspa in Baesweiler",
    "siteDescription": "Entspannung und Wellness in Köln. Professionelle Headspa-Behandlungen für Ihr Wohlbefinden. Jetzt Termin vereinbaren!",
    "keywords": "wellness, headspa, massage, köln, entspannung, aromatherapie, spa",
    "ogImage": "/images/og-wellnesstal.jpg"
  }'::jsonb,
  '{}'::jsonb,
  'Admin'
) ON CONFLICT (section) DO UPDATE SET content = EXCLUDED.content;

-- Contact Settings Section
INSERT INTO content (section, title, description, content, defaults, updated_by)
VALUES (
  'contact-settings',
  'Kontakt Einstellungen',
  'Tüm iletişim ve işletme ayarları',
  '{
    "businessInfo": {
      "name": "Wellnesstal",
      "tagline": "Premium Wellness & Headspa in Baesweiler",
      "description": "Ihre Oase der Entspannung im Herzen von Baesweiler."
    },
    "contact": {
      "phone": "+49 1733828581",
      "email": "info@wellnesstal.de",
      "whatsapp": "+49 1733828581"
    },
    "address": {
      "street": "Reyplatz 10",
      "city": "Baesweiler",
      "postalCode": "52499",
      "country": "Almanya",
      "googleMapsUrl": "https://www.google.com/maps/place/Reypl.,+52499+Baesweiler"
    }
  }'::jsonb,
  '{}'::jsonb,
  'Admin'
) ON CONFLICT (section) DO UPDATE SET content = EXCLUDED.content;

-- WhatsApp Settings
INSERT INTO content (section, title, description, content, defaults, updated_by)
VALUES (
  'whatsapp-settings',
  'WhatsApp Button Einstellungen',
  'WhatsApp butonu için enterprise ayarları',
  '{
    "basic": {
      "enabled": true,
      "phoneNumber": "+49 1733828581",
      "position": "bottom-right"
    },
    "appearance": {
      "buttonColor": "#9CAF88",
      "iconColor": "#FFFFFF",
      "size": "large",
      "shadow": true,
      "pulseAnimation": true
    },
    "message": {
      "defaultMessage": "Hallo, ich interessiere mich für eine Wellness-Behandlung bei Wellnesstal.",
      "tooltipText": "WhatsApp Nachricht senden"
    }
  }'::jsonb,
  '{}'::jsonb,
  'Admin'
) ON CONFLICT (section) DO UPDATE SET content = EXCLUDED.content;

-- Landing Hero Section
INSERT INTO content (section, title, description, content, defaults, updated_by)
VALUES (
  'landing-hero',
  'Landing Hero Bölümü',
  'Ana sayfanın en üst hero bölümü',
  '{
    "badge": "Wellnesstal Studio",
    "mainTitle": "Ihre Wellness-Oase für",
    "highlightedText": "Körper & Seele",
    "description": "Entdecken Sie unsere exklusiven Wellness-Behandlungen und finden Sie Ihre innere Balance in entspannter Atmosphäre.",
    "primaryButton": "Services entdecken",
    "primaryButtonLink": "#services",
    "secondaryButton": "Termin buchen",
    "secondaryButtonLink": "#contact"
  }'::jsonb,
  '{}'::jsonb,
  'Admin'
) ON CONFLICT (section) DO UPDATE SET content = EXCLUDED.content;

-- Contact Section (Homepage)
INSERT INTO content (section, title, description, content, defaults, updated_by)
VALUES (
  'contact-section',
  'Kontakt Bölümü (Ana Sayfa)',
  'Ana sayfadaki iletişim bölümü görsel stilleri',
  '{
    "badge": "📞 Kontakt",
    "sectionTitle": "Bereit für Ihre",
    "highlightedText": "Auszeit",
    "description": "Vereinbaren Sie noch heute Ihren Termin oder lassen Sie sich unverbindlich beraten."
  }'::jsonb,
  '{}'::jsonb,
  'Admin'
) ON CONFLICT (section) DO UPDATE SET content = EXCLUDED.content;

-- Services Section
INSERT INTO content (section, title, description, content, defaults, updated_by)
VALUES (
  'services-section',
  'Leistungen Bölümü',
  'Leistungen bölümünün başlık ve açıklama metinleri',
  '{
    "badge": "✨ Unsere Expertise",
    "sectionTitle": "Professionelle",
    "highlightedText": "Wellness-Behandlungen",
    "description": "Entdecken Sie unser vielfältiges Angebot an entspannenden und regenerierenden Behandlungen."
  }'::jsonb,
  '{}'::jsonb,
  'Admin'
) ON CONFLICT (section) DO UPDATE SET content = EXCLUDED.content;

-- Testimonials Section
INSERT INTO content (section, title, description, content, defaults, updated_by)
VALUES (
  'testimonials-section',
  'Kundenstimmen Bölümü',
  'Müşteri yorumları bölümü başlık ve stil ayarları',
  '{
    "badge": "💬 Kundenstimmen",
    "sectionTitle": "Was unsere Kunden",
    "highlightedText": "sagen",
    "description": "Echte Bewertungen von zufriedenen Kunden - Ihre Meinung ist uns wichtig"
  }'::jsonb,
  '{}'::jsonb,
  'Admin'
) ON CONFLICT (section) DO UPDATE SET content = EXCLUDED.content;
