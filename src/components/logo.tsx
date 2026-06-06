import { cn } from '../lib/utils'
import logo from '../assets/logoForLightBackground.svg'

export const Logo = ({
  className,
}: {
  className?: string
}) => {
  return (
    <img
      src={logo}
      alt="Logo"
      className={cn('h-6 w-auto', className)}
    />
  )
}

export const LogoIcon = ({
  className,
}: {
  className?: string
}) => {
  return (
    <img
      src={logo}
      alt="Logo Icon"
      className={cn('size-6', className)}
    />
  )
}