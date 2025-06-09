"use client"

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { deleteProduct } from '@/server/actions/deleteProduct';
import { VariantsWithImagesTags } from '@/shared/lib/inferTypes';
import { ColumnDef, Row } from "@tanstack/react-table"
import { MoreHorizontal } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { ProductVariant } from './productVariant';

export type ProductColumn = {
  id: number,
  title: string,
	description: string,
	price: number,
	variants: VariantsWithImagesTags,
	image: string,
}

const ActionCell = ({row}: {row: Row<ProductColumn>}) => {
	const { execute } = useAction(deleteProduct, {
		onSuccess: (data) => {
			if( data.data?.success ) toast.success(data.data.success);
			if( data.data?.error ) toast.error(data.data.error);
		},
		onExecute: () => toast.loading('Deleting product')
	})
	const product = row.original;
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant={"ghost"} className='cursor-pointer w-8 h-8 p-0'><MoreHorizontal className='w-4 h-4'/></Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem className='cursor-pointer dark:focus:bg-primary focus:bg-primary/50'>
					<Link href={`/dashboard/add-product?id=${product.id}`}>Edit Product</Link>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => execute({id: product.id})} className='cursor-pointer dark:focus:bg-destructive focus:bg-destructive/50'>Delete Product</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
	{
    accessorKey: "variants",
    header: "Variants",
		cell: ({row}) => {
			const variants = row.getValue("variants") as VariantsWithImagesTags[];
			return (
				<div>
					{variants.map((variant) => (
						<div key={variant.id}>
							<Tooltip>
								<TooltipTrigger asChild />								
								<TooltipContent>
									<ProductVariant editMode={true} productID={variant.id} variant={variant}>
										<div 
											className='w-5 h-5 rounded-full'
											key={variant.id}
											style={{background: variant.color}}
										/>
									</ProductVariant>
								</TooltipContent>
							</Tooltip>
						</div>
					))}
					<ProductVariant editMode={false} productID={row.original.id} />
						{/* <PlusCircle className='w-4 h-4 text-primary cursor-pointer'/> */}
					{/* </ProductVariant> */}
					{/* <Tooltip>
						<TooltipTrigger asChild>
							<span>
								<ProductVariant editMode={false} productID={row.original.id}>
									<PlusCircle className='w-4 h-4 text-primary cursor-pointer'/>
								</ProductVariant>
							</span>
						</TooltipTrigger>
						<TooltipContent>							
							<p>Create a new variant</p>
						</TooltipContent>
					</Tooltip> */}
				</div>
			)
		}
  },
  {
    accessorKey: "price",
    header: "Price",
		cell: ({row}) => {
			const price = parseFloat(row.getValue('price'));
			const formatted = new Intl.NumberFormat('en-Us', {
				currency: 'USD',
				style: 'currency'
			}).format(price);
			return (
				<div className='text-xs font-medium'>{formatted}</div>
			)
		}
  },
  {
    accessorKey: "image",
    header: "Image",
		cell: ({row}) => {
			const imageUrl = row.getValue('image') as string;
			const title = row.getValue('title') as string;
			return(
				<div>
					<Image src={imageUrl} alt={title} width={50} height={50} className='rounded-md'/>
				</div>
			)
		}
  },
	{
    accessorKey: "actions",
    header: "Actions",
		cell: ActionCell,
  },

]