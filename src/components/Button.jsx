function Button({
  label,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
}) {
  const variants = {
    primary: 'bg-gradient-to-b from-gray-100 to-gray-300 text-black hover:from-gray-200 hover:to-gray-400 focus:ring-gray-400',
    danger: 'bg-gradient-to-b from-red-500 to-red-700 text-white hover:from-red-600 hover:to-red-800 focus:ring-red-400',
    info: 'bg-gradient-to-b from-sky-500 to-sky-700 text-white hover:from-sky-600 hover:to-sky-800 focus:ring-sky-400',
    success: 'bg-gradient-to-b from-emerald-500 to-emerald-700 text-white hover:from-emerald-600 hover:to-emerald-800 focus:ring-emerald-400',
    warning: 'bg-gradient-to-b from-amber-400 to-amber-600 text-white hover:from-amber-500 hover:to-amber-700 focus:ring-amber-300',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        'px-5 py-2.5',
        'rounded',
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
