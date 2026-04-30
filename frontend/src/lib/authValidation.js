import { z } from 'zod';

export const passwordRules = [
    {
        key: 'minLength',
        text: 'At least 8 characters',
        test: (value) => value.length >= 8,
    },
    {
        key: 'lowercase',
        text: 'At least 1 lowercase letter',
        test: (value) => /[a-z]/.test(value),
    },
    {
        key: 'uppercase',
        text: 'At least 1 uppercase letter',
        test: (value) => /[A-Z]/.test(value),
    },
    {
        key: 'number',
        text: 'At least 1 number',
        test: (value) => /\d/.test(value),
    },
    {
        key: 'symbol',
        text: 'At least 1 symbol',
        test: (value) => /[^A-Za-z0-9]/.test(value),
    },
];

const strongPasswordSchema = z
    .string()
    .min(1, 'Password is required.')
    .superRefine((value, ctx) => {
        passwordRules.forEach((rule) => {
            if (!rule.test(value)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: rule.text,
                });
            }
        });
    });

export const loginSchema = z.object({
    email: z.string().min(1, 'Email is required.').email('Email is invalid.'),
    password: z.string().min(1, 'Password is required.'),
});

export const signupSchema = z
    .object({
        email: z
            .string()
            .min(1, 'Email is required.')
            .email('Email is invalid.'),
        name: z.string().min(1, 'Name is required.'),
        password: strongPasswordSchema,
        confirmPassword: z.string().min(1, 'Confirm password is required.'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Password is not match.',
    });

export const getPasswordRuleResults = (password = '') =>
    passwordRules.map((rule) => ({
        ...rule,
        isValid: rule.test(password),
    }));
