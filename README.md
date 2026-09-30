# Leveling Up

Site de vendas para pequenas empresas que querem expandir seus negócios para o digital. O visitante faz o cadastro, escolhe um plano e finaliza o pagamento via Pix ou cartão.

---

## Tecnologias

- [TanStack Start](https://tanstack.com/start) — framework full-stack React
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Lovable](https://lovable.dev) — ambiente de desenvolvimento visual

---

## Requisitos

- Node.js 20+ (recomendado gerenciar com [nvm](https://github.com/nvm-sh/nvm))
- npm, yarn, pnpm ou bun

---

## Rodar localmente

1. Clone o repositório:

   ```sh
   git clone <url-do-repositorio>
   cd <nome-do-repositorio>
   ```

2. Instale as dependências:

   ```sh
   npm i
   ```

3. Inicie o servidor de desenvolvimento:

   ```sh
   npm run dev
   ```

4. Abra [http://localhost:8080](http://localhost:8080) no navegador.

---

## Scripts úteis

| Comando         | Descrição                          |
| --------------- | ---------------------------------- |
| `npm run dev`   | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a build de produção             |
| `npm run start` | Roda a build de produção localmente  |
| `npm run lint`  | Executa o lint                     |

---

## Estrutura principal

- `src/routes/` — páginas e rotas do app
- `src/routes/index.tsx` — landing page com fluxo de cadastro, planos e pagamento
- `src/routes/__root.tsx` — layout raiz, metadados e fontes
- `src/styles.css` — tokens de design, tema escuro e utilidades Tailwind
- `src/router.tsx` — configuração do roteador
- `public/` — assets estáticos

---

## Fluxo do site

1. **Cadastro** — nome, nome do negócio e WhatsApp.
2. **Escolha do plano** — Landing Page, Site Institucional ou E-commerce.
3. **Pagamento** — Pix (chave `55822830803`) ou cartão de crédito/débito.
4. **Confirmação** — resumo da escolha e orientação de contato.

---

## Contato

- WhatsApp: 11 93735-5412
- E-mail: levelingup@gmail.com

---

## Deploy

O projeto pode ser publicado diretamente pelo Lovable ou hospedado em qualquer provedor que suporte aplicações Node.js/edge (Cloudflare, Vercel, Netlify, etc.).
