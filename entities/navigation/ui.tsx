import { auth } from '@/server/auth'
import { Logo } from './logo';
import { UserButton } from './userButton';
import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';

export const Navigation = async() => {
	const session =  await auth();

	return (
		<header>
			<nav className='max-w-7xl mx-auto py-4 px-4'>
				<ul className='flex justify-between items-center'>
					<li>
						<Link aria-label='Logo' href={'/'}><Logo /></Link></li>
					{ session ? (
						<li><UserButton expires={session?.expires} user={session?.user}/></li>
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