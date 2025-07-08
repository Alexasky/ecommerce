'use client';

import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '../model/store';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/shared/components/ui/drawer';
import { AnimatePresence, motion} from 'framer-motion';

export const CartDrawer = () => {
	const { cart } = useCartStore();
    return(
			<Drawer>
				<DrawerTrigger className='relative p-2 cursor-pointer flex items-center'>
					<AnimatePresence>
						{cart.length > 0 && (
							<motion.span 
								animate={{scale: 1, opacity: 1}} 
								initial={{scale: 0, opacity: 0}} 
								exit={{scale: 0}}
								className='absolute flex justify-center items-center w-5 h-5 bg-primary dark:bg-primary text-[10px] fo font-bold rounded-full -top-1 -right-0.5 text-white'
							>
								{cart.length}
							</motion.span>
						)}
					</AnimatePresence>
				<ShoppingBag />
				</DrawerTrigger>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>Drawer stuff</DrawerTitle>
					</DrawerHeader>
				</DrawerContent>
			</Drawer>		
		);
};