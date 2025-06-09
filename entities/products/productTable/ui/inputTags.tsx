import { useState } from 'react';
import { InputTagsProps } from '../types/inputTagsProps.type'
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { XIcon } from 'lucide-react';

export const InputTags = ({ onChange, value, ...props}: InputTagsProps) => {
	const [pendingDataPoint, setPandingDataPoint] = useState('');
	const [focused, setFocused] = useState(false);

	const addPendingDataPoint = () => {
		if( pendingDataPoint ) {
			const newPendingDataPoint = new Set([...value, pendingDataPoint]);
			onChange(Array.from(newPendingDataPoint));
			setPandingDataPoint('');
		}		
	}
	const {setFocus} = useFormContext();
	return (
		<div 
			onClick={() => setFocus('tags')} 
			className={cn(
				'min-h-[20px] file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input  w-full min-w-0 rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
				focused 
					? 'ring-offset-0 outline-none ring-ring ring-2'
					: 'ring-offset-0 outline-none ring-ring ring-0'
			)}
		>
			<motion.div className='rounded-md min-h-[2.5rem] p-2 gap-2 flex items-center flex-wrap'>
				<AnimatePresence>
					{value.map((tag) => (
						<motion.div key={tag} animate={{scale: 1}} initial={{scale: 0}} exit={{scale: 0}} className='flex items-center justify-between gap-1 px-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-md'>
							<Badge variant="secondary" className='px-0'>{tag}</Badge>
							<button onClick={() => onChange(value.filter((el) => el !== tag))}>
								<XIcon className='w-3 cursor-pointer' />
							</button>
						</motion.div>
					))}
				</AnimatePresence>
			
				<div className='flex'>
					<Input
					className='focus-visible:border-transparent border-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-none'
						placeholder='Add tags'
						onKeyDown={(e) => {
							if(e.key === 'Enter') {
								e.preventDefault();
								addPendingDataPoint();
							}
							if(e.key === 'Backspace' && !pendingDataPoint && value.length > 0) {
								e.preventDefault();
								const newValue = [...value];
								newValue.pop();
								onChange(newValue);
							}
						}}
						value={pendingDataPoint}
						onChange={(e) => setPandingDataPoint(e.target.value)}
						onFocus={() => setFocused(true)}
						onBlurCapture={() => setFocused(false)}
						{...props}
					/>
				</div>
			</motion.div>
		</div>
	)
}