interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  rightIcon?: React.ReactNode
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  rightIcon,
  className = '',
  ...props
}: ButtonProps) => {
  const base =
    'rounded-full font-semibold flex items-center justify-center gap-3 transition-all duration-200 hover:scale-[1.05] active:scale-[0.95] hover:cursor-pointer'

  const variants = {
    primary:
      'bg-[#022c22] dark:bg-[#cdfc4d] text-white dark:text-[#022c22] shadow-xl hover:shadow-2xl hover:shadow-[#022c22]/20',
    outline:
      'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[#022c22] dark:text-white',
    ghost: 'bg-transparent text-[#022c22] dark:text-white',
  }

  const sizes = {
    sm: 'h-10 px-4 text-sm',
    md: 'h-12 px-6 text-base',
    lg: 'h-14 px-8 text-lg',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}

      {rightIcon && (
        <div className="w-7 h-7 bg-white/20 dark:bg-black/10 rounded-full flex items-center justify-center">
          {rightIcon}
        </div>
      )}
    </button>
  )
}