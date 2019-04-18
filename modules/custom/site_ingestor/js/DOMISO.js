//GLOBALS
//globals for classMausWork
var gSelectedElement;	//currently only one selection
var gHoverElement;		//whatever element the mouse is over
var gHovering=false;	//mouse is over something
var gObjArrMW=[];	//global array of classMausWork objects.  for removing event listeners when done selecting.
var targetRegion;

//extended
var infoDiv;		//currently just container for InfoDivHover, might add more here
var infoDivHover;	//container for hoverText text node.
var hoverText;		//show information about current element that the mouse is over

//(Section 1) Element Selection
function SetupDOMSelection()
{

  {
    //setup event listeners
    //var pathx="//div | //span | //table | //td | //tr | //ul | //ol | //li | //p";
    var pathx="//div | //span | //table | //th | //td | //tr | //ul | //ol | //li | //p | //iframe | //section | //article";
    var selection=$XPathSelect(pathx);
    for(var element, i=0;element=selection(i);i++)
    {
      //redundant check.
      if(element.tagName.match(/^(div|span|table|td|tr|ul|ol|li|p|section|article)$/i))
      {
        var m = new classMausWork(element);
        gObjArrMW.push(m);
        attachMouseEventListeners(m);
      }
    }
    document.body.addEventListener('mousedown',MiscEvent,false);
    document.body.addEventListener('mouseover',MiscEvent,false);
    document.body.addEventListener('mouseout',MiscEvent,false);
    document.addEventListener('keypress',MiscEvent,false);
  }
  {
    //setup informational div to show which element the mouse is over.
    infoDiv=document.createElement('div');
    var s=infoDiv.style;
    s.position='fixed';
    s.top='0';
    s.right='0';

    s.display='block';
    s.width='auto';
    s.padding='0px';

    document.body.appendChild(infoDiv);
    infoDivHover=document.createElement('div');

    s=infoDivHover.style;
    s.fontWeight='bold';
    s.padding='3px';
    s.Opacity='0.8';
    s.borderWidth='thin';
    s.borderStyle='solid';
    s.borderColor='white';
    s.backgroundColor='black';
    s.color='white';

    infoDiv.appendChild(infoDivHover);
    hoverText=document.createTextNode('selecting');
    infoDivHover.appendChild(hoverText);
  }
}

function CleanupDOMSelection()
{
  for(var m; m=gObjArrMW.pop(); )
  {
    detachMouseEventListeners(m);
  }
  ElementRemove(infoDiv);
  document.body.removeEventListener('mousedown',MiscEvent,false);
  document.body.removeEventListener('mouseover',MiscEvent,false);
  document.body.removeEventListener('mouseout',MiscEvent,false);
  document.removeEventListener('keypress',MiscEvent,false);
}

function attachMouseEventListeners(c)
{
  //c is object of class classMausWork
  c.element.addEventListener("mouseover",c.mouse_over,false);
  c.element.addEventListener("mouseout",c.mouse_out,false);
  c.element.addEventListener("mousedown",c.mouse_click,false);
}

function detachMouseEventListeners(c)
{
  //c is object of class classMausWork
  c.resetElementStyle();
  c.element.removeEventListener("mouseover",c.mouse_over,false);
  c.element.removeEventListener("mouseout",c.mouse_out,false);
  c.element.removeEventListener("mousedown",c.mouse_click,false);
}

