-- Header Content Section
-- Adds header configuration to content management

INSERT INTO content (section, title, description, content, defaults, updated_by)
VALUES (
  'header',
  'Header Bölümü',
  'Üst menü ve navigasyon ayarları',
  '{
    "logoText": "Wellnesstal",
    "logoEmoji": "🌿",
    "navItems": [
      {"href": "#home", "label": "Start"},
      {"href": "#services", "label": "Leistungen"},
      {"href": "#about", "label": "Über uns"},
      {"href": "#contact", "label": "Kontakt"}
    ],
    "ctaButtonText": "Termin vereinbaren",
    "ctaButtonType": "phone",
    "ctaButtonLink": "+49 1733828581",
    "ctaButtonVisible": true
  }'::jsonb,
  '{
    "logoText": "Wellnesstal",
    "logoEmoji": "🌿",
    "navItems": [
      {"href": "#home", "label": "Start"},
      {"href": "#services", "label": "Leistungen"},
      {"href": "#about", "label": "Über uns"},
      {"href": "#contact", "label": "Kontakt"}
    ],
    "ctaButtonText": "Termin vereinbaren",
    "ctaButtonType": "phone",
    "ctaButtonLink": "+49 1733828581",
    "ctaButtonVisible": true
  }'::jsonb,
  'Admin'
) ON CONFLICT (section) DO UPDATE SET
  content = EXCLUDED.content,
  defaults = EXCLUDED.defaults;
