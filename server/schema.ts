import { relations } from 'drizzle-orm';
import { index } from 'drizzle-orm/pg-core';
import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  serial,
  real,
} from "drizzle-orm/pg-core"
import { AdapterAccount } from 'next-auth/adapters'

export const RoleEnum = pgEnum('roles', ['user', 'admin']);
  
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  password: text("password"),
  image: text("image"),
  twoFactorEnabled: boolean('twoFactorEnabled').default(false),
  role: RoleEnum('roles').default('user'),
  customerID: text("customerID"),
})
 
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
)
 
export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})
 
export const verificationTokens = pgTable(
  "verificationToken",
  {
    id: text("id").primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.id, verificationToken.token],
      }),
    },
  ]
)
 
export const passwordResetTokens = pgTable(
  "passwordResetToken",
  {
    id: text("id").primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.id, verificationToken.token],
      }),
    },
  ]
)
 
export const twoFactorTokens = pgTable(
  "twoFactorToken",
  {
    id: text("id").primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
    userID: text("userID").references(()=> users.id, { onDelete: "cascade" }),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.id, verificationToken.token],
      }),
    },
  ]
)
 
export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
)

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  created: timestamp("created").defaultNow(),
})

export const productVariants = pgTable("productVariants", {
  id: serial("id").primaryKey(),
  color: text("color").notNull(),
  productType: text("productType").notNull(),
  updated: timestamp("updated").defaultNow(),
  productID: serial("productID")
    .notNull()
    .references(() => products.id, {onDelete: "cascade"}),
})

export const variantImages = pgTable("variantImages", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  size: real("size").notNull(),
  name: text("name").notNull(),
  order: real("order").notNull(),
  variantID: serial("variantID")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade"}),
})

export const variantTags = pgTable("variantTags", {
  id: serial("id").primaryKey(),
  tag: text("tag").notNull(),
  variantID:serial("variantID")
    .notNull()
    .references(() => productVariants.id, {onDelete: "cascade"}),
})

export const productRelation = relations(products, ({many}) => ({
  productVariants: many(productVariants, {relationName: "productVariants"}),
  reviews: many(reviews, {relationName: "reviews"}),
  })
)

export const productVariantsRelation = relations(productVariants, 
  ({many, one}) => ({
    product: one(products, {
      fields:[productVariants.productID],
      references: [products.id],
      relationName: "productVariants"
    }),
    variantImages: many(variantImages, {relationName: "variantImages"}),
    variantTags: many(variantTags, {relationName: "variantTags"}),
  })
)

export const variantImagesRelation = relations(variantImages, ({one}) => ({
  productVariants: one(productVariants, {
    fields: [variantImages.variantID],
    references:[productVariants.id],
    relationName: "variantImages"
  })
}))

export const variantTagsRelation = relations(variantTags, ({one}) => ({
  productVariants: one(productVariants, {
    fields: [variantTags.variantID],
    references:[productVariants.id],
    relationName: "variantTags"
  })
}))

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  rating: serial("rating").notNull(),
  userID: text("userID")
    .notNull()
    .references(() => users.id, {onDelete: 'cascade'}),
  productID: serial("productID")
    .notNull()
    .references(() => products.id, {onDelete: 'cascade'}),
  comment: text("comment").notNull(),
  created: timestamp("created").defaultNow(),
}, (table) => {
  return [
    index("productIDx").on(table.productID),
    index("userIDx").on(table.userID)
  ]
});

export const reviewRelation = relations(reviews, ({one}) => ({
  user: one(users, {
    fields: [reviews.userID],
    references:[users.id],
    relationName: "userReviews",
  }),
  product: one(products, {
    fields: [reviews.productID],
    references:[products.id],
    relationName: "reviews",
  }),  
}))


export const userRelation = relations(users,({many}) => ({
  reviews: many(reviews, {relationName:"userReviews"}),
  orders: many(orders, {relationName: "userOrders"}),
}))

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userID: text("userID")
  .notNull()
  .references(() => users.id, ({ onDelete: "cascade"})),
  total: real("total").notNull(),
  status: text("status").notNull(),
  created: timestamp("created").defaultNow(),
  receiptURL: text("receiptURL"),
  paymentIntentID: text("paymentIntentID"),
})

export const ordersRalations = relations(orders, ({one, many}) => ({
  user: one(users, {
    fields: [orders.userID],
    references: [users.id],
    relationName: "userOrders",
  }),
  orderProduct: many(orderProduct, {relationName: "orderProduct" })
}))

export const  orderProduct = pgTable("orderProduct", {
  id: serial("id").primaryKey(),
  quantity: integer("quantity").notNull(),
  productID: serial("productID").references(() => products.id, { onDelete: "cascade"}),
  productVariantID: serial("productVariantID").notNull().references(() => productVariants.id, { onDelete: "cascade"}),
  orderID: serial("orderID").notNull().references(() => orders.id, { onDelete: "cascade"}),
})

export const orderProductRelations = relations(orderProduct, ({one}) => ({
  order: one(orders, {
    fields: [orderProduct.orderID],
    references: [orders.id],
    relationName: "orderProduct"
  }),
  product: one(products, {
    fields: [orderProduct.productID],
    references: [products.id],
    relationName: "products"
  }),
  productVariants: one(productVariants,{
    fields: [orderProduct.productVariantID],
    references: [productVariants.id],
    relationName: "productVariants"
  })
}));