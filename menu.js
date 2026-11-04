const items = [
 {id:'flat-white',name:'Flat white',category:'Coffee',cents:380,description:'A double espresso with silky steamed milk.',details:'A smooth, coffee-forward cup with a fine layer of microfoam. A simple companion for a slow morning or an afternoon pause.',ingredients:'Espresso and dairy milk.',serving:'One cup · 180 ml',image:'coffee.jpg',available:true},
 {id:'cappuccino',name:'Cappuccino',category:'Coffee',cents:380,description:'Espresso, steamed milk and a soft layer of foam.',details:'A familiar café favourite: a rich espresso base, warm milk and a generous cap of foam. Enjoy it with something from the bakery.',ingredients:'Espresso and dairy milk.',serving:'One cup · 200 ml',image:'coffee.jpg',available:true},
 {id:'iced-latte',name:'Iced latte',category:'Cold drinks',cents:420,description:'Espresso and chilled milk, poured over ice.',details:'A cool, mellow take on the classic latte. Fresh espresso meets chilled milk and ice for an easy-going refreshment.',ingredients:'Espresso, dairy milk and ice.',serving:'One glass · 350 ml',image:'iced.jpg',available:true},
 {id:'avocado-toast',name:'Avocado & egg toast',category:'Breakfast',cents:950,description:'Toast, smashed avocado and a freshly fried egg.',details:'A slice of toasted bread topped with creamy avocado and a fried egg. A colourful breakfast for a relaxed start to the day.',ingredients:'Bread, avocado, egg, olive oil and seasoning.',serving:'One toast · one egg',image:'toast.jpg',available:true},
 {id:'berry-yoghurt',name:'Berry yoghurt',category:'Breakfast',cents:750,description:'Creamy yoghurt with a seasonal berry topping.',details:'A light breakfast or a sweet little break. Creamy yoghurt is layered with a bright berry topping and served chilled.',ingredients:'Dairy yoghurt and seasonal berries.',serving:'One breakfast pot',image:'granola.jpg',available:true},
 {id:'butter-croissant',name:'Butter croissant',category:'Bakery',cents:320,description:'A golden, flaky croissant. Simple and lovely.',details:'Delicate layers with a buttery centre and a golden finish. Pair one with your favourite coffee for a classic café moment.',ingredients:'Wheat flour, butter, milk, yeast, sugar and egg glaze.',serving:'One pastry',image:'croissant.jpg',available:true},
 {id:'cinnamon-bun',name:'Cinnamon bun',category:'Bakery',cents:420,description:'A soft cinnamon swirl with a light sweet glaze.',details:'A soft, sweet swirl with a cinnamon filling. This item is deliberately unavailable in the demo, so you can see how a sold-out product appears.',ingredients:'Wheat flour, butter, milk, cinnamon, sugar and egg.',serving:'One bun',image:'bun.jpg',available:false},
 {id:'garden-bowl',name:'Garden bowl',category:'Lunch',cents:1150,description:'Mixed leaves, grains and crisp seasonal vegetables.',details:'A generous bowl of grains, greens and crisp vegetables. A fresh, colourful option for a midday pause.',ingredients:'Mixed leaves, grains, seasonal vegetables and house dressing.',serving:'One lunch bowl',image:'salad.jpg',available:true},
 {id:'seasonal-salad',name:'Seasonal salad',category:'Lunch',cents:1050,description:'A colourful selection of crisp vegetables and house dressing.',details:'Seasonal vegetables and fresh leaves with a simple house dressing. The selection shown is illustrative and would follow your business’s own menu.',ingredients:'Mixed leaves, seasonal vegetables and house dressing.',serving:'One salad bowl',image:'salad.jpg',available:true},
 {id:'vanilla-latte',name:'Iced vanilla latte',category:'Cold drinks',cents:450,description:'Espresso, chilled milk and vanilla, served over ice.',details:'A gently sweet iced coffee with vanilla, chilled milk and a fresh shot of espresso. Made for taking your time.',ingredients:'Espresso, dairy milk, vanilla syrup and ice.',serving:'One glass · 350 ml',image:'iced.jpg',available:true}
];
const search = document.getElementById('search');
const grid = document.getElementById('menu-grid');
const filters = [...document.querySelectorAll('[data-category]')];
const productDialog = document.getElementById('product-dialog');
const cartDialog = document.getElementById('cart-dialog');
const detail = document.getElementById('product-detail');
const basket = new Map();
const MAX_QUANTITY = 20;
let category = 'All';
let selectedItem = null;
let selectedQuantity = 1;
let productTrigger = null;
let cartTrigger = null;
let feedbackTimer;
const currency = new Intl.NumberFormat('en-IE', {style:'currency',currency:'EUR'});
const money = cents => currency.format(cents / 100);
const findItem = id => items.find(item => item.id === id);
const totalQuantity = () => [...basket.values()].reduce((sum, qty) => sum + qty, 0);
const totalCents = () => [...basket].reduce((sum, [id, qty]) => sum + findItem(id).cents * qty, 0);

