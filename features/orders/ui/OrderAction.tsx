'use client';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Order } from '../model/types';

export const OrderActions = ({ order }: { order: Order }) => {
	const [openDialog, setOpenDialog] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(false)

  const handleOpenDialog = () => {
    setOpenDropdown(false)
    setOpenDialog(true)
  }

  return (
    <>
      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={handleOpenDialog}>
            View Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Details #{order.id}</DialogTitle>
          </DialogHeader>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.orderProduct.map(({ product, productVariants, quantity }) => (
                  <TableRow key={productVariants.id}>
                    <TableCell>
                      <Image
                        width={48}
                        height={48}
                        src={productVariants.variantImages[0].url}
                        alt={product.title}
                      />
                    </TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>{product.title}</TableCell>
                    <TableCell>
                      <div
                        style={{ background: productVariants.color }}
                        className="w-4 h-4 rounded-full"
                      ></div>
                    </TableCell>
                    <TableCell>{quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </DialogContent>
      </Dialog>
    </>
	)
}