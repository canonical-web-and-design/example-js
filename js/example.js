var examples = document.querySelectorAll('.js-example');
examples.forEach(function(example) {
  renderIframe(example);
});

function renderIframe(example) {
  var link = example.href;
  if (!link) { return; }
  var iframe = document.createElement('iframe');
  iframe.src = link;
  iframe.width = '100%';
  iframe.onload = function(loadEvent) {
      this.height = this.contentWindow.document.body.scrollHeight + "px";
  }
  example.parentNode.insertBefore(iframe, example);
  renderCodeBlock(example);
}

function renderCodeBlock(example) {
  var link = example.href;
  var x = new XMLHttpRequest();
  var pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im

  x.onreadystatechange = function() {
    if (x.status === 200 && x.readyState === 4) {
      var source = x.responseText;
      var patternCode = document.createTextNode(pattern.exec(source)[1]);
      var pre = document.createElement('pre');
      var code = document.createElement('code');
      code.appendChild(patternCode);
      pre.appendChild(code);
      example.parentNode.insertBefore(pre, example);
      hideExample(example);
    }
  }

  x.open('GET', link, true);
  x.send(null);
}

function hideExample(example) {
  example.style.display = 'none';
}