function announce(message) {
 const feedback = document.getElementById('basket-feedback');
 clearTimeout(feedbackTimer);
 feedback.textContent = message;
 feedback.classList.add('visible');
 feedbackTimer = setTimeout(() => feedback.classList.remove('visible'), 3500);
}
function renderMenu() {
 const query = search.value.trim().toLocaleLowerCase('en-IE');
 const results = items.filter(item => (category === 'All' || item.category === category) && `${item.name} ${item.description} ${item.category}`.toLocaleLowerCase('en-IE').includes(query));
 grid.replaceChildren(...results.map(item => {
  const article = document.createElement('article'); article.className = 'menu-card';
  // Interpolated content is fixed local demonstration data, never user input.
  article.innerHTML = `<button type="button" class="product-open" data-product="${item.id}" aria-haspopup="dialog" aria-label="View ${item.name}, ${money(item.cents)}"><img src="assets/${item.image}" alt="Illustrative photograph for ${item.name}" loading="lazy" width="600" height="400"><span class="card-body"><span class="card-category">${item.category}</span><span class="card-heading"><span class="card-name">${item.name}</span><span class="price">${money(item.cents)}</span></span><span class="card-description">${item.description}</span><span class="card-foot"><span class="view-details">View details <span aria-hidden="true">↗</span></span>${item.available ? '' : '<span class="unavailable">Unavailable</span>'}</span></span></button>`;
  return article;
 }));
 document.getElementById('result-count').textContent = `${results.length} ${results.length === 1 ? 'item' : 'items'}${category === 'All' ? '' : ` in ${category}`}${query ? ' matching your search' : ''}`;
 document.getElementById('empty').hidden = results.length > 0;
 filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === category)));
}
function updateBodyLock() { document.body.classList.toggle('dialog-open', productDialog.open || cartDialog.open); }
function updateProductControls() {
 if (!selectedItem) return;
 const alreadyInBasket = basket.get(selectedItem.id) || 0;
 const remaining = MAX_QUANTITY - alreadyInBasket;
 const canAdd = selectedItem.available && remaining > 0;
 selectedQuantity = Math.max(1, Math.min(selectedQuantity, remaining || 1));
 document.getElementById('product-quantity').textContent = selectedQuantity;
 detail.querySelector('[data-product-quantity="minus"]').disabled = !canAdd || selectedQuantity <= 1;
 detail.querySelector('[data-product-quantity="plus"]').disabled = !canAdd || selectedQuantity >= remaining;
 const add = document.getElementById('add-to-basket'); add.disabled = !canAdd;
 add.textContent = !selectedItem.available ? 'Currently unavailable' : remaining === 0 ? 'Maximum quantity in basket' : `Add ${selectedQuantity} to basket · ${money(selectedItem.cents * selectedQuantity)}`;
 document.getElementById('quantity-note').textContent = !selectedItem.available ? 'This item cannot be added while unavailable.' : alreadyInBasket ? `${alreadyInBasket} already in your basket. Maximum ${MAX_QUANTITY} per item.` : `Choose your quantity. Maximum ${MAX_QUANTITY} per item.`;
}
function openProduct(id, trigger) {
 const item = findItem(id); if (!item) return;
 selectedItem = item; selectedQuantity = 1; productTrigger = trigger;
 detail.innerHTML = `<div class="product-photo"><img src="assets/${item.image}" alt="Illustrative photograph for ${item.name}" width="600" height="400"><button type="button" class="close-dialog" data-close-product aria-label="Close product details" autofocus>×</button><span class="photo-demo-label">ILLUSTRATIVE PHOTO</span></div><div class="product-info"><span class="kicker">${item.category} / DEMO ITEM</span><div class="product-title-row"><h2 id="product-title">${item.name}</h2><strong>${money(item.cents)}</strong></div><p class="product-description">${item.details}</p><div class="product-facts"><div><span>PORTION</span><p>${item.serving}</p></div><div><span>EXAMPLE INGREDIENTS</span><p>${item.ingredients}</p></div></div><p class="ingredient-note">Fictional menu information, not a verified allergen guide. A real business would provide its approved ingredients and allergen details.</p><div class="product-purchase"><div class="quantity-control" role="group" aria-label="Choose quantity"><button type="button" data-product-quantity="minus" aria-label="Decrease quantity">−</button><output id="product-quantity" aria-live="polite">1</output><button type="button" data-product-quantity="plus" aria-label="Increase quantity">+</button></div><button type="button" class="add-to-basket" id="add-to-basket">Add to basket</button></div><p id="quantity-note" class="quantity-note"></p><p class="simulation-note">A demo basket only. No order or payment will be processed.</p></div>`;
 updateProductControls(); productDialog.showModal(); updateBodyLock();
}
function updateBasketIndicators() {
 const count = totalQuantity();
 document.querySelectorAll('[data-cart-count]').forEach(element => { element.textContent = count; });
 document.querySelectorAll('[data-open-cart]').forEach(button => button.setAttribute('aria-label', `View basket, ${count} ${count === 1 ? 'item' : 'items'}`));
 document.querySelector('.floating-basket').hidden = count === 0;
 document.getElementById('floating-total').textContent = money(totalCents());
}
function renderBasket(focusAction) {
 const content = document.getElementById('cart-content');
 if (basket.size === 0) {
  content.innerHTML = '<div class="basket-empty"><span aria-hidden="true">♡</span><h3>A little room for something lovely.</h3><p>Your basket is empty. Explore the menu and add something you fancy.</p><button type="button" class="continue-browsing" data-close-cart>Explore the menu</button></div>';
 } else {
  content.innerHTML = `<p class="basket-count">${totalQuantity()} ${totalQuantity() === 1 ? 'item' : 'items'} in your demo basket</p><div class="basket-items">${[...basket].map(([id, qty]) => {
   const item = findItem(id);
   return `<article class="basket-item"><img src="assets/${item.image}" alt="" width="88" height="88"><div class="basket-item-body"><h3>${item.name}</h3><p>${money(item.cents)} each</p><div class="basket-item-controls"><div class="quantity-control" role="group" aria-label="Quantity for ${item.name}"><button type="button" data-cart-action="minus" data-id="${id}" aria-label="Decrease ${item.name} quantity" ${qty <= 1 ? 'disabled' : ''}>−</button><output aria-label="${item.name} quantity">${qty}</output><button type="button" data-cart-action="plus" data-id="${id}" aria-label="Increase ${item.name} quantity" ${qty >= MAX_QUANTITY ? 'disabled' : ''}>+</button></div><button type="button" class="remove-item" data-cart-action="remove" data-id="${id}" aria-label="Remove ${item.name}">Remove</button></div></div><strong class="line-total">${money(item.cents * qty)}</strong></article>`;
  }).join('')}</div><div class="basket-summary"><div><h3>Demo total</h3><strong>${money(totalCents())}</strong></div><p>Sum of the displayed item prices. This is a browsing simulation, not a checkout. No delivery charges or other fees are calculated.</p><button type="button" class="continue-browsing" data-close-cart>Continue browsing <span aria-hidden="true">↗</span></button><button type="button" class="clear-basket" data-cart-action="clear">Clear basket</button></div>`;
 }
 if (focusAction) {
  const target = [...content.querySelectorAll('[data-cart-action]')].find(button => button.dataset.id === focusAction.id && button.dataset.cartAction === focusAction.action && !button.disabled);
  (target || content.querySelector('.continue-browsing') || cartDialog.querySelector('[data-close-cart]')).focus();
 }
}
function openBasket(trigger) { cartTrigger = trigger; renderBasket(); cartDialog.showModal(); updateBodyLock(); }
grid.addEventListener('click', event => { const button = event.target.closest('[data-product]'); if (button) openProduct(button.dataset.product, button); });
detail.addEventListener('click', event => {
 const button = event.target.closest('button'); if (!button || button.disabled) return;
 if (button.hasAttribute('data-close-product')) productDialog.close();
 if (button.dataset.productQuantity) { selectedQuantity += button.dataset.productQuantity === 'plus' ? 1 : -1; updateProductControls(); }
 if (button.id === 'add-to-basket' && selectedItem?.available) {
  const current = basket.get(selectedItem.id) || 0;
  const added = Math.min(selectedQuantity, MAX_QUANTITY - current); if (added <= 0) return;
  basket.set(selectedItem.id, current + added); updateBasketIndicators(); productDialog.close();
  announce(`${added} × ${selectedItem.name} added to your demo basket.`);
 }
});
document.querySelectorAll('[data-open-cart]').forEach(button => button.addEventListener('click', () => openBasket(button)));
cartDialog.addEventListener('click', event => {
 const button = event.target.closest('button'); if (!button || button.disabled) return;
 if (button.hasAttribute('data-close-cart')) { cartDialog.close(); return; }
 const { cartAction: action, id } = button.dataset; if (!action) return;
 if (action === 'clear') basket.clear();
 else if (action === 'remove') basket.delete(id);
 else if (basket.has(id)) { const quantity = basket.get(id) + (action === 'plus' ? 1 : -1); if (quantity >= 1 && quantity <= MAX_QUANTITY) basket.set(id, quantity); }
 updateBasketIndicators(); renderBasket({id, action});
 announce(action === 'clear' ? 'Demo basket cleared.' : action === 'remove' ? 'Item removed from your demo basket.' : 'Demo basket quantity updated.');
});
// Native dialogs handle focus trapping and Escape; restore the activating control.
for (const [dialog, getTrigger] of [[productDialog, () => productTrigger], [cartDialog, () => cartTrigger]]) {
 dialog.addEventListener('close', () => {
  updateBodyLock(); const trigger = getTrigger();
  if (trigger?.isConnected && !trigger.hidden) trigger.focus(); else document.querySelector('.basket-toggle').focus();
 });
 dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
 });
}
filters.forEach(button => button.addEventListener('click', () => { category = button.dataset.category; renderMenu(); }));
search.addEventListener('input', renderMenu);
document.getElementById('clear').addEventListener('click', () => { category = 'All'; search.value = ''; renderMenu(); search.focus(); });
renderMenu(); updateBasketIndicators();
