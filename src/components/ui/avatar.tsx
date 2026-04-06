import { getInitials } from '@/lib/utils'
import Image from 'next/image'

interface AvatarProps {
  src?: string | null
  name?: string | null
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeMap = {
  xs: 'w-5 h-5 text-xs',
  sm: 'w-7 h-7 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-sm',
  xl: 'w-14 h-14 text-base',
}

export function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  const sizeClass = sizeMap[size]
  const initials = name ? getInitials(name) : '?'

  if (src) {
    return (
      <div className={`${sizeClass} rounded-full overflow-hidden flex-shrink-0 ${className}`}>
        <img src={src} alt={name ?? 'User'} className="w-full h-full object-cover" />
      </div>
    )
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold flex-shrink-0 ${className}`}
    >
      {initials}
    </div>
  )
}

interface AvatarGroupProps {
  users: Array<{ name?: string | null; image?: string | null }>
  max?: number
  size?: AvatarProps['size']
}

export function AvatarGroup({ users, max = 4, size = 'sm' }: AvatarGroupProps) {
  const visible = users.slice(0, max)
  const remaining = users.length - max

  return (
    <div className="flex -space-x-2">
      {visible.map((user, i) => (
        <Avatar
          key={i}
          src={user.image}
          name={user.name}
          size={size}
          className="ring-2 ring-white"
        />
      ))}
      {remaining > 0 && (
        <div
          className={`${sizeMap[size]} rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-medium ring-2 ring-white`}
        >
          +{remaining}
        </div>
      )}
    </div>
  )
}
