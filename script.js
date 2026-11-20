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

// Contas salvas no Lovable Cloud (chave pública, segura para o navegador)
const sb = window.supabase.createClient(
  "https://icbzsoymtiwkvuiakiwq.supabase.co",
  "sb_publishable_uFHH9jmyIlhvZmdrvzKECQ_SE505I0K"
);
let authMode = "signup";
document.querySelectorAll(".auth-tab").forEach((tab) =>
  tab.addEventListener("click", () => {
    authMode = tab.dataset.mode;
    document.querySelectorAll(".auth-tab").forEach((t) => t.classList.toggle("active", t === tab));
    const signup = authMode === "signup";
    $("#signup-fields").hidden = !signup;
    $("#signup-fields").querySelectorAll("input").forEach((i) => (i.required = signup));
    $("#auth-title").textContent = signup ? "Crie sua conta" : "Entre na sua conta";
    $("#auth-sub").textContent = signup ? "Preencha seus dados para começar. Na próxima etapa você escolhe o plano." : "Use o e-mail e a senha do seu cadastro.";
    $("#auth-submit").textContent = signup ? "Criar conta e escolher plano" : "Entrar";
    $("#auth-error").textContent = "";
  })
);

function authMessage(msg) {
  if (/invalid login/i.test(msg)) return "E-mail ou senha incorretos.";
  if (/not confirmed/i.test(msg)) return "Confirme seu e-mail pelo link que enviamos antes de entrar.";
  if (/already registered/i.test(msg)) return 'Esse e-mail já tem conta. Use "Já tenho conta".';
  if (/password/i.test(msg)) return "A senha precisa ter pelo menos 6 caracteres e não pode ser fácil de adivinhar.";
  return "Não foi possível continuar. Confira o e-mail e tente novamente.";
}

$("#form-cadastro").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const email = String(data.get("email") || "").trim();
  const password = String(data.get("password") || "");
  const btn = $("#auth-submit");
  const label = btn.textContent;
  $("#auth-error").textContent = "";
  btn.disabled = true;
  btn.textContent = "Aguarde...";
  try {
    if (authMode === "signup") {
      customerName = String(data.get("name") || "").trim();
      const { data: res, error } = await sb.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: location.origin + location.pathname,
          data: { name: customerName, business: String(data.get("business") || "").trim(), phone: String(data.get("phone") || "").trim() },
        },
      });
      if (error) throw error;
      if (!res.session) alert("Conta criada! Enviamos um link de confirmação para " + email + ". Confirme para poder entrar depois.");
    } else {
      const { data: res, error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const { data: profile } = await sb.from("profiles").select("name").eq("id", res.user.id).maybeSingle();
      customerName = (profile && profile.name) || "";
    }
    showStep("plano");
  } catch (err) {
    console.error(err);
    $("#auth-error").textContent = authMessage(err && err.message ? err.message : "");
  } finally {
    btn.disabled = false;
    btn.textContent = label;
  }
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
 if(exampleId==='ecommerce'){if(!shop)resetShop();renderShop();}
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
 if(valid){exampleId=id;exampleTab='Projetos';demoCart=[0,0,0];resetShop();renderExample();document.title='Exemplo de '+plans.find(p=>p.id===id).name+' | Leveling Up';window.scrollTo(0,0);$('#example-page h1').focus({preventScroll:true});}
 else{document.title='Leveling Up — Sua loja no digital';if(location.hash==='#cadastro')scrollToSignup();else if(location.hash==='#planos')$('#planos').scrollIntoView();}
}
window.addEventListener('hashchange',routeExample);

