import { ContentAlignment } from '../../../types'

interface AlignmentSelectorProps {
  value: ContentAlignment
  onChange: (v: ContentAlignment) => void
  label?: string
}

export default function AlignmentSelector({
  value,
  onChange,
  label: _label
}: AlignmentSelectorProps) {
  const options: { value: ContentAlignment; icon: React.ReactNode; title: string }[] = [
    {
      value: 'left',
      title: 'Sola Hizala',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h14" />
        </svg>
      )
    },
    {
      value: 'center',
      title: 'Ortala',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M5 18h14" />
        </svg>
      )
    },
    {
      value: 'right',
      title: 'Sağa Hizala',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M6 18h14" />
        </svg>
      )
    }
  ]

  return (
    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          title={opt.title}
          className={`flex items-center justify-center p-1.5 rounded-md transition-all ${
            value === opt.value
              ? 'bg-white text-sage-600 shadow-sm'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  )
}
