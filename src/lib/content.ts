import headspa from '../../content/headspa.json'
import site from '../../content/site.json'
import testimonials from '../../content/testimonials.json'
import { withUtm, type TrackingContext } from './tracking'

export type SiteContent = typeof site
export type HeadspaContent = typeof headspa
export type TestimonialsContent = typeof testimonials

export type { TrackingContext } from './tracking'

export function getSite(): SiteContent {
  return site
}

export function getHeadspa(): HeadspaContent {
  return headspa
}

export function getBookingUrl(ctx?: TrackingContext): string {
  return withUtm(site.brand.bookingUrl, ctx)
}

export function getGutscheinUrl(ctx?: TrackingContext): string {
  return withUtm(site.brand.gutscheinUrl, ctx)
}

export function getTestimonials(): TestimonialsContent {
  return testimonials
}