// ===== Loja de exemplo (E-commerce): catálogo, filtros, checkout em etapas e painel de pedidos. Tudo só na memória. =====
var shopProducts=[
 {name:'Garrafa térmica 500 ml',cat:'Cozinha',price:79,old:99,rating:4.8,badge:'Mais vendido',desc:'Mantém a bebida gelada por 24 h e quente por 12 h.'},
 {name:'Caneca de cerâmica',cat:'Cozinha',price:39,rating:4.6,desc:'Feita à mão, cada peça tem um acabamento único.'},
 {name:'Ecobag de algodão',cat:'Acessórios',price:49,rating:4.9,badge:'Novo',desc:'Algodão cru resistente, cabe as compras da semana.'},
 {name:'Kit canudos de inox',cat:'Cozinha',price:29,old:35,rating:4.5,desc:'4 canudos, escovinha de limpeza e estojo.'},
 {name:'Vela aromática',cat:'Casa',price:59,rating:4.7,desc:'Cera vegetal com aroma de lavanda, 30 h de queima.'},
 {name:'Vaso de barro',cat:'Casa',price:69,rating:4.4,badge:'Últimas unidades',desc:'Ideal para suculentas e plantas pequenas.'}];
var FREE_SHIPPING=150;
var shop;
function resetShop(){shop={view:'loja',cat:'Todos',q:'',cart:{},step:0,pay:'Pix',toast:'',last:'',orders:[{id:'#1042',client:'Ana S.',total:128,status:'Enviado'},{id:'#1041',client:'Carlos M.',total:79,status:'Entregue'}]};}
function shopTotals(){const items=shopProducts.map((p,i)=>({...p,i,q:shop.cart[i]||0})).filter(p=>p.q>0);const count=items.reduce((s,p)=>s+p.q,0),sub=items.reduce((s,p)=>s+p.q*p.price,0),ship=sub===0||sub>=FREE_SHIPPING?0:15,disc=shop.pay==='Pix'&&shop.step>=3?sub*.05:0;return{items,count,sub,ship,disc,total:sub+ship-disc};}
function shopSummary(t){return `<dl class="shop-summary"><dt>Subtotal</dt><dd>${money(t.sub)}</dd><dt>Frete</dt><dd>${t.ship?money(t.ship):'Grátis'}</dd>${t.disc?`<dt>Desconto Pix</dt><dd>− ${money(t.disc)}</dd>`:''}<dt><b>Total</b></dt><dd><b>${money(t.total)}</b></dd></dl>`;}
function shopGrid(){const list=shopProducts.map((p,i)=>({...p,i})).filter(p=>(shop.cat==='Todos'||p.cat===shop.cat)&&p.name.toLowerCase().includes(shop.q.toLowerCase()));
 return list.length?list.map(p=>{const q=shop.cart[p.i]||0;return `<article class="shop-card"><div class="shop-card-top"><span aria-hidden="true">📦</span>${p.badge?`<em>${p.badge}</em>`:''}</div><h3>${p.name}</h3><small>★ ${p.rating.toFixed(1).replace('.',',')} · ${p.cat}</small><p>${p.desc}</p><div class="shop-price">${p.old?`<s>${money(p.old)}</s> `:''}<b>${money(p.price)}</b><small>ou 3x de ${money(p.price/3)} sem juros</small></div>${q?`<div class="shop-qty"><button class="demo-nav" data-shop-q="${p.i}" data-d="-1" aria-label="Remover uma unidade de ${p.name}">−</button><span>${q} no carrinho</span><button class="demo-nav" data-shop-q="${p.i}" data-d="1" aria-label="Adicionar uma unidade de ${p.name}">＋</button></div>`:`<button class="demo-button" data-shop-add="${p.i}">＋ Adicionar ao carrinho</button>`}</article>`;}).join(''):'<p>Nenhum produto encontrado.</p>';}
