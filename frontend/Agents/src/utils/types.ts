import z from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .email()
    .min(4, "You must have at least 4 letters before the @ sign"),
  password: z.string().min(8).max(20),
});

// Use `typeof LoginSchema` with `z.infer`
export type LoginSchemaType = z.infer<typeof LoginSchema>;
