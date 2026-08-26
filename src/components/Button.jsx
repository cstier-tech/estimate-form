function Button({
  label,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  size = 'md'
}) {
  const variants = {
    primary: 'whitespace-nowrap bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-400',
    danger: 'whitespace-nowrap bg-red-600 text-white hover:bg-red-700 focus:ring-red-400',
    info: 'whitespace-nowrap bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-400',
    success: 'whitespace-nowrap bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-400',
    warning: 'whitespace-nowrap bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-300',
  }
  const sizes = {
    sm: 'px-3 py-1 text-xs',
    smFull: 'px-3 py-1 grow text-xs',
    md: 'px-4 py-2 text-sm',
    mdFull: 'px-4 py-2 grow text-sm',
    lg: 'px-5 py-3',
    lgFull: 'px-5 py-3 grow',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        'px-4 py-2',
        'rounded-md',
        ' font-medium',
        'transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
      ].join(' ')}
    >
      {label}
    </button>
  )
}

export default Button
