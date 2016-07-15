
var touch = 0;

//set the global Context element
var backContext;
var colour;
var oldItem;
var count = 0;
var hiddenTrigger = null;

var divArray = new Array("61","62","63","64","65","66","67");
var oldArray = new Array();
var colourArray =  [{name:"61",   x:"830",  y:"140",	w:"134", h:"164"},
					{name:"62",   x:"130",	y:"460",  	w:"200",	h:"313"},
					{name:"63",   x:"710", 	y:"30", 	w:"104", h:"213"},
					{name:"64",   x:"180", 	y:"60", 	w:"111",	h:"185"},
					{name:"65",   x:"30", 	y:"200", 	w:"176", h:"341"},
					{name:"66",   x:"670", 	y:"360", 	w:"132",	h:"369"},
					{name:"67",   x:"760", 	y:"320",  	w:"242",	h:"200"}];
var matchArray = [{name:"61", r:"255", 	g:"255", b:"255", r1:"111", g1:"111", b1:"111"},
				  {name:"62", r:"255",	g:"0", 	 b:"0", r1:"111", g1:"111", b1:"111", r1:"111", g1:"111", b1:"111"},
				  {name:"63", r:"255",	g:"255", b:"0", r1:"111", g1:"111", b1:"111"},
				  {name:"64", r:"255",	g:"0",	 b:"255", r1:"0", g1:"255", b1:"255"},
				  {name:"65", r:"0",	g:"0",	 b:"255", r1:"111", g1:"111", b1:"111"},
				  {name:"66", r:"0",	g:"255", b:"0", r1:"111", g1:"111", b1:"111"},
				  {name:"67", r:"0", 	g:"255", b:"255", r1:"111", g1:"111", b1:"111"}];
var dArray = new Array();



function create_canvas(container){

	var winWidth 	= 1024;
	var winHeight 	= 768;
  	var destX 		= 0;
  	var destY 		= 0;  	

  	//create the canvas for the colour map
    backCanvas 				= document.createElement('canvas');
    backCanvas.id 			= 'backCanvas';
    backCanvas.className 	= "canvasLayer";
    backCanvas.style.zIndex = 1;   

    //create all the div elements that hold the different colour pictures
    backImgDiv 				= document.createElement('img');
    backImgDiv.id 			= 'backImg';
    backImgDiv.style.zIndex = -1;
    backImgDiv.className 	= "imgLayer";
    backImgDiv.src 			= "6_pur.png";

    controlsDiv  = document.createElement('div');
    backImgDiv.id 			= 'controls';
    backImgDiv.style.zIndex = -1;
    backImgDiv.className 	= "controls";

    for(var i=0;i<divArray.length;i++)
    {
    	div = new createLayerDiv(divArray[i],i,container);
    	dArray.push(div);
    }

    var colours = new Array();

    //create the divs that hold the dragable colours 
    for(var i=0;i<colourArray.length;i++)
    {
    	colourDiv = new createColour(colourArray[i].name,container,colourArray[i].x,
    								colourArray[i].y, colourArray[i].w, colourArray[i].h);
    	colours.push(colourDiv);
    }

    resetBtn 						= document.createElement('img');
    resetBtn.id 					= "reset";
    resetBtn.src					= "binicon-50-50.png";    

    //set the the height and width of the canvas element
	backCanvas.height = winHeight;
	backCanvas.width  = winWidth;
	backContext   	  = backCanvas.getContext("2d");	

	//set an image object
	var backImg     = new Image();	
	
	//when the image object has loaded draw it
	backImg.onload = function(){
		backContext.drawImage(backImg,destX,0, winWidth, winHeight); 
	};	
	//set the src of the background/colourMap
	backImg.src    = "6colourmap.png";	

	//append all our elements to the DOM    
    container.appendChild(backImgDiv);
    container.appendChild(backCanvas);


}

function createColour(colourName,target,x,y,w,h){
	var self 		= this;
	this.id 		= "chair"+colourName;
	this.className 	= "colour";
	this.target 	= target;
	this.value 		= colourName;
	this.src 		= colourName + ".png";
	this.x 			= x;
	this.y 			= y;
	this.width 		= w;
	this.height 	= h;
	this.div 		= null;	

	this.create = function(){
		elem 				= document.createElement('img');
		elem.id 			= this.id;
		elem.className 		= this.className;		
		elem.src 			= this.src;
		elem.value 			= this.value;
		elem.style.left 	= this.x + "px";
		elem.style.top  	= this.y + "px";
		elem.style.width 	= this.width + "px";
		elem.style.height 	= this.height + "px";
		elem.addEventListener('touchstart', this.touchStart);
		elem.addEventListener('touchmove', this.touchmove);
		elem.addEventListener('touchend', this.touchend);
		this.target.appendChild(elem);
		this.div = elem;
	}

	//add the listeners to the colour divs
	this.touchStart = function(e) {
		//set the colour varable set the colour of the selector div
		oldItem = "";
		draggable = true;
		for(var i=0;i<dArray.length;i++)
   		{
   			oldArray[i] = dArray[i].div.src;
    	}
		touch = 0;
		colour = this.value;
	    e.preventDefault(); 
	}
	this.touchmove = function(e) {
		if(e.touches[0])
		{
			drag(e);
		}
	}
	this.touchend = function(e) {
		var x = this.x;
		var y = this.y;
		var width = this.width;
		
		var height = this.height;

		e.target.style.left = self.x + 'px';
		e.target.style.top = self.y + 'px';
		
		testPixel(e,x+(width/2),y+(height/2),true);
				
	}
	this.create();
}

