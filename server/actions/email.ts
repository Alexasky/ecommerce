'use server';
import getBaseUrl from '@/lib/baseUrl';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseUrl();
console.log('getBaseUrl:',domain)

export const sendVerificationEmail = async (email: string, token: string) => {
	const confirmLink = `${domain}/auth/new-verification?token=${token}`;
	const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: email,
    subject: 'E-commerce Confifmation Email',
    html: `<p>Click to <a href='${confirmLink}'>confirm your email</a></p>`,
  });

	if ( error ) return error;

	if ( data ) return data;
}

export const sendTwoFactorTokenByEmail = async (email: string, token: string) => {
	const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: email,
    subject: 'E-commerce - Your 2 Factor Token',
    html: `<p>Your Confirmation Code: ${token}</p>`,
  });

	if ( error ) return error;

	if ( data ) return data;
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
	const confirmLink = `${domain}/auth/new-password?token=${token}`;
	const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: email,
    subject: 'E-commerce Confifmation Email',
    html: `<p>Click here <a href='${confirmLink}'>reset your password</a></p>`,
  });

	if ( error ) return error;

	if ( data ) return data;
}