var KeyPress =(function(options){
	
	if(!options)       var options ={};
	if(!options.down)  options.down= null;
	if(!options.up)    options.up=(function(){});
	if(!options.press) options.press= null;

	var trigger =(function(action, code,key,callback)
	{
     var current = Date.now();
     var interval =(current -KeyPress.LastDuration) / 1000.0;
     KeyPress.LastDuration = current;
     if(typeof callback ==="function"){
     	 var id = setTimeout((function(){
      	 callback(key,code,interval,action);
      	 window.clearTimeout(id);
      	}),0);
     } 
	});

    var keydown =(function(e){
    	 var prevent =  e.preventDefault || e.getPreventDefault;
	     prevent.bind(e)();
	     var code =  e.keyCode || e.which;
	     var key = String.fromCharCode(code);
	     if(options.down){
	     	trigger(KeyPress.DOWN, code, key, options.down);
	     }
	});

	var keyup =(function(e){
	     e.preventDefault();
	     var code =  e.keyCode || e.which;
	     var key = String.fromCharCode(code);
	     if(options.up){
	     	trigger(KeyPress.UP, code, key, options.up);
	     }
	 });

	var keypress =(function(e){
	     e.preventDefault();
	     var code =  e.keyCode || e.which;
	     var key = String.fromCharCode(code);
	     if(options.press){
	     	trigger(KeyPress.PRESS, code, key, options.press);
	     }
	 });
	//Initial keyboard listener to the window
	var binder = null;
	var onInit =(function(options){
		//create a binder to the window
	binder = EventBinder(window);
	})(options);


	var getSubFunc=(function(type){
		var events = {"type":null, "proc":null};
		if(typeof type==='string'){
			var type = type.toLowerCase();
			if(type==="down"){
				events.type ="keydown";
				events.proc = keydown;
			} 
			else if(type==="up"){
				events.type ="keyup";
				events.proc = keyup;
			}else{
			 events.type ="keypress";
			 events.proc = keypress;
			}
		}
		return events;
	});
  /**
   The Simple module to return
  */
	var module = {
		 "on":(function(type, callback){
		 	var evt =null; 
		 	if(typeof type==='string'){
		 		 options[type]= callback;
		 	  evt = getSubFunc(type);
		 	}
		   if(evt && evt.type)
           	 binder.on(evt.type,evt.proc);
		   return  module;
		 }),
		 "off":(function(type, callback){
		 	var evt= null;
            if(typeof type==='string'){
            	var evt = getSubFunc(type);
            }
            if(evt || evt.type)
           	 binder.off(evt.type,evt.proc);
           	return module;
		 }),
		"listen":(function(keyorcode, callback, ...arg){
           module.on("press", (function(key,code,interval,action){
              if(keyorcode === key || keyorcode===code){
              	if(typeof callback ==='function'){
              		 var args = Array.prototype.slice.call(arg);
              		 args.shift(interval);
              	    callback.apply(null, args);
              	}
              }
           }));
         return module;
		})
	 };

	return  module;
})

KeyPress.LastDuration =Date.now();
KeyPress.DOWN =0;
KeyPress.UP   =1;
KeyPress.PRESS=2;


var GetRect =(function(element)
	 {
     
	  var area ={"width":0,"height":0,"x":0, "y":0, "bottom":0, "top":0, "left":0, "right":0};
      if(element instanceof HTMLElement || element instanceof Window)
      {
      	iswindow = (element instanceof Window);
      	if(!iswindow)
      	{
         if(window){
              if(window.getComputedStyle){
				style = window.getComputedStyle(element);
				area.width  = parseInt(style["width"]);
				area.height = parseInt(style["height"]);
				area.x      = parseInt(style["x"]);
				area.y      = parseInt(style["y"]);
				area.bottom = parseInt(style["bottom"]);
				area.top    = parseInt(style["top"]);
				area.left   = parseInt(style["left"]);
				area.right  = parseInt(style["right"]);
				area.style = style;
              }else{
              	  area = element.getBoundingClientRect();
                  area.style =  null;
              }
         }
     }
    else{
    	area.width  = element.innerWidth;
		area.height = element.innerHeight;
		area.x      = area.left = element.screenX;
		area.y      = area.top = element.screenY;
		area.bottom = area.top + area.height;
		area.right  = area.left + area.width;
		area.style = null;
		
    }

 }

return area;

})



namespace.Rect= GetRect;
namespace.Key = KeyPress;
})(events);

