import Link from 'next/link'
import type { ReactNode } from 'react'

type ButtonProps = {
  href?: string
  onClick?: () => void
  children: ReactNode
  variant?: 'primary' | 'outline'
  className?: string
}

export default function LuxuryButton({ href, onClick, children, variant = 'primary', className = '' }: ButtonProps) {
  const cls = variant === 'primary' ? 'btn-luxury-primary' : 'btn-luxury-outline'

  if (href) {
    const external = href.startsWith('http')

    if (external) {
      return (
        <a href={href} className={`${cls} ${className}`} rel="noopener noreferrer">
          <span>{children}</span>
        </a>
      )
    }

    return (
      <Link href={href} className={`${cls} ${className}`}>
        <span>{children}</span>
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={`${cls} ${className}`}>
      <span>{children}</span>
    </button>
  )
}
