# Page Categories Migration Instructions

## Hata: `Could not find the table 'public.page_categories'`

Bu hata, `page_categories` tablosunun henüz oluşturulmadığını gösterir. Migration'ı çalıştırmanız gerekiyor.

## Migration'ı Çalıştırma

### Yöntem 1: Supabase SQL Editor (Önerilen)

1. Supabase Dashboard'a gidin: https://supabase.com/dashboard
2. Projenizi seçin
3. Sol menüden **SQL Editor**'a tıklayın
4. **New Query** butonuna tıklayın
5. Aşağıdaki migration dosyasının içeriğini kopyalayıp yapıştırın:
   - Dosya: `supabase/migrations/014_page_categories.sql`
6. **Run** butonuna tıklayın
7. Başarılı mesajını bekleyin

### Yöntem 2: Migration Script (Eğer varsa)

Eğer projenizde migration script'i varsa:

```bash
npm run migrate
# veya
node run-migrations.js
```

## Migration Dosyası Konumu

```
supabase/migrations/014_page_categories.sql
```

## Migration Sonrası

Migration başarıyla çalıştıktan sonra:

1. Sayfayı yenileyin (F5)
2. `/admin/pages` sayfasına gidin
3. Kategori özellikleri artık çalışacak

## Kontrol

Migration'ın başarılı olduğunu kontrol etmek için:

1. Supabase Dashboard > Table Editor
2. `page_categories` tablosunun göründüğünü kontrol edin
3. Varsayılan kategorilerin eklendiğini kontrol edin:
   - Genel
   - Hizmetler
   - Hakkında
   - İletişim
   - Blog
   - Landing

## Sorun Giderme

### Hata: "relation already exists"
- Tablo zaten var, migration'ı tekrar çalıştırmanıza gerek yok

### Hata: "permission denied"
- Supabase service role key'inizin doğru olduğundan emin olun
- RLS (Row Level Security) politikalarını kontrol edin

### Hata: "function does not exist"
- `update_updated_at_column` fonksiyonu eksik olabilir
- Önce `001_initial_schema.sql` migration'ını çalıştırın

