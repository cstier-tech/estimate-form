function Button({
  label,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
}) {
  const variants = {
    primary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-400',
    info: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-400',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-400',
    warning: 'bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-300',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        'px-4 py-2',
        'rounded-md',
        'text-sm font-medium',
        'transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant] ?? variants.primary,
      ].join(' ')}
    >
      {label}
    </button>
  )
}

export default Button