function createLayerDiv(name,i,target){
	var self 		= this;
	this.id 		= name + 'Img';
	this.className 	= "imgLayer";
	this.target 	= target;
	this.value 		= 6;
	this.source 	= "transparent.png";
	this.div 		= null;

	this.create = function(){
		elem 			= document.createElement('img');
		elem.id 		= this.id;
		elem.src 		= this.source;
		elem.className 	= this.className;
		elem.value 		= this.value;
		elem.zIndex 	= this.value;
		this.target.appendChild(elem);
		this.div = elem;
	}
	this.create();
}

function setSelectedColour(colour){
	selected =document.getElementById("selected");
	selected.style.backgroundColor = colour;
}

function drag(e){
    e.preventDefault();
    var x= e.touches[0].pageX;
	var y= e.touches[0].pageY;
	var width = e.target.style.width;
	width = width.replace("px","");
	width = parseInt(width);
	var height = e.target.style.height;
	height = height.replace("px","");
	height = parseInt(height);
	e.target.style.left = (x-(width/2)) + 'px';
	e.target.style.top = (y-(height/2)) + 'px';	   
	    //the touch variable is either 1 or 0, if 0 sample the background otherwise set the touch to 0
	    //the next tick will then sample
	    if(touch == 0)
		{	    	
	    	testPixel(e,x+(width/2),y+(height/2),false);
			touch=1;
		}
		else
		{
			touch=0;
		}
	
}
function testPixel(e,x,y,end){
			//get the data of the current pixel, rgba strored in an array
			d = backContext.getImageData(x, y, 1, 1);
			red = d.data[0];
			green = d.data[1];
			blue = d.data[2];
			//work out the area based on the rgb colour
			for(var i=0;i<matchArray.length;i++)
			{
				if( 
					(matchArray[i].r == red.toString()&& 
					matchArray[i].g == green.toString() &&
					matchArray[i].b == blue.toString()) || 
					(matchArray[i].r1 == red.toString()&& 
					matchArray[i].g1 == green.toString() &&
					matchArray[i].b1 == blue.toString())
					) 
				{
					console.log(i+":"+matchArray[i].r1+","+matchArray[i].g1+","+ matchArray[i].b1+":"
						+red.toString()+","+green.toString()+","+ blue.toString());
					console.log(matchArray[i].name+":-"+colour)
					setColour(matchArray[i].name,colour,e,end);
					if(colour!="67"){break;}
				}
			}

}

function setColour(item,colour,e,end)
{	
	//checks if the user is still on the same element(no point in redrawing unessessarly)
	if(oldItem!=item)
	{
		for(var i=0;i<divArray.length;i++)
		{	//cycles through the array to get old src of the layer you have moved off
			if(oldItem == divArray[i])
			{
				oldImage = document.getElementById(oldItem + "Img");
				oldImage.src = oldArray[i];
			}
		}
		oldItem = item;
		//get the img element to be set and set the src to the approiate colour image
		image = document.getElementById(item + "Img");
		if(item == colour){
			imageSrc = "built_" + colour +".png";
			if(!end)
			{
				image.style.opacity = 0.5;
				image.src = imageSrc;
			}
			else
			{
				count++;
				e.target.style.display = "none";
				image.style.opacity = 1;
				image.src = imageSrc;
				console.log('count:'+count);
				if(count==7){			

					hiddenTrigger.href='script:hotspotAddLayer?hotspot_id=6a';
					if (document.createEventObject) {
					    evt = document.createEventObject();
					    return hiddenTrigger.fireEvent('onclick', evt);
					    } 
					    else {
					        evt = document.createEvent("MouseEvents");
					        if (evt.initMouseEvent) {
					            evt.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
					          return hiddenTrigger.dispatchEvent(evt);
					        }
					  }
				}
			}
		}		
	}
	else if(item == colour && end){
		
		count++;
		image = document.getElementById(item + "Img");
		imageSrc = "built_" + colour +".png";
		e.target.style.display = "none";
		image.style.opacity = 1;
		image.src = imageSrc;
		console.log('count:'+count);
		if(count==7){

			hiddenTrigger.href='script:hotspotAddLayer?hotspot_id=6a';
			if (document.createEventObject) {
			    evt = document.createEventObject();
			    return hiddenTrigger.fireEvent('onclick', evt);
			    } 
			    else {
			        evt = document.createEvent("MouseEvents");
			        if (evt.initMouseEvent) {
			            evt.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
			          return hiddenTrigger.dispatchEvent(evt);
			        }
			  }
		}
	}
}

function reset()
{
	for(var i=0;i<divArray.length;i++)
	{	//sets all img item to transparent
		image = document.getElementById(divArray[i] + "Img");
		image.src = "transparent.png";
	}
}

function main(){
hiddenTrigger = document.getElementById("triggerScript");
    container = document.createElement('div');
    container.id = 'container'; 
    document.body.appendChild(container);
    create_canvas(container);
}
window.onload = function(){
	document.addEventListener("touchmove", function(e) {
  e.preventDefault();
  },false);
 main()   
}