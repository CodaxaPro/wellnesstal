import type { Metadata } from 'next'

import HeroVideo from '@/components/luxury/HeroVideo'
import RitualVideo from '@/components/luxury/RitualVideo'
import {
  BenefitsSection,
  BookingSection,
  ExperienceSection,
  ExpertSection,
  FaqSection,
  GiftSection,
  InstagramSection,
  LocalSeoSection,
  LocationSection,
  PainSection,
  ProductsSection,
  ServicesSection,
  TestimonialsSection,
} from '@/components/luxury/Sections'
import { getSite } from '@/lib/content'
import { pageMetadata } from '@/lib/seo-meta'

const site = getSite()

export const metadata: Metadata = pageMetadata({
  title: site.seo.title,
  description: site.seo.description,
  path: '/',
  ogImage: '/images/hero.jpeg',
  ogAlt: 'Wellnesstal Premium Head Spa Baesweiler',
})

export default function HomePage() {

  return (
    <main id="main">
      <HeroVideo site={site} />
      <PainSection site={site} />
      <ExperienceSection site={site} />
      <BenefitsSection site={site} />
      <ServicesSection site={site} />
      <RitualVideo site={site} />
      <ProductsSection site={site} />
      <ExpertSection site={site} />
      <GiftSection site={site} />
      <TestimonialsSection site={site} />
      <FaqSection site={site} />
      <InstagramSection site={site} />
      <LocationSection site={site} />
      <LocalSeoSection site={site} />
      <BookingSection site={site} />
    </main>
  )
}
