'use client';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface IBackButtonProps{
	href: string;
	label: string;
	isArrow?: boolean;
}
export const BackButton = ({href, label, isArrow}: IBackButtonProps) => {
	return (
		<Button variant={'link'}>
			{ isArrow && <ArrowLeft className="w-4 h-4 mr-2" />}
			<Link aria-label={ label } href={href}>
				{ label }
			</Link>
		</Button>
	)
}