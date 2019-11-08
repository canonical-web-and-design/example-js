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
        iframe.contentDocument.body.style.padding = '.5rem .25rem';
        // Add extra spacing to catch edge cases
        const frameHeight = iframe.contentDocument.body.scrollHeight;
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
  var source = stripScripts(pattern.exec(html)[1].trim());
  var patternCode = document.createTextNode(source);
  var container = document.createElement('div');
  var pre = document.createElement('pre');
  var code = document.createElement('code');
  var copyBtn = document.createElement('button');

  // Set attributes of code block

  container.classList.add('p-code-example');
  pre.classList.add('p-code-example__pre');
  code.classList.add('html', 'p-code-example__code');
  copyBtn.classList.add('p-code-example__copy-btn');
  copyBtn.title = 'Copy to clipboard';

  // Build code block structure
  container.appendChild(pre);
  pre.appendChild(code);
  pre.appendChild(copyBtn);
  code.appendChild(patternCode);
  hljs.highlightBlock(code);

  for (let classname in highlightStyles) {
    pre.querySelectorAll('.' + classname).forEach(node => {
      node.setAttribute('style', highlightStyles[classname]);
    });
  }

  placementElement.parentNode.insertBefore(container, placementElement);

  copyBtn.addEventListener('click', () => setClipboard(source));
}

function stripScripts(source) {
  var div = document.createElement('div');
  div.innerHTML = source;
  var scripts = div.getElementsByTagName('script');
  var i = scripts.length;
  while (i--) {
    scripts[i].parentNode.removeChild(scripts[i]);
  }
  return div.innerHTML;
}

function setClipboard(value) {
  const tempTextarea = document.createElement("textarea");
  tempTextarea.value = value;
  document.body.appendChild(tempTextarea);
  tempTextarea.select();
  try {
    document.execCommand('copy');
  } catch (error) {
    console.warn(`Unable to copy: ${error.message}`);
  }
  document.body.removeChild(tempTextarea);
}
