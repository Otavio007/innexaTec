document.querySelectorAll('[data-service]').forEach(link => {
  link.href = 'https://wa.me/5519995203113?text=' + encodeURIComponent(`Hi Otavio, I'd like a personalised quote for ${link.dataset.service} for my business.`);
});