//mouse event  handling class for element, el.
function classMausWork(element)
{
  //store information about the element this object is assigned to handle. element,  original style, etc.
  this.element=element;

  var elementStyle=element.getAttribute('style');
  var target;

  this.mouse_over=function(ev)
  {
    if(gHovering)return;
    var e=element;
    var s=e.style;
    s.backgroundColor='yellow';
    s.border='1px solid blue';
    InfoMSG(ElementInfo(e),'yellow','blue','yellow');
    gHoverElement=e;
    gHovering=true;
    target=ev.target;
    ev.stopPropagation();
  };

  this.mouse_out=function(ev)
  {
    if(!gHovering)return;
    if(gHoverElement!=element ||ev.target!=target)return;
    var e=element;
    e.setAttribute('style',elementStyle);
    InfoMSG('-','white','black','white');
    gHoverElement=null;
    gHovering=false;
    target=null;
    //ev.stopPropagation();
  };

  this.mouse_click=function(ev)
  {
    ev.stopPropagation();
    ev.preventDefault();
    if(!gHovering)return;
    if(gHoverElement!=element ||ev.target!=target)return;
    var e=element;
    e.setAttribute('style',elementStyle);
    CleanupDOMSelection();
    gHoverElement=null;
    gHovering=false;
    target=null;

    if(ev.button==0)
    {
      gSelectedElement=e;
      ElementSelected(e);	//finished selecting, cleanup then move to next part (section 2), element isolation.
    }
  };

  this.resetElementStyle=function()
  {
    element.setAttribute('style',elementStyle);
  };
}

function MiscEvent(ev)		//keypress, and mouseover/mouseout/mousedown event on body.  cancel selecting.
{
  if(ev.type=='mouseout' && !gHovering)
  {
    InfoMSG('-','white','black','white');
  }
  else if(ev.type=='mouseover' && !gHovering)
  {
    InfoMSG('cancel','yellow','red','yellow');
  }
  else //keypress on document or mousedown on body, cancel ops.
  {
    CleanupDOMSelection();
  }
}

function InfoMSG(text,color,bgcolor,border)
{

  var s=infoDivHover.style;
  if(color)s.color=color;
  if(bgcolor)s.backgroundColor=bgcolor;
  if(border)s.borderColor=border;
  if(text)hoverText.data=text;
}

//(Section 2) Element Isolation
function ElementSelected(element)	//finished selecting element.  setup string to prompt user.
{
  SaveRegion(ElementInfo(element), element.innerHTML);
}

function SaveRegion(defaultpath, innerHTML)		//prompt user, isolate element.
{
  targetRegion.data('xpath', defaultpath);
  targetRegion.data('innerHTML', innerHTML);
  targetRegion.addClass('ready');
}

//support
function $XPathSelect(p, context)
{
  if (!context) context = document;
  var i, arr = [], xpr = document.evaluate(p, context, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  return function(x) { return xpr.snapshotItem(x); };	//closure.  wooot!  returns function-type array of elements (usually elements, or something else depending on the xpath expression).
}

function ElementRemove(e)
{
  if(e)e.parentNode.removeChild(e);
}

function ElementInfo(element)
{
  var txt='';
  if(element)
  {
    txt = createXPathFromElement(element);
  }
  return txt;

}

function createXPathFromElement(elm) {
  var allNodes = document.getElementsByTagName('*');
  for (segs = []; elm && elm.nodeType == 1; elm = elm.parentNode)
  {
    if (elm.hasAttribute('id')) {
      var uniqueIdCount = 0;
      for (var n=0;n < allNodes.length;n++) {
        if (allNodes[n].hasAttribute('id') && allNodes[n].id == elm.id) uniqueIdCount++;
        if (uniqueIdCount > 1) break;
      };
      if ( uniqueIdCount == 1) {
        segs.unshift('id("' + elm.getAttribute('id') + '")');
        return segs.join('/');
      } else {
        segs.unshift(elm.localName.toLowerCase() + '[@id="' + elm.getAttribute('id') + '"]');
      }
    } else if (elm.hasAttribute('original-class')) {
      segs.unshift(elm.localName.toLowerCase() + '[@class="' + elm.getAttribute('original-class') + '"]');
    } else {
      for (i = 1, sib = elm.previousSibling; sib; sib = sib.previousSibling) {
        if (sib.localName == elm.localName)  i++; };
      segs.unshift(elm.localName.toLowerCase() + '[' + i + ']');
    };
  };
  return segs.length ? '/' + segs.join('/') : null;
};

function lookupElementByXPath(path) {
  var evaluator = new XPathEvaluator();
  var result = evaluator.evaluate(path, document.documentElement, null,XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  return  result.singleNodeValue;
}
