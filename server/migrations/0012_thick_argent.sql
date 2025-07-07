CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"rating" serial NOT NULL,
	"userID" text NOT NULL,
	"productID" serial NOT NULL,
	"comment" text NOT NULL,
	"created" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userID_user_id_fk" FOREIGN KEY ("userID") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_productID_product_id_fk" FOREIGN KEY ("productID") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "productIDx" ON "reviews" USING btree ("productID");--> statement-breakpoint
CREATE INDEX "userIDx" ON "reviews" USING btree ("userID");