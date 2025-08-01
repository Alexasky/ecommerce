import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/server";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from '@/shared/lib/schemas';
import { eq } from 'drizzle-orm';
import { accounts, users } from './schema';
import bcrypt from 'bcryptjs';
import Stripe from 'stripe';
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  secret: process.env.AUTH_SECRET,
  session: { strategy: 'jwt'},
  events: {
    createUser: async ({ user }) => {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
      const customer = await stripe.customers.create({
        email: user.email!,
        name: user.name!,
      });
      await db.update(users)
        .set({customerID: customer.id})
        .where(eq(users.id, user.id!));
    },
  },
  callbacks: {
    async session({session, token}) {
      if (session && token.sub) {
        session.user.id = token.sub;
      }

      if (session.user && token.role) {
        session.user.role = token.role as string;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.image = token.image as string;
      }

      return session;
    },
    async jwt({token}) {
      if (!token.sub) return token;
      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, token.sub),
      });
      if (!existingUser) return token;
      const existingAccount = await db.query.accounts.findFirst({
        where: eq(accounts.userId, existingUser.id)
      });

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.twoFactorEnabled;
      token.image = existingUser.image;

      return token;
    }
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      authorize: async ( credentials ) => {         
        const validatedFields = LoginSchema.safeParse( credentials );
        if ( validatedFields.success ) {
          const { email, password } = validatedFields.data;
          const user = await db.query.users.findFirst({ where: eq(users.email, email)});

          if (!user || !user.password ) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);

          if ( passwordMatch ) return user;          
        }
        return null;
      }
    })
  ],
})