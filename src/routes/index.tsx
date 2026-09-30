import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";

const plans = [
  {
    id: "landing",
    name: "Landing Page",
    price: "R$ 89",
    description: "Página única com formulário, WhatsApp e domínio próprio. Ideal pra lançar sua marca.",
    highlighted: false,
  },
  {
    id: "institucional",
    name: "Site Institucional",
    price: "R$ 189",
    description: "Múltiplas páginas, portfólio, blog e otimização para buscas.",
    highlighted: true,
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    price: "R$ 349",
    description: "Loja completa, carrinho, pagamentos e gestão de pedidos.",
    highlighted: false,
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Leveling Up — Sua loja no digital" },
      { name: "description", content: "Leveling Up coloca pequenas empresas no digital com site, vitrine e vendas. Cadastro simples, planos acessíveis e atendimento humano." },
      { property: "og:title", content: "Leveling Up — Sua loja no digital" },
      { property: "og:description", content: "Leveling Up coloca pequenas empresas no digital com site, vitrine e vendas. Cadastro simples, planos acessíveis e atendimento humano." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const PIX_KEY = "55822830803";

function Index() {
  const [selectedPlan, setSelectedPlan] = useState<string>(plans[1]?.id ?? "institucional");
  const [step, setStep] = useState<"cadastro" | "plano" | "pagamento" | "concluido">("cadastro");
  const [customerName, setCustomerName] = useState("");
  const [payMethod, setPayMethod] = useState<"pix" | "credito" | "debito">("pix");
  const [copied, setCopied] = useState(false);
  const signupRef = useRef<HTMLElement>(null);

  const chosenPlan = plans.find((p) => p.id === selectedPlan) ?? plans[1]!;

  const scrollToSignup = () => {
    signupRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePlanSelect = (id: string) => {
    setSelectedPlan(id);
    scrollToSignup();
  };

  const copyPix = async () => {
    try {
      await navigator.clipboard.writeText(PIX_KEY);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setCustomerName(String(data.get("name") ?? ""));
    setStep("plano");
    scrollToSignup();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Aurora background blobs */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="aur absolute -top-24 -left-20 h-80 w-80 rounded-full bg-violet/40 blur-[90px]" />
        <div
          className="aur absolute -top-10 -right-16 h-72 w-72 rounded-full bg-teal/35 blur-[90px]"
          style={{ animationDelay: "-7s" }}
        />
        <div
          className="aur absolute bottom-[-80px] left-1/4 h-80 w-80 rounded-full bg-pink/30 blur-[100px]"
          style={{ animationDelay: "-13s" }}
        />
        <div
          className="aur absolute top-1/3 right-10 h-64 w-64 rounded-full bg-sky/25 blur-[90px]"
          style={{ animationDelay: "-4s" }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col px-5 pb-10 pt-6 md:max-w-2xl">
        {/* Header */}
        <header className="sticky top-0 z-50 -mx-5 px-5 py-3">
          <div className="flex items-center justify-between rounded-2xl bg-background/80 px-4 py-3 ring-1 ring-border backdrop-blur-[16px]">
            <Link to="/" className="flex items-center gap-2">
              <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-violet to-teal font-display text-sm font-bold text-ink">
                Lu
              </div>
              <span className="font-display text-lg font-semibold tracking-tight">
                Leveling up
              </span>
            </Link>
            <button
              type="button"
              onClick={scrollToSignup}
              className="glass rounded-full px-4 py-2 text-sm font-medium transition hover:bg-white/[0.08]"
            >
              Entrar
            </button>
          </div>
        </header>

        {/* Hero */}
        <section className="mt-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.05] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
            <span className="size-1.5 rounded-full bg-primary" />
            Rola pro digital
          </span>

          <h1 className="mt-5 font-display text-[42px] font-semibold leading-[1.02] tracking-tight md:text-6xl">
            Seu negócio sobe de{" "}
            <span className="bg-gradient-to-r from-violet via-sky to-teal bg-clip-text text-transparent">
              nível
            </span>{" "}
            pro digital.
          </h1>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            Cadastro em 2 minutos, plano sob medida e seu site no ar. Feito para
            pequenas empresas que querem expandir.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={scrollToSignup}
              className="flex-1 rounded-xl bg-gradient-to-r from-violet to-teal px-5 py-3.5 text-[15px] font-semibold text-primary-foreground transition hover:brightness-110"
            >
              Criar conta grátis
            </button>
            <a
              href="#planos"
              className="glass flex flex-1 items-center justify-center rounded-xl px-5 py-3.5 text-[15px] font-semibold transition hover:bg-white/[0.08]"
            >
              Ver planos
            </a>
          </div>
        </section>

        {/* Plans */}
        <section id="planos" className="mt-14 scroll-mt-28">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Escolha seu plano
            </h2>
            <span className="text-xs text-muted-foreground">
              a partir de R$ 89/mês
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {plans.map((plan) => (
              <article
                key={plan.id}
                className={`relative rounded-2xl p-5 transition ${
                  plan.highlighted
                    ? "border border-primary/40 bg-primary/10"
                    : "glass"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-2.5 right-4 rounded-full bg-gradient-to-r from-primary to-sky px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                    Mais pedido
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold">
                    {plan.name}
                  </h3>
                  <span className="text-sm font-semibold text-foreground/90">
                    {plan.price}
                    <small className="text-foreground/50">/mês</small>
                  </span>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {plan.description}
                </p>
                <button
                  type="button"
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`mt-4 w-full rounded-lg py-2.5 text-sm font-semibold transition ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-primary to-sky text-primary-foreground hover:brightness-110"
                      : "border border-border bg-transparent hover:bg-white/[0.05]"
                  }`}
                >
                  Selecionar
                </button>
              </article>
            ))}
          </div>
        </section>

        {/* Signup */}
        <section
          id="cadastro"
          ref={signupRef}
          className="mt-14 scroll-mt-28"
        >
          <div className="glass rounded-2xl p-6">
            {/* Steps indicator */}
            <div className="mb-5 flex items-center gap-2">
              {[
                { id: "cadastro", label: "Cadastro" },
                { id: "plano", label: "Plano" },
                { id: "pagamento", label: "Pagamento" },
              ].map((s, i) => {
                const order = ["cadastro", "plano", "pagamento", "concluido"];
                const active = order.indexOf(step) >= i;
                return (
                  <div key={s.id} className="flex flex-1 items-center gap-2">
                    <span
                      className={`grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                        active
                          ? "bg-gradient-to-r from-violet to-teal text-primary-foreground"
                          : "border border-border text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={`text-[11px] font-medium ${
                        active ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {step === "cadastro" && (
              <>
                <h2 className="font-display text-2xl font-semibold tracking-tight">
                  Crie sua conta
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Preencha seus dados para começar. Na próxima etapa você escolhe o plano.
                </p>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">
                      Nome completo
                    </span>
                    <input
                      required
                      name="name"
                      type="text"
                      placeholder="Maria Souza"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">
                      Nome do negócio
                    </span>
                    <input
                      required
                      name="business"
                      type="text"
                      placeholder="Doceria da Ana"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">
                      WhatsApp
                    </span>
                    <input
                      required
                      name="phone"
                      type="tel"
                      placeholder="(11) 93735-5412"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </label>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-violet to-teal py-3.5 text-[15px] font-semibold text-primary-foreground transition hover:brightness-110"
                  >
                    Continuar para os planos
                  </button>
                </form>
              </>
            )}

            {step === "plano" && (
              <>
                <h2 className="font-display text-2xl font-semibold tracking-tight">
                  Escolha seu plano
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {customerName ? `Boa, ${customerName.split(" ")[0]}! ` : ""}
                  Selecione o plano ideal pro seu negócio.
                </p>

                <div className="mt-5 space-y-3">
                  {plans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`w-full rounded-xl border p-4 text-left transition ${
                        selectedPlan === plan.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-display text-base font-semibold">
                          {plan.name}
                        </span>
                        <span className="text-sm font-semibold">
                          {plan.price}
                          <small className="text-foreground/50">/mês</small>
                        </span>
                      </div>
                      <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                        {plan.description}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("cadastro")}
                    className="rounded-xl border border-border px-4 py-3 text-sm font-semibold transition hover:bg-white/[0.05]"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("pagamento")}
                    className="flex-1 rounded-xl bg-gradient-to-r from-violet to-teal py-3 text-[15px] font-semibold text-primary-foreground transition hover:brightness-110"
                  >
                    Ir para o pagamento
                  </button>
                </div>
              </>
            )}

            {step === "pagamento" && (
              <>
                <h2 className="font-display text-2xl font-semibold tracking-tight">
                  Finalizar pagamento
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Plano{" "}
                  <span className="font-semibold text-foreground">
                    {chosenPlan.name}
                  </span>{" "}
                  — {chosenPlan.price}/mês
                </p>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  {([
                    { id: "pix", label: "Pix" },
                    { id: "credito", label: "Crédito" },
                    { id: "debito", label: "Débito" },
                  ] as const).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPayMethod(m.id)}
                      className={`rounded-lg border py-3 text-xs font-semibold transition ${
                        payMethod === m.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:bg-white/[0.05]"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {payMethod === "pix" ? (
                  <div className="mt-5 rounded-xl border border-border bg-white/[0.05] p-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      Chave Pix
                    </p>
                    <p className="mt-1 font-display text-lg font-semibold tracking-tight">
                      {PIX_KEY}
                    </p>
                    <button
                      type="button"
                      onClick={copyPix}
                      className="mt-3 w-full rounded-lg border border-border py-2.5 text-sm font-semibold transition hover:bg-white/[0.08]"
                    >
                      {copied ? "Chave copiada!" : "Copiar chave Pix"}
                    </button>
                    <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
                      Faça o Pix no valor de {chosenPlan.price} e confirme abaixo.
                      Enviaremos o comprovante e os próximos passos pelo WhatsApp.
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 space-y-3 rounded-xl border border-border bg-white/[0.05] p-4">
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium">
                        Número do cartão
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="0000 0000 0000 0000"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-medium">
                          Validade
                        </span>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-medium">
                          CVV
                        </span>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
                        />
                      </label>
                    </div>
                  </div>
                )}

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("plano")}
                    className="rounded-xl border border-border px-4 py-3 text-sm font-semibold transition hover:bg-white/[0.05]"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("concluido")}
                    className="flex-1 rounded-xl bg-gradient-to-r from-violet to-teal py-3 text-[15px] font-semibold text-primary-foreground transition hover:brightness-110"
                  >
                    {payMethod === "pix" ? "Já fiz o Pix" : "Pagar agora"}
                  </button>
                </div>
              </>
            )}

            {step === "concluido" && (
              <div className="rounded-xl border border-primary/30 bg-primary/10 p-5 text-center">
                <p className="text-lg font-semibold text-primary">
                  Pedido recebido!
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Plano {chosenPlan.name} · {chosenPlan.price}/mês. Nossa equipe
                  confirma o pagamento e entra em contato pelo WhatsApp.
                </p>
                <button
                  type="button"
                  onClick={() => setStep("cadastro")}
                  className="mt-4 rounded-lg border border-border px-4 py-2 text-sm font-semibold transition hover:bg-white/[0.05]"
                >
                  Fazer novo cadastro
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Contact */}
        <section id="contato" className="mt-14 scroll-mt-28">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold tracking-tight">
                Fale com a gente
              </h2>
              <span className="text-[11px] text-muted-foreground">
                seg–sex, 9h–18h
              </span>
            </div>

            <div className="mt-5 space-y-3">
              <a
                href="tel:+5511937355412"
                className="flex items-center gap-3 rounded-xl border border-border bg-white/[0.05] p-3 transition hover:bg-white/[0.08]"
              >
                <span className="grid size-10 place-items-center rounded-lg bg-violet/20 text-violet">
                  ✆
                </span>
                <span className="text-sm font-medium">11 93735-5412</span>
              </a>

              <a
                href="mailto:levelingup@gmail.com"
                className="flex items-center gap-3 rounded-xl border border-border bg-white/[0.05] p-3 transition hover:bg-white/[0.08]"
              >
                <span className="grid size-10 place-items-center rounded-lg bg-primary/20 text-primary">
                  ✉
                </span>
                <span className="text-sm font-medium">
                  levelingup@gmail.com
                </span>
              </a>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
              <span className="text-xs text-muted-foreground">
                Pagamos em:
              </span>
              <span className="rounded-md bg-white/10 px-2 py-1 text-xs font-semibold">
                Pix
              </span>
              <span className="rounded-md bg-white/10 px-2 py-1 text-xs font-semibold">
                Crédito
              </span>
              <span className="rounded-md bg-white/10 px-2 py-1 text-xs font-semibold">
                Débito
              </span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-sm font-semibold">Fundadores</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Miguel, Pedro, Igor, Palácio e Danilo
          </p>
          <p className="mt-6 text-[11px] text-muted-foreground/70">
            © {new Date().getFullYear()} Leveling up — sites que fazem sua
            empresa subir de nível.
          </p>
        </footer>
      </div>
    </div>
  );
}
