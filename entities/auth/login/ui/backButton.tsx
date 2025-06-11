
'use client';
import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';

interface IBackButtonProps{
	href: string;
	label: string;
}
export const BackButton = ({href, label}: IBackButtonProps) => {
	return (
		<Button variant={'link'}>
			<Link aria-label={ label } href={href}>
				{ label }
			</Link>
		</Button>
	)
}