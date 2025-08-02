ALTER TABLE "orderProduct" RENAME COLUMN "productId" TO "productID";--> statement-breakpoint
ALTER TABLE "orderProduct" RENAME COLUMN "productVariantId" TO "productVariantID";--> statement-breakpoint
ALTER TABLE "orderProduct" DROP CONSTRAINT "orderProduct_productId_products_id_fk";
--> statement-breakpoint
ALTER TABLE "orderProduct" DROP CONSTRAINT "orderProduct_productVariantId_productVariants_id_fk";
--> statement-breakpoint
ALTER TABLE "orderProduct" ADD CONSTRAINT "orderProduct_productID_products_id_fk" FOREIGN KEY ("productID") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orderProduct" ADD CONSTRAINT "orderProduct_productVariantID_productVariants_id_fk" FOREIGN KEY ("productVariantID") REFERENCES "public"."productVariants"("id") ON DELETE cascade ON UPDATE no action;