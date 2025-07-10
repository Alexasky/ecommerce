import { auth } from '@/server/auth'
import { Logo } from './logo';
import { UserButton } from './userButton';
import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';
import { CartDrawer } from '@/features/cart/ui/CartDrawer';

export const Navigation = async() => {
	const session =  await auth();

	return (
		<header>
			<nav className='max-w-8xl mx-auto py-4 px-4'>
				<ul className='flex justify-between items-center gap-4'>
					<li className='flex-1'>
						<Link aria-label='Logo' href={'/'}><Logo /></Link>
					</li>
					<li><CartDrawer /></li>
					{ session ? (
						<li className='flex items-center'><UserButton expires={session?.expires} user={session?.user}/></li>
						) : (
							<li>
								<Button asChild>
									<Link aria-label='Login' href={'/auth/login'}>
										<span>Login</span>
									</Link>
								</Button>
							</li>
						)
					}
				</ul>
			</nav>
		</header>		
	)
}