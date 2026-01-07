#!/bin/bash

# Production Environment Setup Script
# Bu script local ortamı production Supabase ile çalışacak şekilde yapılandırır

echo "🚀 Production Environment Setup Başlatılıyor..."
echo ""

# Renk kodları
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# .env.local dosyası kontrolü
if [ -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local dosyası zaten mevcut!${NC}"
    read -p "Üzerine yazmak istiyor musunuz? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "İşlem iptal edildi."
        exit 1
    fi
fi

echo "📝 Production Supabase bilgilerini girin:"
echo ""

# Supabase URL
read -p "NEXT_PUBLIC_SUPABASE_URL (örn: https://xxx.supabase.co): " SUPABASE_URL
if [ -z "$SUPABASE_URL" ]; then
    echo -e "${RED}❌ Supabase URL boş olamaz!${NC}"
    exit 1
fi

# Supabase Anon Key
read -p "NEXT_PUBLIC_SUPABASE_ANON_KEY: " SUPABASE_ANON_KEY
if [ -z "$SUPABASE_ANON_KEY" ]; then
    echo -e "${RED}❌ Supabase Anon Key boş olamaz!${NC}"
    exit 1
fi

# Supabase Service Role Key
read -sp "SUPABASE_SERVICE_ROLE_KEY (gizli): " SUPABASE_SERVICE_KEY
echo ""
if [ -z "$SUPABASE_SERVICE_KEY" ]; then
    echo -e "${RED}❌ Supabase Service Role Key boş olamaz!${NC}"
    exit 1
fi

# Site URL
read -p "NEXT_PUBLIC_SITE_URL [https://www.wellnesstal.de]: " SITE_URL
SITE_URL=${SITE_URL:-https://www.wellnesstal.de}

# Admin Password
read -sp "ADMIN_PASSWORD: " ADMIN_PASSWORD
echo ""
if [ -z "$ADMIN_PASSWORD" ]; then
    echo -e "${RED}❌ Admin Password boş olamaz!${NC}"
    exit 1
fi

# JWT Secret
read -sp "JWT_SECRET: " JWT_SECRET
echo ""
if [ -z "$JWT_SECRET" ]; then
    echo -e "${YELLOW}⚠️  JWT_SECRET boş, random oluşturuluyor...${NC}"
    JWT_SECRET=$(openssl rand -hex 32)
    echo -e "${GREEN}✅ JWT_SECRET oluşturuldu: ${JWT_SECRET:0:20}...${NC}"
fi

# Unsplash Key (optional)
read -p "UNSPLASH_ACCESS_KEY (opsiyonel, Enter ile geç): " UNSPLASH_KEY

# .env.local dosyasını oluştur
cat > .env.local << EOF
# Production Environment Variables
# Otomatik oluşturuldu: $(date)

# Supabase Configuration (Production)
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_KEY

# Site Configuration
NEXT_PUBLIC_SITE_URL=$SITE_URL

# Admin Configuration
ADMIN_PASSWORD=$ADMIN_PASSWORD

# JWT Secret
JWT_SECRET=$JWT_SECRET
EOF

# Unsplash key varsa ekle
if [ ! -z "$UNSPLASH_KEY" ]; then
    echo "" >> .env.local
    echo "# Optional: Unsplash API" >> .env.local
    echo "UNSPLASH_ACCESS_KEY=$UNSPLASH_KEY" >> .env.local
fi

echo ""
echo -e "${GREEN}✅ .env.local dosyası oluşturuldu!${NC}"
echo ""
echo "📋 Sonraki adımlar:"
echo "  1. npm install (ilk kez kurulum için)"
echo "  2. npm run dev (development server'ı başlat)"
echo ""
echo -e "${YELLOW}⚠️  ÖNEMLİ: .env.local dosyasını Git'e commit etmeyin!${NC}"

