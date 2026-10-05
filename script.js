// Leveling Up — fluxo: cadastro → plano → pagamento → concluído

const PIX_KEY = "55822830803";

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

// Estado
let step = "cadastro"; // cadastro | plano | pagamento | concluido
let selectedPlan = "institucional";
let customerName = "";
let payMethod = "pix";

const $ = (sel) => document.querySelector(sel);

function chosenPlan() {
  return plans.find((p) => p.id === selectedPlan) || plans[1];
}

function scrollToSignup() {
  $("#cadastro").scrollIntoView({ behavior: "smooth" });
}

// ===== Render: cartões de plano na seção #planos =====
function renderPlansList() {
  const container = $("#plans-list");
  container.innerHTML = "";
  plans.forEach((plan) => {
    const card = document.createElement("article");
    card.className = "plan-card" + (plan.highlighted ? " highlight" : "");
    card.innerHTML = `
      ${plan.highlighted ? '<span class="plan-tag">Mais pedido</span>' : ""}
      <div class="plan-row">
        <h3 class="plan-name">${plan.name}</h3>
        <span class="plan-price">${plan.price}<small>/mês</small></span>
      </div>
      <p class="plan-desc">${plan.description}</p>
      <button type="button" class="plan-btn">Selecionar</button>
    `;
    card.querySelector(".plan-btn").addEventListener("click", () => {
      selectedPlan = plan.id;
      scrollToSignup();
    });
    container.appendChild(card);
  });
}

// ===== Render: opções de plano na etapa 2 =====
function renderPlanOptions() {
  const container = $("#plan-options");
  container.innerHTML = "";
  plans.forEach((plan) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "plan-option" + (selectedPlan === plan.id ? " selected" : "");
    btn.innerHTML = `
      <div class="plan-row">
        <span class="plan-name" style="font-size:1rem">${plan.name}</span>
        <span class="plan-price">${plan.price}<small>/mês</small></span>
      </div>
      <p class="plan-desc" style="margin-top:0.25rem">${plan.description}</p>
    `;
    btn.addEventListener("click", () => {
      selectedPlan = plan.id;
      renderPlanOptions();
    });
    container.appendChild(btn);
  });
}

// ===== Render: indicador de etapas =====
function renderSteps() {
  const order = ["cadastro", "plano", "pagamento", "concluido"];
  const current = order.indexOf(step);
  document.querySelectorAll("#steps .step").forEach((el, i) => {
    el.classList.toggle("active", current >= i);
  });
}

// ===== Troca de etapa =====
function showStep(next) {
  step = next;
  ["cadastro", "plano", "pagamento", "concluido"].forEach((s) => {
    $("#step-" + s).hidden = s !== step;
  });
  renderSteps();

  if (step === "plano") {
    const first = customerName.split(" ")[0];
    $("#plano-greeting").textContent =
      (first ? `Boa, ${first}! ` : "") + "Selecione o plano ideal pro seu negócio.";
    renderPlanOptions();
  }

  if (step === "pagamento") {
    const plan = chosenPlan();
    $("#pay-plan-name").textContent = plan.name;
    $("#pay-plan-price").textContent = plan.price;
    $("#pix-price").textContent = plan.price;
    renderPayMethod();
  }

  if (step === "concluido") {
    const plan = chosenPlan();
    $("#done-summary").textContent =
      `Plano ${plan.name} · ${plan.price}/mês. Nossa equipe confirma o pagamento e entra em contato pelo WhatsApp.`;
  }

  scrollToSignup();
}

// ===== Forma de pagamento =====
function renderPayMethod() {
  document.querySelectorAll(".pay-method").forEach((btn) => {
    btn.classList.toggle("selected", btn.dataset.method === payMethod);
  });
  $("#pay-pix").hidden = payMethod !== "pix";
  $("#pay-card").hidden = payMethod === "pix";
  $("#btn-confirmar").textContent = payMethod === "pix" ? "Já fiz o Pix" : "Pagar agora";
}

// ===== Eventos =====
document.querySelectorAll("[data-scroll-signup]").forEach((btn) =>
  btn.addEventListener("click", scrollToSignup)
);

$("#form-cadastro").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  customerName = String(data.get("name") || "");
  showStep("plano");
});

$("#btn-voltar-cadastro").addEventListener("click", () => showStep("cadastro"));
$("#btn-ir-pagamento").addEventListener("click", () => showStep("pagamento"));
$("#btn-voltar-plano").addEventListener("click", () => showStep("plano"));
$("#btn-confirmar").addEventListener("click", () => showStep("concluido"));
$("#btn-novo").addEventListener("click", () => showStep("cadastro"));

document.querySelectorAll(".pay-method").forEach((btn) =>
  btn.addEventListener("click", () => {
    payMethod = btn.dataset.method;
    renderPayMethod();
  })
);

$("#btn-copy-pix").addEventListener("click", async () => {
  const btn = $("#btn-copy-pix");
  try {
    await navigator.clipboard.writeText(PIX_KEY);
    btn.textContent = "Chave copiada!";
    setTimeout(() => (btn.textContent = "Copiar chave Pix"), 2000);
  } catch {
    btn.textContent = "Copiar chave Pix";
  }
});

// ===== Inicialização =====
$("#year").textContent = new Date().getFullYear();
renderPlansList();
renderSteps();
