function formatCurrency(val) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
}

const budgetData = [
  { id: 'web-dev', item: 'Custom NGO Website (15 Pages)', rate: 1900, qty: 15, type: 'DEVELOPMENT', recurring: false },
  { id: 'analytics', item: 'Basic Analytics Tagging', rate: 0, qty: 1, type: 'INTELLIGENCE', recurring: false }
];

const marketBenchmarks = [
  { id: 'm-dev', item: 'Agency Custom CMS Build', marketRate: 75000, desc: 'Average Agency Quote' }
];

function renderBenchmarks() {
  const container = document.getElementById('optional-items');
  if (!container) return;
  container.innerHTML = '';

  const marketTotal = 75000;

  const displayItems = [...marketBenchmarks, {
    item: 'Total Market Price',
    desc: 'Aggregated Service Cost',
    marketRate: marketTotal,
    isTotal: true
  }];

  displayItems.forEach(item => {
    const div = document.createElement('div');
    div.className = `checkbox-item cursor-default hover:bg-white/[0.05] border-white/5 ${item.isTotal ? 'mt-4 pt-4 border-t border-white/10' : ''}`;
    
    const textColorClass = 'text-electric';

    div.innerHTML = `
      <div class="flex-grow">
        <div class="text-[11px] font-bold ${item.isTotal ? 'text-white' : 'text-white/90'} uppercase tracking-tight">${item.item}</div>
        <div class="text-[9px] text-white/30 font-montserrat">${item.desc}</div>
      </div>
      <div class="text-right">
        <div class="font-space font-bold ${item.isTotal ? 'text-lg' : 'text-base'} ${textColorClass} line-through decoration-white/60 decoration-1">${formatCurrency(item.marketRate)}</div>
        <div class="font-space font-medium text-[8px] uppercase tracking-tighter text-white/50">Market Standard</div>
      </div>
    `;
    container.appendChild(div);
  });
}

function updateBudget() {
  renderBudget(budgetData);
  renderBenchmarks();
  updateCostAdvantage();
}

function updateCostAdvantage() {
  const propTotal = 28500;
  const marketTotal = 75000;
  const savings = Math.round(((marketTotal - propTotal) / marketTotal) * 100);

  const circle = document.getElementById('efficiency-circle');
  const val = document.getElementById('efficiency-value');
  
  if (circle && val) {
    const offset = 364.2 - (364.2 * savings) / 100;
    circle.style.strokeDashoffset = offset;
    val.innerText = savings + "%";
    
    const desc = document.getElementById('efficiency-desc');
    desc.innerText = "Calculated on Total Setup Cost vs Market Standard Agency quotes.";
  }
}

function animateVisionScore() {
  const scoreSpan = document.getElementById('vision-score');
  const gaugeCircle = document.getElementById('gauge-circle');
  if (!scoreSpan || !gaugeCircle || scoreSpan.dataset.animated === 'true') return;

  scoreSpan.dataset.animated = 'true';
  let current = 0;
  const target = 3;
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    
    current = Math.floor(easeProgress * target);
    scoreSpan.innerText = current;
    
    const offset = 502.4 - (502.4 * easeProgress * target) / 10; // Divided by 10 for a 10-point scale or adjusted for visual fullness
    gaugeCircle.style.strokeDashoffset = offset;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update);
}

function renderBudget(data) {
  const tbody = document.getElementById('budget-body');
  if (!tbody) return;
  const currentItems = data;
  let totalOneTime = 0;

  tbody.innerHTML = '';

  currentItems.forEach((row) => {
    const oneTime = row.rate * row.qty;
    const monthly = 0; // Everything is free tier
    const rowTotal = oneTime;

    totalOneTime += oneTime;

    const tr = document.createElement('tr');
    tr.className = 'border-b border-white/5 hover:bg-white/[0.02] transition-colors stagger-item visible';
    
    tr.innerHTML = `
      <td class="py-6 px-4 font-montserrat">
        <div class="font-bold text-white/90 text-sm">${row.item}</div>
        <div class="text-[9px] uppercase tracking-widest text-white/30">${row.type}</div>
      </td>
      <td class="py-6 px-4 font-space font-medium text-xs text-white/60">${formatCurrency(row.rate)}</td>
      <td class="py-6 px-4 font-space font-medium text-sm text-white/80">${formatCurrency(oneTime)}</td>
      <td class="py-6 px-4 font-space font-medium text-sm text-white/80">₹0</td>
      <td class="py-6 px-4 font-space text-right font-bold text-white text-lg">${formatCurrency(rowTotal)}</td>
    `;
    tbody.appendChild(tr);
  });

  const m1El = document.getElementById('m1-total');
  const m2El = document.getElementById('m2-total');
  const grandEl = document.getElementById('grand-total');

  if (m1El) m1El.innerText = formatCurrency(totalOneTime);
  if (m2El) m2El.innerText = "₹0 Monthly";
  if (grandEl) grandEl.innerText = formatCurrency(totalOneTime);
}

function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.id === 'vision-score-section') {
          animateVisionScore();
        }
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
  
  // Direct check for items in viewport on start
  setTimeout(() => {
    document.querySelectorAll('.fade-up').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('visible');
      }
    });
  }, 500);
}

window.addEventListener('load', () => {
  updateBudget();
  initAnimations();
  console.log("Vidya's Kitchen Strategy Proposal Initialized.");
});
