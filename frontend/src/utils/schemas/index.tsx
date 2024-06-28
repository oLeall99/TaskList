import { z } from 'zod';

export const schemaLogin = z.object({
    email: z.string()
        .email("Digite um email válido.")
        .refine(value => value.trim().length > 0, { message: "Campo Obrigatório." }),
    password: z.string()
        .min(6, "Senha deve ter pelo menos 6 caracteres.")
        .refine(value => value.trim().length > 0, { message: "Campo Obrigatório." }),
});

export type FormLoginData = z.infer<typeof schemaLogin>;

export const schemaSignUp = z.object({
    name: z.string()
        .refine(value => value.trim().length > 0, { message: "Campo Obrigatório." }),
    email: z.string()
        .email("Digite um email válido.")
        .refine(value => value.trim().length > 0, { message: "Campo Obrigatório." }),
    password: z.string()
        .min(6, "Senha deve ter pelo menos 6 caracteres.")
        .refine(value => value.trim().length > 0, { message: "Campo Obrigatório." }),
});

export type FormSignUpData = z.infer<typeof schemaSignUp>;


export const schemaSearch =  z.object({
    search: z.string(),
    pendente: z.boolean(),
    emAndamento: z.boolean(),
    concluido: z.boolean(),
    time: z.enum(["new", "old"], { message: "Selecione uma opção válida" }),
  }).refine(data => data.pendente || data.emAndamento || data.concluido, {
    message: "Selecione pelo menos um status",
    path: ["status"]
  });

export type FormSearchData = z.infer<typeof schemaSearch>;

export const schemaNewTask =  z.object({
    title: z.string().min(3).refine(value => value.trim().length > 0, { message: "Campo Obrigatório." }),
    desc: z.string().refine(value => value.trim().length > 0, { message: "Campo Obrigatório." }),
  });

export type FormNewTaskData = z.infer<typeof schemaNewTask>;

export const schemaEditTask =  z.object({
  title: z.string().optional(),
  desc: z.string().optional(),
  status: z.number().optional(),
});

export type FormEditTaskData = z.infer<typeof schemaEditTask>;

export const schemaPaswordChange =  z.object({
  oldPassword: z.string().refine(value => value.trim().length > 0, { message: "Campo Obrigatório." }),
  password: z.string().min(6).refine(value => value.trim().length > 0, { message: "Campo Obrigatório." }),
  confirmPassword: z.string().min(6).refine(value => value.trim().length > 0, { message: "Campo Obrigatório." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas devem ser iguais.",
  path: ["confirmPassword"],
});

export type FormPasswordChangeData = z.infer<typeof schemaPaswordChange>;

export const schemaUserChange =  z.object({
  name: z.string(),
  email: z.string().email("Digite um email válido."),
});

export type FormUserChangeData = z.infer<typeof schemaUserChange>;