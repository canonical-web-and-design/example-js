var examples = document.querySelectorAll('.js-example');
examples.forEach(renderExample);

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

  /**
   * Wait for content to load before determining height
   */
  var resizeInterval = setInterval(
    function() {
      if (iframe.contentDocument.readyState == 'complete') {
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
  var patternCode = document.createTextNode(pattern.exec(html)[1]);
  var pre = document.createElement('pre');
  var code = document.createElement('code');

  code.appendChild(patternCode);
  pre.appendChild(code);

  placementElement.parentNode.insertBefore(pre, placementElement);
}
