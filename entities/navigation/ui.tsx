import { auth } from '@/server/auth'
import { UserButton } from './userButton';
import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';
import { CartDrawer } from '@/features/cart/ui/CartDrawer';
import { Logo } from '@/shared/components/ui/logo';

export const Navigation = async({isHome = false} : {isHome: boolean}) => {
	const session =  await auth();

	return (
		<>
			{isHome ? (
				<header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
					<div className="container mx-auto px-4 py-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<Logo className="w-12 h-12" />
								<div className='sm:flex hidden'>
									<h1 className="text-xl font-bold text-gray-900">GoodsMegaGood</h1>
									<p className="text-xs text-primary font-medium">Premium • Affordable</p>
								</div>
							</div>

							<nav className="hidden md:flex items-center space-x-6">
								<Link href="/products" className="text-gray-700 hover:text-primary transition-colors">
									Products
								</Link>
								<Link href="/categories" className="text-gray-700 hover:text-primary transition-colors">
									Categories
								</Link>
								<Link href="/about" className="text-gray-700 hover:text-primary transition-colors">
									About
								</Link>
							</nav>

							<div className="flex items-center space-x-3">
								<CartDrawer />
								{ session ? (
									<li className='flex items-center'><UserButton expires={session?.expires} user={session?.user}/></li>
									) : (
										<>
											<Link href="/auth/login">
												<Button
													variant="outline"
													size="sm"
													className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent cursor-pointer"
												>
													Sign In
												</Button>
											</Link>
											<Link href="auth/register">
												<Button size="sm" className="bg-secondary hover:bg-secondary/80 text-white cursor-pointer">
													Join GMG
												</Button>
											</Link>
										</>
									)
								}              
							</div>
						</div>
					</div>
				</header>
				):(
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
			)}
		</>			
	)
}