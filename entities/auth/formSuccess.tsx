import { CheckCircle2 } from 'lucide-react';

export const FormSuccess = ({ message }: {message?: string} ) => {
	if ( !message ) return null;

	return (
		<div className='bg-teal-500/25 flex items-center gap-2 py-3 text-xs text-secondary-foreground p-3'>
			<CheckCircle2 className='w-4 h-4' />
			<p>{ message }</p>
		</div>
	)
}