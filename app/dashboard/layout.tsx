import { DashboardNav } from '@/entities/navigation/dashboardNav/ui';
import { auth } from '@/server/auth';
import { BarChart, Package, PenSquare, Settings, Truck } from 'lucide-react'
import React from 'react'

export default async function DashboardLayout({children} : {children: React.ReactNode}) {
	const session = await auth();
	
	const userLinks = [
		{
			label: 'Orders',
			path: '/dashboard/orders',
			icon: <Truck size={16} />,
		},
		{
			label: 'Settings',
			path: '/dashboard/settings',
			icon: <Settings size={16} />,
		},
	] as const;

	const adminLinks = session?.user.role === 'admin' ? [
		{
			label: 'Analytics',
			path: '/dashboard/analytics',
			icon: <BarChart size={16} />,
		},
		{
			label: 'Create',
			path: '/dashboard/add-product',
			icon: <PenSquare size={16} />,
		},
		{
			label: 'Products',
			path: '/dashboard/products',
			icon: <Package size={16} />,
		},
	] as const : [];

	const allLinks = [...adminLinks, ...userLinks]
	return (
		<div>
			<DashboardNav allLinks={allLinks} />
			{ children }
		</div>
	)
}