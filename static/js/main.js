(function () {
  'use strict';

  var reveals = document.querySelectorAll('.reveal');
  reveals.forEach(function (element, index) {
    setTimeout(function () { element.classList.add('visible'); }, 90 * index);
  });

  var progress = document.querySelector('.progress');
  function updateProgress() {
    var total = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (total > 0 ? window.scrollY / total * 100 : 0) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  var navigation = Array.prototype.slice.call(document.querySelectorAll('.side-nav a'));
  var sections = navigation.map(function (link) {
    return document.querySelector(link.getAttribute('href'));
  }).filter(Boolean);

  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navigation.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach(function (section) { sectionObserver.observe(section); });

    var chartObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('in-view');
      });
    }, { threshold: 0.25 });
    document.querySelectorAll('.chart-card, .ood-chart, .ablation-chart').forEach(function (chart) { chartObserver.observe(chart); });
  } else {
    document.querySelectorAll('.chart-card, .ood-chart, .ablation-chart').forEach(function (chart) { chart.classList.add('in-view'); });
  }

  var copy = document.querySelector('.copy-button');
  if (copy) {
    copy.addEventListener('click', function () {
      var text = document.querySelector('#bibtex code').textContent;
      var done = function () {
        copy.textContent = 'Copied';
        setTimeout(function () { copy.textContent = 'Copy BibTeX'; }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done);
      } else {
        var area = document.createElement('textarea');
        area.value = text;
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        area.remove();
        done();
      }
    });
  }
})();
