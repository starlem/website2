document.getElementById('clickMe').addEventListener('click', function () {
  const p = document.getElementById('clickResult');
  p.textContent = 'Button clicked at ' + new Date().toLocaleTimeString();
});
