-- Wellnesstal Seed Data
-- Run this AFTER 001_initial_schema.sql

-- =====================================================
-- SEED: Admin User
-- Password: wellnesstal2024 (bcrypt hash)
-- =====================================================
INSERT INTO admin_users (username, email, password_hash, role)
VALUES (
  'admin',
  'admin@wellnesstal.de',
  '$2b$10$rOzJqQZQZQZQZQZQZQZQZOeKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq',
  'admin'
) ON CONFLICT (username) DO NOTHING;

-- =====================================================
-- SEED: Categories
-- =====================================================
INSERT INTO categories (name, description, slug, color, icon, order_num, active, service_count)
VALUES
  ('Spa Tedavileri', 'Rahatlatıcı spa ve wellness tedavileri', 'spa-tedavileri', '#10B981', '🌿', 1, true, 1),
  ('Masaj Terapileri', 'Profesyonel masaj ve terapi hizmetleri', 'masaj-terapileri', '#059669', '💆', 2, true, 2),
  ('Güzellik Bakımı', 'Yüz ve vücut güzellik bakım hizmetleri', 'guzellik-bakimi', '#E11D48', '✨', 3, false, 1)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- SEED: Services
-- =====================================================
INSERT INTO services (title, slug, description, short_description, category_id, price, duration, image, active, order_num)
VALUES
  (
    'Premium Head Spa',
    'premium-head-spa',
    'Luxuriöse Kopfhautbehandlung für ultimative Entspannung',
    'Entspannende Kopfhautbehandlung',
    (SELECT id FROM categories WHERE slug = 'spa-tedavileri'),
    89.00,
    60,
    'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800',
    true,
    1
  ),
  (
    'Aromatherapie Massage',
    'aromatherapie-massage',
    'Ganzheitliche Massage mit ätherischen Ölen',
    'Massage mit ätherischen Ölen',
    (SELECT id FROM categories WHERE slug = 'masaj-terapileri'),
    75.00,
    45,
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
    true,
    2
  ),
  (
    'Hot Stone Therapie',
    'hot-stone-therapie',
    'Entspannende Wärmetherapie mit heißen Steinen',
    'Wärmetherapie mit heißen Steinen',
    (SELECT id FROM categories WHERE slug = 'masaj-terapileri'),
    95.00,
    75,
    'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800',
    true,
    3
  ),
  (
    'Gesichtsbehandlung Deluxe',
    'gesichtsbehandlung-deluxe',
    'Premium Gesichtspflege für strahlende Haut',
    'Premium Gesichtspflege',
    (SELECT id FROM categories WHERE slug = 'guzellik-bakimi'),
    120.00,
    90,
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800',
    false,
    4
  )
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- SEED: Testimonials
-- =====================================================
INSERT INTO testimonials (name, rating, comment, service, active)
VALUES
  ('Maria S.', 5, 'Fantastische Erfahrung! Das Head Spa war unglaublich entspannend.', 'Premium Head Spa', true),
  ('Thomas K.', 5, 'Die beste Massage, die ich je hatte. Sehr professionell!', 'Aromatherapie Massage', true),
  ('Anna M.', 4, 'Tolle Atmosphäre und freundliches Personal.', 'Hot Stone Therapie', true)
ON CONFLICT DO NOTHING;
