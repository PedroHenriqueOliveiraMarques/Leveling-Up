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
      <a class="example-link" href="#exemplo/${plan.id}">Ver exemplo e benefícios →</a>
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
    const link = document.createElement("a");
    link.className = "example-link";
    link.href = "#exemplo/" + plan.id;
    link.textContent = "Ver exemplo de " + plan.name + " →";
    container.appendChild(link);
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

const exampleImages = {"landing": "https://smallbiz-skyrocket.lovable.app/__l5e/assets-v1/66473a6d-ddca-4771-b45d-09aedbff5d5c/example-bakery.jpg", "institucional": "https://smallbiz-skyrocket.lovable.app/__l5e/assets-v1/0b77e140-100d-4638-a652-8f9057c0a442/example-studio.jpg", "ecommerce": "https://smallbiz-skyrocket.lovable.app/__l5e/assets-v1/4ac1b763-66cb-4582-bb67-d67be330529d/example-shop.jpg"};

// Páginas de exemplo: o cadastro permanece no DOM; demos só usam memória.
const exampleCatalog = {
 landing: {brand:'Doce encontro', subtitle:'Bolos artesanais para celebrar seus melhores momentos.', audience:'Para quem quer divulgar um serviço, lançar uma marca e receber contatos em uma única página.', benefits:[['Tudo em uma página','Apresente sua marca e sua oferta em um só lugar.'],['Formulário e WhatsApp','Dê ao visitante caminhos diretos para entrar em contato.'],['Domínio próprio','Tenha um endereço com o nome do seu negócio.']]},
 institucional: {brand:'Forma arquitetura',subtitle:'Espaços pensados para a vida acontecer.',audience:'Para empresas que precisam apresentar seus serviços, projetos e conhecimento com mais profundidade.',benefits:[['Múltiplas páginas','Organize a apresentação da empresa e seus serviços.'],['Portfólio e blog','Mostre seus trabalhos e compartilhe conteúdos do seu setor.'],['Otimização para buscas','Prepare seu conteúdo para ser encontrado nos buscadores, sem garantia de posição.']]},
 ecommerce: {brand:'Verde cotidiano',subtitle:'Pequenas escolhas. Um novo cotidiano.',audience:'Para negócios que querem apresentar produtos e organizar suas vendas online.',benefits:[['Loja e carrinho','Apresente produtos e permita montar uma compra.'],['Pagamentos','Ofereça uma etapa de pagamento na sua loja.'],['Gestão de pedidos','Organize as compras recebidas e acompanhe os pedidos.']]}
};
const demoProducts=[{name:'Garrafa térmica',price:79},{name:'Caneca cerâmica',price:39},{name:'Ecobag de algodão',price:49}];
let exampleId='', exampleTab='Projetos', demoCart=[0,0,0], previousFocus=null;
const money=value=>'R$ '+value.toFixed(2).replace('.',',');
function demoForm(label){return `<form id="demo-form" class="demo-form"><label>Nome<input name="name" required autocomplete="off"></label><label>Sua mensagem<textarea name="message" rows="3" required></textarea></label><button class="demo-button" type="submit">${label} →</button></form>`;}
function demoStatus(text){$('#demo-status').textContent=text;}
function renderExample(){
 const item=exampleCatalog[exampleId], plan=plans.find(p=>p.id===exampleId);
 const tabContent={Projetos:'<h2>Residência Jardim</h2><p>Um projeto residencial que combina luz natural, materiais acolhedores e espaços de convivência. Interiores · Projeto demonstrativo.</p>',Sobre:'<h2>Um olhar atento ao seu espaço</h2><p>A Forma é um estúdio fictício dedicado a criar espaços que refletem a personalidade de quem vive neles. Cada projeto começa pela escuta.</p>',Serviços:'<h2>Do conceito aos detalhes</h2><div class="demo-grid"><div><h3>Interiores</h3><p>Ambientes com identidade e funcionalidade.</p></div><div><h3>Arquitetura residencial</h3><p>Projetos pensados para a sua rotina.</p></div><div><h3>Consultoria</h3><p>Um novo olhar para o espaço que você já tem.</p></div></div>',Blog:'<h2>Ideias para morar melhor</h2><article><p>Interiores · Leitura de exemplo</p><h3>Como aproveitar a luz natural em casa</h3><p>Posicionar os móveis perto das janelas e manter áreas de passagem livres ajuda a luz a circular. Tecidos leves e uma escolha cuidadosa de materiais deixam o ambiente mais agradável.</p></article>',Contato:'<h2>Vamos conversar sobre seu projeto?</h2>'+demoForm('Enviar mensagem')};
 $('#example-page').innerHTML=`<a class="example-back" href="#planos">← Voltar aos planos</a><div class="example-heading"><div><p class="muted-sm">Leveling Up / Exemplos de sites</p><h1 tabindex="-1">Exemplo de ${plan.name}</h1><p class="muted">${item.audience}</p></div><p class="example-price">${plan.price}<small>/mês</small></p></div><section class="example-benefits"><h2>Benefícios do plano</h2><div class="demo-grid">${item.benefits.map(([title,text])=>`<div><h3>✓ ${title}</h3><p>${text}</p></div>`).join('')}</div></section><p class="demo-notice">Empresa e conteúdo fictícios. Demonstração sem envio de dados, pedidos ou cobrança. O site contratado será personalizado para o seu negócio.</p><section class="demo-site" aria-label="Site de exemplo: ${item.brand}"><header class="demo-header"><strong>${item.brand}.</strong>${exampleId==='institucional'?`<nav aria-label="Páginas do exemplo">${Object.keys(tabContent).map(t=>`<button class="demo-nav ${t===exampleTab?'active':''}" data-tab="${t}">${t}</button>`).join('')}</nav>`:exampleId==='ecommerce'?`<button class="demo-nav" id="open-cart">Carrinho (${demoCart.reduce((a,b)=>a+b,0)})</button>`:'<span>Confeitaria artesanal</span>'}</header>${exampleId!=='institucional'||exampleTab==='Projetos'?`<div class="demo-hero"><img src="${exampleImages[exampleId]}" alt="${exampleId==='landing'?'Bolo artesanal de morango':exampleId==='institucional'?'Sala de estar projetada pelo estúdio fictício':'Garrafa, caneca e ecobag da loja fictícia'}"><div class="demo-hero-copy"><h2>${item.brand}</h2><p>${item.subtitle}</p><button class="demo-button light" id="demo-scroll">${exampleId==='landing'?'Encomendar um bolo':exampleId==='institucional'?'Conheça o projeto':'Ver produtos'} →</button></div></div>`:''}<div id="demo-details" class="demo-details">${exampleId==='landing'?`<h2>Um doce para cada ocasião</h2><p>Bolos de aniversário, presentes e celebrações. Conte a sua ideia e vamos preparar algo especial para você.</p><div class="demo-grid"><p>✓ Ingredientes selecionados</p><p>✓ Produção artesanal</p><p>✓ Feito sob encomenda</p></div>${demoForm('Solicitar orçamento')}<button class="demo-nav" id="demo-whatsapp">Contato pelo WhatsApp</button>`:exampleId==='institucional'?tabContent[exampleTab]:`<h2>Nossa seleção</h2><p>Produtos e valores fictícios para demonstração.</p><div class="demo-grid">${demoProducts.map((p,i)=>`<article class="demo-product"><span aria-hidden="true">♧</span><h3>${p.name}</h3><p>${money(p.price)}</p><button class="demo-button" data-add="${i}">＋ Adicionar</button></article>`).join('')}</div>`}<p role="status" id="demo-status"></p></div><footer class="demo-footer">${item.brand} · Empresa fictícia · Exemplo Leveling Up</footer></section><div class="example-cta"><p class="muted">Gostou deste tipo de site?</p><button class="btn-primary" id="choose-example">Escolher ${plan.name} →</button></div><dialog id="demo-cart" class="demo-cart" aria-label="Carrinho de exemplo"></dialog>`;
 $('#demo-scroll')?.addEventListener('click',()=>$('#demo-details').scrollIntoView({behavior:'smooth'}));
 document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{exampleTab=b.dataset.tab;renderExample();}));
 $('#demo-form')?.addEventListener('submit',e=>{e.preventDefault();demoStatus('Solicitação de exemplo concluída. Nenhum dado foi enviado.');});
 $('#demo-whatsapp')?.addEventListener('click',()=>demoStatus('Este é um exemplo, sem envio de mensagem pelo WhatsApp.'));
 document.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.add);demoCart[i]++;$('#open-cart').textContent=`Carrinho (${demoCart.reduce((a,b)=>a+b,0)})`;demoStatus(demoProducts[i].name+' adicionado ao carrinho de exemplo.');}));
 $('#open-cart')?.addEventListener('click',()=>{previousFocus=document.activeElement;renderCart();$('#demo-cart').showModal();});
 $('#choose-example').addEventListener('click',()=>{selectedPlan=exampleId;if(step==='plano')renderPlanOptions();location.hash='cadastro';});
}
function renderCart(){
 const dialog=$('#demo-cart'), quantity=demoCart.reduce((a,b)=>a+b,0), total=demoProducts.reduce((sum,p,i)=>sum+p.price*demoCart[i],0);
 dialog.innerHTML=`<div class="demo-header"><h2>Carrinho de exemplo</h2><button class="demo-nav" id="close-cart" aria-label="Fechar carrinho">×</button></div>${quantity?demoProducts.map((p,i)=>demoCart[i]?`<div class="cart-row"><span>${p.name}</span><div><button class="demo-nav" data-quantity="${i}" data-delta="-1" aria-label="Remover uma unidade de ${p.name}">−</button><span>${demoCart[i]}</span><button class="demo-nav" data-quantity="${i}" data-delta="1" aria-label="Adicionar uma unidade de ${p.name}">＋</button></div></div>`:'').join('')+`<p class="cart-total">Total: ${money(total)}</p><button class="demo-button" id="finish-demo">Simular finalização</button>`:'<p>Seu carrinho está vazio.</p>'}<p role="status" id="cart-status"></p><p class="demo-notice">Sem cobrança. Os produtos não estão à venda.</p>`;
 $('#close-cart').addEventListener('click',()=>{dialog.close();previousFocus?.focus();});
 document.querySelectorAll('[data-quantity]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.quantity);demoCart[i]=Math.max(0,demoCart[i]+Number(b.dataset.delta));renderCart();$('#open-cart').textContent=`Carrinho (${demoCart.reduce((a,b)=>a+b,0)})`;}));
 $('#finish-demo')?.addEventListener('click',()=>{$('#cart-status').textContent='Compra de exemplo concluída. Nenhum pedido ou pagamento foi realizado.';});
}
function routeExample(){
 const id=location.hash.replace('#exemplo/',''), valid=location.hash.startsWith('#exemplo/')&&Object.hasOwn(exampleCatalog,id);
 $('#home-page').hidden=valid;$('#example-page').hidden=!valid;
 if(valid){exampleId=id;exampleTab='Projetos';demoCart=[0,0,0];renderExample();document.title='Exemplo de '+plans.find(p=>p.id===id).name+' | Leveling Up';window.scrollTo(0,0);$('#example-page h1').focus({preventScroll:true});}
 else{document.title='Leveling Up — Sua loja no digital';if(location.hash==='#cadastro')scrollToSignup();else if(location.hash==='#planos')$('#planos').scrollIntoView();}
}
window.addEventListener('hashchange',routeExample);
routeExample();
