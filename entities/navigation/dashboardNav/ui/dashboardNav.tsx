'use client';
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { IDashboardLink } from '../types';
import { AnimatePresence, motion } from 'framer-motion';

export const DashboardNav = ({ allLinks }: {allLinks: IDashboardLink[]}) => {
	const pathname = usePathname();
	return (
		<nav className='p-6 overflow-auto'>
				<ul className='flex gap-6 text-xs font-bold'>
					<AnimatePresence>
						{allLinks.map((link) => (
							<motion.li whileTap={{ scale: 0.95 }}  key={ link.path }>
								<Link href={ link.path } className={cn('flex gap-1 flex-col items-center relative', pathname === link.path && 'text-primary')}>
									{ link.icon }
									{ link.label }
									{ pathname === link.path ? (
										<motion.div 
											className='h-[3px] w-full rounded-full absolute bg-primary lext-0 -bottom-1 z-0'
											initial={{ scale: 0.5 }} 
											animate={{ scale: 1 }} 
											layoutId='underline'
											transition={{ type: 'spring', stiffness: 35 }}
										/>
									) : null}
								</Link>
							</motion.li>
						))}
					</AnimatePresence>
				</ul>
			</nav>
	)
}