const items = [
 {name:'Flat white',category:'Coffee',price:3.80,description:'A double espresso with silky steamed milk.',image:'coffee.jpg',available:true},
 {name:'Cappuccino',category:'Coffee',price:3.80,description:'Espresso, steamed milk and a soft layer of foam.',image:'coffee.jpg',available:true},
 {name:'Iced latte',category:'Cold drinks',price:4.20,description:'Espresso and chilled milk, poured over ice.',image:'iced.jpg',available:true},
 {name:'Avocado & egg toast',category:'Breakfast',price:9.50,description:'Toast, smashed avocado and a freshly fried egg.',image:'toast.jpg',available:true},
 {name:'Berry yoghurt',category:'Breakfast',price:7.50,description:'Creamy yoghurt with a seasonal berry topping.',image:'granola.jpg',available:true},
 {name:'Butter croissant',category:'Bakery',price:3.20,description:'A golden, flaky croissant. Simple and lovely.',image:'croissant.jpg',available:true},
 {name:'Cinnamon bun',category:'Bakery',price:4.20,description:'A soft cinnamon swirl with a light sweet glaze.',image:'bun.jpg',available:false},
 {name:'Garden bowl',category:'Lunch',price:11.50,description:'Mixed leaves, grains and crisp seasonal vegetables.',image:'salad.jpg',available:true},
 {name:'Seasonal salad',category:'Lunch',price:10.50,description:'A colourful selection of crisp vegetables and house dressing.',image:'salad.jpg',available:true},
 {name:'Iced vanilla latte',category:'Cold drinks',price:4.50,description:'Espresso, chilled milk and vanilla, served over ice.',image:'iced.jpg',available:true}
];
const search = document.getElementById('search');
const grid = document.getElementById('menu-grid');
const filters = [...document.querySelectorAll('[data-category]')];
let category = 'All';
const currency = new Intl.NumberFormat('en-IE', {style:'currency',currency:'EUR'});
function render(){
 const query = search.value.trim().toLocaleLowerCase('en-IE');
 const results = items.filter(item => (category==='All'||item.category===category) && `${item.name} ${item.description} ${item.category}`.toLocaleLowerCase('en-IE').includes(query));
 grid.replaceChildren(...results.map(item => {
  const article=document.createElement('article'); article.className='menu-card';
  // All template content below is local demonstration data, never user input.
  article.innerHTML=`<img src="assets/${item.image}" alt="Illustrative photograph for ${item.name}" loading="lazy" width="600" height="400"><div class="card-body"><span class="card-category">${item.category}</span><div class="card-heading"><h3>${item.name}</h3><span class="price">${currency.format(item.price)}</span></div><p>${item.description}</p>${item.available?'':'<span class="unavailable">Unavailable in this demo</span>'}</div>`;
  return article;
 }));
 document.getElementById('result-count').textContent=`${results.length} ${results.length===1?'item':'items'}${category==='All'?'':` in ${category}`}${query?' matching your search':''}`;
 document.getElementById('empty').hidden=results.length>0;
 filters.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.category===category)));
}
filters.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.category;render();}));
search.addEventListener('input',render);
document.getElementById('clear').addEventListener('click',()=>{category='All';search.value='';render();search.focus();});
render();
