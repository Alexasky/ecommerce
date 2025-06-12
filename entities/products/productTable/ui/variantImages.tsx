'use client';

import { UploadDropzone } from '@/app/api/uploadthing/upload';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Table, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { VariantFormValues } from '@/shared/lib/schemas/variantSchema';
import { Reorder } from 'framer-motion';
import { Trash } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';


export const VariantImages = () => {
	const {getValues, control, setError} = useFormContext<VariantFormValues>();
	const [active, setActive] = useState(0);
	const {fields, remove, update, append, move} = useFieldArray({
		control,
		name: 'variantImages',
	});
	return (
		<div>
			<FormField
				control={control}
				name="variantImages"
				render={() => (
					<FormItem>
						<FormLabel>Images</FormLabel>
						<FormControl>
						<UploadDropzone
							className=" min-h-[198px] ut-allowed-content:text-secondary-foreground ut-label:text-primary ut-upload-icon:text-primary/50 ut-upload-icon:w-14 hover:bg-primary/10 transition-all  duration-500 ease-in-out ut-button:bg-primary/80 ut-button:cursor-pointer ut-button:p-2 p-4"
							onUploadError={(error) => {
								setError('variantImages', { type: 'validate', message: error.message || 'Upload failed' });
							}}
							onBeforeUploadBegin={(files) => {
								files.map(file => 
									append({
										name: file.name,
										size: file.size,
										url: URL.createObjectURL(file),
									})
								)
								return files;
							}}	
							onClientUploadComplete={(files) => {
								const currentImages = getValues('variantImages');
								currentImages.map((image, index) => {
									if(image.url.search('blob:') === 0) {
										const file = files.find(file => file.name === image.name);
										if (file) {
											update(index, {
												...image,
												url: file.ufsUrl,
												name: file.name,
												size: file.size,
												key: file.key,
											});
										}
									}
								})
								return;
							}}
							endpoint={'variantUploader'} 
							config={{mode: 'auto'}}
						/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<div className='rounded-md overflow-x-auto '>
				<Table>
					<TableHeader className='font-bold'>
						<TableRow>
							<TableHead>Order</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Size</TableHead>
							<TableHead>Image</TableHead>
							<TableHead>Action</TableHead>
						</TableRow>
					</TableHeader>
					<Reorder.Group as='tbody' values={fields} onReorder={(e) => {
						const activeElement = fields[active];
						e.map((item, index) => {
							if (item.id === activeElement.id) {
								move(active, index);
								setActive(index);
								return;
							}
							return;
						})
					}}>
							{fields.map((field, index) => (
								<Reorder.Item 
									as='tr'
									value={field} 
									key={field.id} 
									id={field.id}
									onDragStart={() => setActive(index)}
									className={cn(
										field.url.search('blob:') === 0 ? 'cursor-pointer hover:bg-primary/10 animate-pulse transition-all' : 'cursor-not-allowed', 
										'text-sm font-medium text-muted-foreground hover:text-primary'
									)}
								>
									<TableCell>{index}</TableCell>
									<TableCell>{field.name}</TableCell>
									<TableCell>{(field.size/(1024*1024)).toFixed(2)} MB</TableCell>
									<TableCell>
										<div className='flex items-center justify-center overflow-hidden h-[48px] w-[72px] rounded-md'>
											{field.url 
												? <Image src={field.url} alt={field.name ?? 'Preview'} height={48} width={72}/> 
												: <div className='text-xs text-muted-foreground'>No Image</div>
											}											
										</div>
									</TableCell>
									<TableCell>
										<Button 
											variant={'ghost'} 
											onClick={(e)=> {
												e.preventDefault();
												remove(index);
											}}
											className='scale-75'
										>
											<Trash className='h-4'/>
										</Button>
									</TableCell>
								</Reorder.Item>
							))}
					</Reorder.Group>
				</Table>
			</div>
		</div>
	)
}