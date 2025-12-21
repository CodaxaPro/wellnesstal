-- =============================================
-- EMBED BLOCK TYPE
-- Enterprise embed block for YouTube, Maps, custom HTML, etc.
-- =============================================

INSERT INTO block_types (id, name, description, icon, category, default_content, sort_order) VALUES
('embed', 'Embed', 'YouTube, Google Maps, custom HTML/JS ve daha fazlasi icin embed blogu', 'code', 'media',
  '{
    "provider": "custom",
    "embedCode": "",
    "embedUrl": "",
    "title": "",
    "subtitle": "",
    "container": {
      "maxWidth": "xl",
      "alignment": "center",
      "padding": {
        "top": "64px",
        "bottom": "64px",
        "left": "16px",
        "right": "16px"
      },
      "margin": {
        "top": "0px",
        "bottom": "0px"
      }
    },
    "frame": {
      "aspectRatio": "16:9",
      "borderEnabled": false,
      "borderWidth": 1,
      "borderColor": "#e5e7eb",
      "borderRadius": "12px",
      "shadow": "md",
      "overflow": "hidden"
    },
    "background": {
      "type": "none"
    },
    "security": {
      "sandboxEnabled": false,
      "allowScripts": true,
      "allowSameOrigin": true,
      "allowForms": true,
      "allowPopups": true,
      "lazyLoad": true
    },
    "loading": {
      "showLoadingSpinner": true,
      "spinnerColor": "#9CAF88",
      "placeholderText": "Icerik yukleniyor...",
      "placeholderBackgroundColor": "#f9fafb",
      "fallbackEnabled": true,
      "fallbackText": "Icerik yuklenemedi"
    },
    "clickToLoad": false,
    "clickToLoadText": "Goruntulemek icin tiklayin"
  }', 17)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  default_content = EXCLUDED.default_content,
  sort_order = EXCLUDED.sort_order;
