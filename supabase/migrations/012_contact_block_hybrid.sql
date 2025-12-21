-- =============================================
-- CONTACT BLOCK TYPE UPDATE
-- Add useGlobalContact for hybrid approach
-- =============================================

UPDATE block_types
SET default_content = '{
  "useGlobalContact": true,
  "brandName": "Wellnesstal Studio",
  "badge": "📞 Kontakt",
  "sectionTitle": "Bereit für Ihre",
  "highlightedText": "Auszeit",
  "description": "Vereinbaren Sie noch heute Ihren Termin oder lassen Sie sich unverbindlich beraten.",
  "cards": {
    "phone": { "title": "Telefonisch", "description": "Rufen Sie uns direkt an für eine schnelle Terminbuchung" },
    "whatsapp": { "title": "WhatsApp", "description": "Schreiben Sie uns eine Nachricht - wir antworten schnell", "linkText": "Nachricht senden" },
    "email": { "title": "E-Mail", "description": "Senden Sie uns Ihre Anfrage per E-Mail" }
  },
  "map": { "buttonText": "In Google Maps öffnen" },
  "openingHoursLabels": { "title": "Öffnungszeiten", "todayLabel": "Heute", "closedLabel": "Geschlossen" },
  "contact": {
    "businessName": "Wellnesstal",
    "phone": "+49 221 12345678",
    "email": "info@wellnesstal.de",
    "address": { "street": "Musterstraße 123", "city": "Köln", "postalCode": "50667", "country": "Deutschland" },
    "openingHours": {
      "monday": { "open": "09:00", "close": "19:00", "closed": false },
      "tuesday": { "open": "09:00", "close": "19:00", "closed": false },
      "wednesday": { "open": "09:00", "close": "19:00", "closed": false },
      "thursday": { "open": "09:00", "close": "19:00", "closed": false },
      "friday": { "open": "09:00", "close": "19:00", "closed": false },
      "saturday": { "open": "10:00", "close": "16:00", "closed": false },
      "sunday": { "open": "", "close": "", "closed": true }
    }
  },
  "googleMapsUrl": ""
}'::jsonb,
description = 'Kontakt bölümü - telefon, WhatsApp, email, harita ve çalışma saatleri'
WHERE id = 'contact';
