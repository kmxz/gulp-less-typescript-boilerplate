/// <reference path="dom.ts"/>
document.body.addEventListener('click', function () {
  var el;
  Dom.appendChildren(<HTMLElement>document.getElementsByClassName('body')[0], el = Dom.$('p', { style: { color: 'green' } }, ['A Click just occured! ', Dom.$('i', null, 'Click here to remove it.')], {
    click: (e: MouseEvent) => { e.stopPropagation(); el.parentNode.removeChild(el); }
  }));
});
