-- =============================================
-- ENTERPRISE BLOCK TYPES
-- WhatsApp, Gallery (enhanced), Footer
-- =============================================

-- WhatsApp Block
INSERT INTO block_types (id, name, description, icon, category, default_content, sort_order) VALUES
('whatsapp', 'WhatsApp', 'WhatsApp floating button with customization', 'chat-bubble', 'social',
  '{
    "basic": {
      "enabled": true,
      "phoneNumber": "",
      "useOriginalStyle": true,
      "position": "bottom-right"
    },
    "appearance": {
      "buttonColor": "#25D366",
      "buttonHoverColor": "#128C7E",
      "iconColor": "#ffffff",
      "size": "medium",
      "shadow": true,
      "pulseAnimation": true,
      "borderRadius": "full"
    },
    "message": {
      "defaultMessage": "Merhaba, bilgi almak istiyorum.",
      "tooltipText": "Bize yazin!",
      "tooltipDelay": 3,
      "showTooltipOnLoad": true,
      "autoShowTooltipAfter": 5
    },
    "display": {
      "showOnMobile": true,
      "showOnDesktop": true,
      "showOnAllPages": true,
      "excludedPages": [],
      "showAfterDelay": 0,
      "showAfterScroll": 0
    },
    "availability": {
      "mode": "always-online",
      "manualStatus": true,
      "showIndicator": true,
      "onlineColor": "#22c55e",
      "offlineColor": "#94a3b8",
      "offlineMessage": ""
    },
    "ctaBubble": {
      "enabled": false,
      "title": "",
      "message": "",
      "backgroundColor": "#ffffff",
      "textColor": "#1f2937",
      "titleColor": "#25D366",
      "showAfterDelay": 10,
      "dismissable": true
    }
  }', 15)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  default_content = EXCLUDED.default_content;

-- Footer Block
INSERT INTO block_types (id, name, description, icon, category, default_content, sort_order) VALUES
('footer', 'Footer', 'Kapsamli site alt bilgisi - linkler, sosyal medya, iletisim, bulten', 'layout', 'layout',
  '{
    "layout": "four-column",
    "brand": {
      "logo": "",
      "logoHeight": 40,
      "name": "Wellnesstal",
      "brandName": "Wellnesstal",
      "emoji": "🌿",
      "brandEmoji": "🌿",
      "showLogo": false,
      "showEmoji": true,
      "description": "Profesyonel wellness ve masaj hizmetleri."
    },
    "linkColumns": [],
    "socialLinks": [],
    "socialStyle": "icons",
    "socialPosition": "brand-section",
    "contact": {
      "businessName": "",
      "phone": "",
      "email": "",
      "address": {"street": "", "city": "", "postalCode": "", "country": ""}
    },
    "showContact": true,
    "openingHours": {
      "enabled": false,
      "title": "Calisma Saatleri",
      "schedule": {
        "monday": {"open": "09:00", "close": "18:00", "closed": false},
        "tuesday": {"open": "09:00", "close": "18:00", "closed": false},
        "wednesday": {"open": "09:00", "close": "18:00", "closed": false},
        "thursday": {"open": "09:00", "close": "18:00", "closed": false},
        "friday": {"open": "09:00", "close": "18:00", "closed": false},
        "saturday": {"open": "10:00", "close": "16:00", "closed": false},
        "sunday": {"open": "", "close": "", "closed": true}
      }
    },
    "newsletter": {
      "enabled": false,
      "title": "",
      "subtitle": "",
      "description": "",
      "placeholder": "E-posta adresiniz",
      "buttonText": "Abone Ol",
      "disclaimer": "",
      "successMessage": "",
      "errorMessage": "",
      "showPrivacyConsent": false,
      "privacyConsentText": ""
    },
    "style": {
      "backgroundColor": "#1F2937",
      "textColor": "#D1D5DB",
      "headingColor": "#9CAF88",
      "linkColor": "#D1D5DB",
      "linkHoverColor": "#9CAF88",
      "hoverColor": "#9CAF88",
      "accentColor": "#9CAF88",
      "borderColor": "#374151",
      "dividerStyle": "solid",
      "dividerColor": "#374151",
      "fontSize": "base",
      "linkStyle": "default",
      "padding": "normal"
    },
    "bottomBar": {
      "enabled": true,
      "copyright": "",
      "copyrightText": "",
      "showYear": true,
      "showBackToTop": false,
      "links": [],
      "alignment": "space-between"
    }
  }', 16)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  default_content = EXCLUDED.default_content;

-- Update Gallery block with enterprise features
UPDATE block_types SET
  description = 'Enterprise galeri - grid, masonry, slider ve lightbox',
  default_content = '{
    "title": "",
    "subtitle": "",
    "images": [],
    "layout": {
      "type": "grid",
      "columns": 3,
      "gap": 16,
      "aspectRatio": "square",
      "mobileColumns": 2
    },
    "style": {
      "borderRadius": 12,
      "shadow": "md",
      "hoverEffect": "zoom",
      "showCaption": true,
      "captionPosition": "overlay",
      "overlayColor": "#000000",
      "overlayOpacity": 50
    },
    "lightbox": {
      "enabled": true,
      "showThumbnails": true,
      "showCounter": true,
      "showCaption": true,
      "backgroundColor": "rgba(0,0,0,0.9)",
      "closeOnOverlayClick": true
    },
    "filter": {
      "enabled": false,
      "categories": [],
      "showAllButton": true,
      "allButtonText": "Tumu"
    },
    "backgroundColor": "#ffffff"
  }'::jsonb
WHERE id = 'gallery';
