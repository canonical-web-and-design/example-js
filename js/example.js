var examples = document.querySelectorAll('.js-example');
examples.forEach(renderExample);

const highlightStyles = {
  "hljs-emphasis": "font-style: italic;",
  "hljs-strong": "font-weight: bold;",
  "hljs-comment": "color: #595e62;",
  "hljs-string": "color: #183691;",
  "hljs-number": "color: #0086b3;",
  "hljs-name": "color: #63a35c;",
  "hljs-selector-tag": "color: #63a35c;",
  "hljs-link": "color: #0086b3;",
  "hljs-keyword": "color: #a71d5d;",
  "hljs-attribute": "color: #a71d5d;",
  "hljs-attr": "color: #795da3;",
  "hljs-built_in": "color: #0086b3;",
  "hljs-title": "color: #795da3;",
  "hljs-section": "font-weight: bold;color: #1d3e81;",
  "hljs-meta": "font-weight: bold;color: #1d3e81;",
}

function renderExample(exampleElement) {
  var link = exampleElement.href;
  var request = new XMLHttpRequest();

  request.onreadystatechange = function() {
      if (request.status === 200 && request.readyState === 4) {
        var html = request.responseText;
        renderIframe(exampleElement, html);
        renderCodeBlock(exampleElement, html);
        exampleElement.style.display = 'none';
      }
  };

  request.open('GET', link, true);
  request.send(null);
}

function renderIframe(placementElement, html) {
  var iframe = document.createElement('iframe');
  iframe.width = '100%';
  iframe.frameBorder = 0;
  placementElement.parentNode.insertBefore(iframe, placementElement);
  var doc = iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();

  // Wait for content to load before determining height
  var resizeInterval = setInterval(
    function() {
      if (iframe.contentDocument.readyState == 'complete') {
        // remove any residual margin
        iframe.contentDocument.body.style.margin = 0;
        // add padding to see shadows pattern shadows
        iframe.contentDocument.body.style.padding = '0 4px';
        // Add extra spacing to catch edge cases
        const frameHeight = iframe.contentDocument.body.scrollHeight + 10;
        iframe.height = frameHeight + "px";
        clearInterval(resizeInterval);
      }
    },
    100
  );
  setTimeout(function() {clearInterval(resizeInterval);}, 2000);
}

function renderCodeBlock(placementElement, html) {
  var pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
  var patternCode = document.createTextNode(pattern.exec(html)[1].trim());
  var pre = document.createElement('pre');
  var code = document.createElement('code');

  code.appendChild(patternCode);
  code.classList.add('html');
  pre.appendChild(code);
  hljs.highlightBlock(code);

  for(let classname in highlightStyles) {
    pre.querySelectorAll('.' + classname).forEach(node => {
      node.setAttribute('style', highlightStyles[classname]);
    });
  }

  placementElement.parentNode.insertBefore(pre, placementElement);
}
