// Srivari Silks starter storefront. Update WHATSAPP_NUMBER before launch.
const WHATSAPP_NUMBER = "91XXXXXXXXXX"; // Replace with your WhatsApp number, country code first, digits only.
const cart = new Map();
const formatINR = value => new Intl.NumberFormat("en-IN", {style:"currency",currency:"INR",maximumFractionDigits:0}).format(value);
const $ = id => document.getElementById(id);
const cartDrawer = $("cartDrawer"), cartOverlay = $("cartOverlay");
$("year").textContent = new Date().getFullYear();

function showToast(message) {
  const toast = $("toast"); toast.textContent = message; toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}
function openCart() { cartDrawer.classList.add("open"); cartOverlay.classList.add("open"); cartDrawer.setAttribute("aria-hidden","false"); }
function closeCart() { cartDrawer.classList.remove("open"); cartOverlay.classList.remove("open"); cartDrawer.setAttribute("aria-hidden","true"); }
$("cartOpen").addEventListener("click", openCart);
$("cartClose").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
document.addEventListener("keydown", e => { if(e.key === "Escape") closeCart(); });

document.querySelectorAll(".add-button").forEach(button => button.addEventListener("click", () => {
  const name = button.dataset.product, price = Number(button.dataset.price);
  const item = cart.get(name) || {name, price, qty:0}; item.qty++; cart.set(name,item);
  renderCart(); showToast(`${name} added to your bag`);
}));
function changeQty(name, delta) {
  const item = cart.get(name); if (!item) return;
  item.qty += delta; if (item.qty <= 0) cart.delete(name);
  renderCart();
}
function renderCart() {
  const count = [...cart.values()].reduce((sum,item)=>sum+item.qty,0);
  const total = [...cart.values()].reduce((sum,item)=>sum+item.qty*item.price,0);
  $("cartCount").textContent = count; $("drawerCount").textContent = `(${count})`; $("cartTotal").textContent = formatINR(total);
  const container = $("cartItems");
  if (!count) { container.innerHTML = '<p class="empty-cart">Your bag is waiting for something beautiful.</p>'; return; }
  container.innerHTML = [...cart.values()].map(item => `<div class="cart-row"><div><strong>${escapeHTML(item.name)}</strong><small>${formatINR(item.price)} each</small></div><div class="quantity"><button aria-label="Remove one ${escapeHTML(item.name)}" data-action="minus" data-name="${escapeHTML(item.name)}">−</button><span>${item.qty}</span><button aria-label="Add one ${escapeHTML(item.name)}" data-action="plus" data-name="${escapeHTML(item.name)}">+</button></div></div>`).join("");
  container.querySelectorAll("button").forEach(button => button.addEventListener("click",()=>changeQty(button.dataset.name,button.dataset.action==="plus"?1:-1)));
}
function escapeHTML(str) { return str.replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch])); }

$("checkout").addEventListener("click", () => {
  if (!cart.size) { showToast("Add a saree to your bag first"); return; }
  if (!/^91\d{10}$/.test(WHATSAPP_NUMBER)) {
    showToast("Set your WhatsApp number in script.js before taking orders");
    alert("To enable ordering, open script.js and replace 91XXXXXXXXXX with your WhatsApp number (91 + 10 digits).");
    return;
  }
  const lines = [...cart.values()].map(item=>`${item.qty} × ${item.name} — ${formatINR(item.qty*item.price)}`);
  const total = [...cart.values()].reduce((sum,item)=>sum+item.qty*item.price,0);
  const message = `Hello Srivari Silks! I'd like to enquire about this order:\n\n${lines.join("\n")}\n\nSubtotal: ${formatINR(total)}\nPlease confirm availability, delivery charges and payment options.`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,"_blank","noopener");
});
$("contactWhatsApp").addEventListener("click", e => {
  e.preventDefault();
  if (!/^91\d{10}$/.test(WHATSAPP_NUMBER)) { alert("Set your WhatsApp number in script.js before launch."); return; }
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello Srivari Silks! I'd like to know more about your saree collection.")}`,"_blank","noopener");
});

document.querySelectorAll(".filter").forEach(button => button.addEventListener("click",()=>{
  document.querySelectorAll(".filter").forEach(item=>item.classList.toggle("active",item===button));
  document.querySelectorAll(".product-card").forEach(card=>card.hidden=button.dataset.filter!=="all"&&card.dataset.category!==button.dataset.filter);
}));
$("menuToggle").addEventListener("click",()=> $("mainNav").classList.toggle("open"));
document.querySelectorAll("#mainNav a").forEach(link=>link.addEventListener("click",()=> $("mainNav").classList.remove("open")));