function shopDrawer(){const t=shopTotals(),s=shop.step;if(!s)return'';
 const steps=s<4?`<ol class="shop-steps">${['Carrinho','Entrega','Pagamento'].map((n,i)=>`<li class="${s>=i+1?'on':''}">${i+1}. ${n}</li>`).join('')}</ol>`:'';
 let body='';
 if(s===1)body=t.items.length?t.items.map(p=>`<div class="cart-row"><span>${p.name}<br><small>${money(p.price*p.q)}</small></span><div><button class="demo-nav" data-shop-q="${p.i}" data-d="-1" aria-label="Remover uma unidade de ${p.name}">−</button><span>${p.q}</span><button class="demo-nav" data-shop-q="${p.i}" data-d="1" aria-label="Adicionar uma unidade de ${p.name}">＋</button></div></div>`).join('')+`<p class="shop-free">${t.sub>=FREE_SHIPPING?'Você ganhou frete grátis!':'Faltam '+money(FREE_SHIPPING-t.sub)+' para frete grátis'}</p><div class="shop-bar"><i style="width:${Math.min(100,t.sub/FREE_SHIPPING*100)}%"></i></div>${shopSummary(t)}<button class="demo-button wide" data-shop-step="2">Continuar para entrega →</button>`:'<p>Seu carrinho está vazio.</p><button class="demo-button" data-shop-close="loja">Ver produtos</button>';
 if(s===2)body=`<form class="demo-form" id="shop-ship"><label>Nome completo<input required autocomplete="off"></label><label>CEP<input required inputmode="numeric" placeholder="00000-000" autocomplete="off"></label><label>Endereço e número<input required autocomplete="off"></label><small>Entrega estimada: 3 a 7 dias úteis.</small><div class="shop-row"><button type="button" class="demo-nav" data-shop-step="1">Voltar</button><button class="demo-button" type="submit">Continuar para pagamento →</button></div></form>`;
 if(s===3)body=`<div class="shop-pay">${['Pix','Crédito','Débito'].map(m=>`<button class="demo-nav ${shop.pay===m?'active':''}" data-shop-pay="${m}">${m}</button>`).join('')}</div><p class="shop-hint">${shop.pay==='Pix'?'Pague com Pix e ganhe 5% de desconto.':shop.pay==='Crédito'?'Em até 3x de '+money(t.total/3)+' sem juros.':'Débito à vista.'}</p>${shopSummary(t)}<div class="shop-row"><button class="demo-nav" data-shop-step="2">Voltar</button><button class="demo-button" id="shop-finish">Simular pedido</button></div>`;
 if(s===4)body=`<div class="shop-done"><p class="shop-check">✓</p><h3>Pedido ${shop.last} de exemplo concluído</h3><p>Nenhum pedido ou pagamento foi realizado. Numa loja de verdade, o cliente receberia a confirmação e o pedido apareceria no painel.</p><button class="demo-button" data-shop-close="pedidos">Ver no painel de pedidos</button></div>`;
 return `<div class="shop-overlay" data-shop-close=""><section class="shop-drawer" role="dialog" aria-modal="true" aria-label="Carrinho de exemplo"><div class="demo-header"><h2>${s===4?'Pedido realizado':'Finalizar compra'}</h2><button class="demo-nav" data-shop-close="" aria-label="Fechar carrinho">×</button></div>${steps}${body}<p class="demo-notice">Sem cobrança. Os produtos não estão à venda.</p></section></div>`;}
