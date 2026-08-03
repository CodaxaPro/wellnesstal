import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center pt-24">
      <div className="text-center container-luxury">
        <h1 className="headline-lg">404</h1>
        <p className="body-luxury mt-4">Seite nicht gefunden.</p>
        <Link href="/" className="btn-luxury-primary mt-10 inline-flex"><span>Zur Startseite</span></Link>
      </div>
    </main>
  )
}
