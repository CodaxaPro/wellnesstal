type Props = {
  data: Record<string, unknown> | Record<string, unknown>[]
}

export default function JsonLd({ data }: Props) {
  const items = Array.isArray(data) ? data : [data]

  return (
    <>
      {items.map((item) => (
        <script
          key={JSON.stringify(item).slice(0, 80)}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  )
}