function renderShop(){const site=$('.demo-site'),item=exampleCatalog.ecommerce,t=shopTotals();
 const main=shop.view==='loja'?`<div class="demo-hero"><img src="${exampleImages.ecommerce}" alt="Garrafa, caneca e ecobag da loja fictícia"><div class="demo-hero-copy"><h2>${item.brand}</h2><p>${item.subtitle}</p><button class="demo-button light" id="shop-scroll">Ver produtos →</button></div></div><div class="shop-trust"><p>🚚 Entrega para todo o Brasil</p><p>🔒 Pagamento seguro</p><p>↺ Troca em até 7 dias</p></div><div class="demo-details" id="shop-catalog"><div class="shop-head"><div><h2>Nossa seleção</h2><p>Produtos e valores fictícios para demonstração.</p></div><input id="shop-search" type="search" placeholder="Buscar produto" aria-label="Buscar produto" value="${shop.q}"></div><div class="shop-cats">${['Todos','Cozinha','Casa','Acessórios'].map(c=>`<button class="demo-nav ${shop.cat===c?'active':''}" data-shop-cat="${c}">${c}</button>`).join('')}</div><div class="shop-grid" id="shop-grid">${shopGrid()}</div>${shop.toast?`<p role="status" class="shop-toast">${shop.toast} <button class="demo-nav" data-shop-step="1">Ver carrinho</button></p>`:''}</div>`
 :`<div class="demo-details"><h2>Painel de pedidos</h2><p>É assim que o dono da loja acompanha as vendas. Pedidos fictícios.</p><div class="demo-grid">${[['Pedidos',shop.orders.length],['Vendas',money(shop.orders.reduce((s,o)=>s+o.total,0))],['A enviar',shop.orders.filter(o=>o.status==='Aguardando pagamento').length]].map(([l,v])=>`<div class="shop-stat"><small>${l}</small><b>${v}</b></div>`).join('')}</div><div class="shop-table"><table><thead><tr><th>Pedido</th><th>Cliente</th><th>Total</th><th>Situação</th></tr></thead><tbody>${shop.orders.map(o=>`<tr><td>${o.id}</td><td>${o.client}</td><td>${money(o.total)}</td><td><em>${o.status}</em></td></tr>`).join('')}</tbody></table></div></div>`;
 site.innerHTML=`<header class="demo-header"><strong>${item.brand}.</strong><nav aria-label="Áreas da loja de exemplo"><button class="demo-nav ${shop.view==='loja'?'active':''}" data-shop-view="loja">Loja</button><button class="demo-nav ${shop.view==='pedidos'?'active':''}" data-shop-view="pedidos">Painel de pedidos</button><button class="demo-nav" data-shop-step="1">🛍 Carrinho (${t.count})</button></nav></header><p class="shop-banner">Frete grátis acima de ${money(FREE_SHIPPING)} · 5% de desconto no Pix</p>${main}<footer class="demo-footer">${item.brand} · Empresa fictícia · Exemplo Leveling Up</footer>${shopDrawer()}`;
}
document.addEventListener('click',e=>{if(!shop||exampleId!=='ecommerce'||!e.target.closest('.demo-site'))return;const b=e.target.closest('[data-shop-add],[data-shop-q],[data-shop-step],[data-shop-view],[data-shop-cat],[data-shop-pay],[data-shop-close],#shop-finish,#shop-scroll');if(!b)return;
 if(b.matches('.shop-overlay')&&e.target!==b)return;
 const d=b.dataset;
 if(b.id==='shop-scroll'){$('#shop-catalog').scrollIntoView({behavior:'smooth'});return;}
 if(d.shopAdd!==undefined){const i=+d.shopAdd;shop.cart[i]=(shop.cart[i]||0)+1;shop.toast=shopProducts[i].name+' adicionado ao carrinho.';}
 if(d.shopQ!==undefined){const i=+d.shopQ;shop.cart[i]=Math.max(0,(shop.cart[i]||0)+ +d.d);}
 if(d.shopStep)shop.step=+d.shopStep;
 if(d.shopView){shop.view=d.shopView;}
 if(d.shopCat)shop.cat=d.shopCat;
 if(d.shopPay)shop.pay=d.shopPay;
 if(d.shopClose!==undefined){shop.step=0;if(d.shopClose)shop.view=d.shopClose;}
 if(b.id==='shop-finish'){const t=shopTotals();shop.last='#'+(1041+shop.orders.length);shop.orders.unshift({id:shop.last,client:'Você (exemplo)',total:t.total,status:'Aguardando pagamento'});shop.cart={};shop.step=4;}
 const y=window.scrollY;renderShop();window.scrollTo(0,y);});
document.addEventListener('submit',e=>{if(e.target.id==='shop-ship'){e.preventDefault();shop.step=3;renderShop();}});
document.addEventListener('input',e=>{if(e.target.id==='shop-search'){shop.q=e.target.value;$('#shop-grid').innerHTML=shopGrid();}});

routeExample();
