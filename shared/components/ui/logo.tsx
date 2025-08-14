import { cn } from '@/lib/utils'

export const Logo = ({
	className
}: {className?: string}) => {
	return (
		<div className={cn("w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center", className)}>
			<span className="text-white font-bold">GMG</span>
		</div>
	)
}