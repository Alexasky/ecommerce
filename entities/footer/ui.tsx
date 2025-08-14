import Link from 'next/link'

export const Footer = () => {
	return (
		<footer className="bg-gray-900 text-white py-12 mt-8">
			<div className="container mx-auto px-4">
				<div className="grid md:grid-cols-4 gap-8">
					<div>
						<div className="flex items-center space-x-2 mb-4">
							<div className="w-8 h-8 bg-gradient-to-br from-[#37999f] to-[#cb962e] rounded-lg flex items-center justify-center">
								<span className="text-white font-bold text-sm">GMG</span>
							</div>
							<span className="font-bold">GoodsMegaGood</span>
						</div>
						<p className="text-gray-400 text-sm">
							Premium quality products at smart prices for the discerning shopper.
						</p>
					</div>
					<div>
						<h4 className="font-semibold mb-4">Shop</h4>
						<ul className="space-y-2 text-sm text-gray-400">
							<li>
								<Link href="/categories/home" className="hover:text-white">
									Home & Living
								</Link>
							</li>
							<li>
								<Link href="/categories/toys" className="hover:text-white">
									Toys & Games
								</Link>
							</li>
							<li>
								<Link href="/categories/fashion" className="hover:text-white">
									Fashion
								</Link>
							</li>
							<li>
								<Link href="/categories/party" className="hover:text-white">
									Party Supplies
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h4 className="font-semibold mb-4">Account</h4>
						<ul className="space-y-2 text-sm text-gray-400">
							<li>
								<Link href="/login" className="hover:text-white">
									Sign In
								</Link>
							</li>
							<li>
								<Link href="/register" className="hover:text-white">
									Create Account
								</Link>
							</li>
							<li>
								<Link href="/orders" className="hover:text-white">
									My Orders
								</Link>
							</li>
							<li>
								<Link href="/dashboard" className="hover:text-white">
									Dashboard
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h4 className="font-semibold mb-4">Support</h4>
						<ul className="space-y-2 text-sm text-gray-400">
							<li>
								<Link href="/help" className="hover:text-white">
									Help Center
								</Link>
							</li>
							<li>
								<Link href="/contact" className="hover:text-white">
									Contact Us
								</Link>
							</li>
							<li>
								<Link href="/returns" className="hover:text-white">
									Returns
								</Link>
							</li>
							<li>
								<Link href="/shipping" className="hover:text-white">
									Shipping Info
								</Link>
							</li>
						</ul>
					</div>
				</div>
				<div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
					<p>&copy; 2024 GoodsMegaGood. All rights reserved.</p>
				</div>
			</div>
		</footer>
	)
}