/* ECHO — live chat sim + network canvas + nav, reveals, counters (vanilla, no deps) */
(function () {
  /* watchdog: restarts a stalled animation loop */
  var lastTick = performance.now(), rearmed = false, startLoop = null;
  function beat() { lastTick = performance.now(); rearmed = false; }
  function rearm() { if (startLoop && !rearmed) { rearmed = true; startLoop(); } }
  setInterval(function () {
    if (document.visibilityState === 'visible' && performance.now() - lastTick > 1200) rearm();
  }, 400);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') { lastTick = performance.now(); rearm(); }
  });
  addEventListener('focus', rearm);

  try {
    document.documentElement.classList.add('js');

    /* nav state */
    var nav = document.querySelector('.nav');
    addEventListener('scroll', function () { nav.classList.toggle('scrolled', scrollY > 8); }, { passive: true });

    /* scroll reveals */
    document.querySelectorAll('h2, .feat, .plan, .codecard, .cta-card, blockquote, .chatcard').forEach(function (el) { el.classList.add('reveal'); });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: .15 });
      document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
    } else {
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    }

    /* count-up stats */
    function animateNum(el) {
      var target = parseFloat(el.dataset.target),
          dec = parseInt(el.dataset.decimals || 0, 10),
          suf = el.dataset.suffix || '', t0 = null;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / 1500, 1), e = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * e).toFixed(dec) + suf;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if ('IntersectionObserver' in window) {
      var numIO = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { numIO.unobserve(e.target); animateNum(e.target); } });
      }, { threshold: .6 });
      document.querySelectorAll('.num').forEach(function (el) { numIO.observe(el); });
    } else {
      document.querySelectorAll('.num').forEach(function (el) {
        el.textContent = parseFloat(el.dataset.target).toFixed(parseInt(el.dataset.decimals || 0, 10)) + (el.dataset.suffix || '');
      });
    }

    /* floater parallax via CSS variables */
    addEventListener('mousemove', function (e) {
      var mx = (e.clientX / innerWidth - .5) * 2,
          my = -(e.clientY / innerHeight - .5) * 2;
      document.documentElement.style.setProperty('--mx', mx.toFixed(3));
      document.documentElement.style.setProperty('--my', my.toFixed(3));
    }, { passive: true });

    var y = document.getElementById('y');
    if (y) y.textContent = new Date().getFullYear();

    /* ===== live chat simulation ===== */
    var body = document.getElementById('chatBody'),
        typing = document.getElementById('typing'),
        typingWho = document.getElementById('typingWho');
    if (body && typing) {
      var script = [
        { who: 'Maya', cls: 'w-maya', text: 'ok that’s unfair 😄 ship it' },
        { who: 'Ben',  cls: 'w-ben',  text: 'presence already works??' },
        { who: null,   cls: '',       text: 'receipts too — watch the ticks ✓✓' },
        { who: 'Maya', cls: 'w-maya', text: 'fine. demo approved ✅' }
      ];
      var si = 0;
      function push(step) {
        var m = document.createElement('div');
        m.className = 'msg ' + (step.who ? 'in' : 'out');
        var html = '';
        if (step.who) html += '<span class="who ' + step.cls + '">' + step.who + '</span>';
        html += '<div class="bub">' + step.text + (step.who ? '' : ' <i class="tick">✓✓</i>') + '</div>';
        m.innerHTML = html;
        body.appendChild(m);
        while (body.children.length > 9) body.removeChild(body.firstChild);
        body.scrollTop = body.scrollHeight;
      }
      (function loop() {
        var step = script[si % script.length]; si++;
        setTimeout(function () {
          if (step.who) { typingWho.textContent = step.who; typingWho.className = 'who ' + step.cls; }
          typing.classList.add('on');
          setTimeout(function () {
            typing.classList.remove('on');
            push(step);
            loop();
          }, 1300);
        }, 1600);
      })();
    }
  } catch (e) {}

  /* ========== CANVAS: client nodes pulsing to a server hub ========== */
  try {
    var canvas = document.getElementById('bg');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var DPR = Math.min(window.devicePixelRatio || 1, 2), W, H, nodes = [];
    function rz() {
      W = canvas.width = innerWidth * DPR;
      H = canvas.height = innerHeight * DPR;
      canvas.style.width = innerWidth + 'px';
      canvas.style.height = innerHeight + 'px';
      nodes = [];
      for (var i = 0; i < 14; i++) nodes.push({
        fx: .06 + Math.random() * .88, fy: .08 + Math.random() * .84,
        ph: Math.random() * 6.28, teal: i % 2 === 0
      });
    }
    rz(); addEventListener('resize', rz);

    var pulses = [];
    function frame(now) {
      beat();
      var t = now / 1000;
      ctx.clearRect(0, 0, W, H);
      var hub = [W * .5, H * .46];

      /* edges */
      ctx.lineWidth = 1 * DPR;
      nodes.forEach(function (n) {
        var x = (n.fx + Math.sin(t * .3 + n.ph) * .008) * W,
            y = (n.fy + Math.cos(t * .25 + n.ph) * .008) * H;
        n.x = x; n.y = y;
        ctx.strokeStyle = n.teal ? 'rgba(18,165,148,.14)' : 'rgba(255,107,74,.12)';
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(hub[0], hub[1]); ctx.stroke();
      });

      /* pulses travelling node -> hub and hub -> node */
      if (Math.random() < .05 && pulses.length < 10) {
        var n = nodes[(Math.random() * nodes.length) | 0];
        pulses.push({ n: n, p: 0, out: Math.random() < .4 });
      }
      for (var i = pulses.length - 1; i >= 0; i--) {
        var pu = pulses[i]; pu.p += .012;
        if (pu.p >= 1) { pulses.splice(i, 1); continue; }
        var a = pu.out ? hub : [pu.n.x, pu.n.y],
            b = pu.out ? [pu.n.x, pu.n.y] : hub,
            x = a[0] + (b[0] - a[0]) * pu.p,
            y = a[1] + (b[1] - a[1]) * pu.p;
        ctx.beginPath(); ctx.arc(x, y, 2.4 * DPR, 0, 7);
        ctx.fillStyle = pu.n.teal ? 'rgba(18,165,148,.6)' : 'rgba(255,107,74,.55)';
        ctx.fill();
      }

      /* nodes + hub */
      nodes.forEach(function (n) {
        ctx.beginPath(); ctx.arc(n.x, n.y, 3 * DPR, 0, 7);
        ctx.fillStyle = n.teal ? 'rgba(18,165,148,.5)' : 'rgba(255,107,74,.45)';
        ctx.fill();
      });
      ctx.beginPath(); ctx.arc(hub[0], hub[1], (7 + Math.sin(t * 2) * 1.5) * DPR, 0, 7);
      ctx.fillStyle = 'rgba(16,24,32,.55)'; ctx.fill();
      ctx.beginPath(); ctx.arc(hub[0], hub[1], 13 * DPR, 0, 7);
      ctx.strokeStyle = 'rgba(18,165,148,.35)'; ctx.stroke();

      requestAnimationFrame(frame);
    }
    startLoop = function () { requestAnimationFrame(frame); };
    startLoop();
  } catch (e) {}
})();