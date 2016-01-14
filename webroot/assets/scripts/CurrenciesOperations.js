//***************************************les Constantes*************************************
const cDataStateCreation =0, cDataStateEdit = 1;
const cDirUp =1,cDirDown =-1;
const cTrue = 1 , cFalse= 0;



//***************************************les variables*************************************
var CanvasAttr =  { "cDIRECTION_UP" : String.fromCharCode(9650),
                  "cDIRECTION_DOWN" :String.fromCharCode(9660),
                  "cVALUE_UP_CLR" :" #00FF00",
				  "cVALUE_DOWN_CLR": "#FF0000", 
                  "cGlobalTextColor": "white",
				  "cInitialGlobalLeft" : 0,
				  "cTitleFont" : "10px bold Bodoni MT Condensed",
				  "cGlobalFont" :"16px bold Arial",
				  "cCanvasTop" :0,"cCanvasLeft" :0, "cCanvasWidth" :window.innerWidth,"cCanvasHeight":30,	"cCanvasScreenColor" :"black",  
				  "cGlobalTextTop" : 21,
				  "cVitesse" : -2,
				  
				  "cSep1" :0,"cSep2":0, "cSep3":0 , "cSep4" :65,
				  "cPageDyanamique" : "WWW.LIEN_DYNAMIQUE/DOSSIER/"
}                 


var eb = null;  

var CanvasCtxt;

var iCanvas;

var curr_name="";
var iCurrenciesDispather;




//***************************************les Classes ***************************************

//------------------------------------ Classe Dispather-------------------------------------
var CurrenciesDispather = function () {
  
  var Widths = new  Object();
  
  var WidthsUptodate = new  Object();
  
  this.Mx_CurrenciesDispather= undefined;
  
  this.Mx_CurrenciesIn; 
  
  this.GlobalLeft;
  
  this.GlobalLeft1;
  
  this.LastPackageRight = 0;
  
  this.DataSrcChart;
  
  this.CurrencySelected = "";
  
  this.Vitesse = CanvasAttr.cVitesse;
  
  //Contexte caneva
  this.CanvasCtxt;
  
  //Créer matrix
  this.MxDispatchCreateNew = function (CanvasCtxt){ 
     
	this.DispatchDataState = cDataStateCreation;  
	 
    this.Mx_CurrenciesDispather = new Object();
	
	this.Mx_CurrenciesDispather.length = 0;
	
	this.CanvasCtxt = CanvasCtxt;
	
		
	
  }
     
  //Assigner les Currencies Entrant	 
  this.MxInAssign = function (Mx_In)  {  
      
	this.Mx_CurrenciesIn = Mx_In;

  }

  
  this.SetDataStateEdit =function() {  
 
   iCurrenciesDispather.DispatchDataState = cDataStateEdit;

 }
  
   
  
  this.SetGlobalLeft =function() {  
 
   this.GlobalLeft = CanvasAttr.cInitialGlobalLeft; 

 }

  this.SetGlobalLeft1 =function() {  
 
   this.GlobalLeft1 = CanvasAttr.cInitialGlobalLeft; 

 }

  
   
 this.SetMxDispatchState =function(val) {  
 
    this.DispatchDataState = val;

 }

  
	 
  // Create matrix
  this.CreateStandardDataMx = function (ObjCurrency,i)  {   
   
    
    this.Mx_CurrenciesDispather[ObjCurrency.currency] = new  Object();   
   
    this.Mx_CurrenciesDispather[ObjCurrency.currency].currency = ObjCurrency.currency;
   
    this.Mx_CurrenciesDispather[ObjCurrency.currency].price = ObjCurrency.price ;
   
    this.Mx_CurrenciesDispather[ObjCurrency.currency].volume = ObjCurrency.volume;
   
    this.Mx_CurrenciesDispather[ObjCurrency.currency].pourcentage = 0;
	
    this.Mx_CurrenciesDispather[ObjCurrency.currency].direction = 0;
	
		
	this.Mx_CurrenciesDispather[ObjCurrency.currency].GlobalFont =CanvasAttr.cGlobalFont;
    
    this.Mx_CurrenciesDispather[ObjCurrency.currency].GlobalColor = CanvasAttr.cGlobalTextColor;


}


 
 
   // Ajoute toutes les positions initiales sur une trajectoire rectiligne
 this.TrjLine_AddPositionsMx = function (ObjCurrency,i)  {  
	
    this.Mx_CurrenciesDispather[ObjCurrency.currency].CurrencyLeft = this.GlobalLeft;
		
	this.Mx_CurrenciesDispather[ObjCurrency.currency].DirectionIconLeft = this.GlobalLeft + Widths.CurrencyWidth + CanvasAttr.cSep1; 
	
    this.Mx_CurrenciesDispather[ObjCurrency.currency].priceLeft =this.Mx_CurrenciesDispather[ObjCurrency.currency].DirectionIconLeft + Widths.DirectionIconWidth + CanvasAttr.cSep2;  

	this.Mx_CurrenciesDispather[ObjCurrency.currency].PourcentageLeft = this.Mx_CurrenciesDispather[ObjCurrency.currency].priceLeft +  Widths.PriceWidth + CanvasAttr.cSep3 ; 
 
    this.Mx_CurrenciesDispather[ObjCurrency.currency].PackageRight = this.Mx_CurrenciesDispather[ObjCurrency.currency].PourcentageLeft + Widths.PourcentageWidth  + CanvasAttr.cSep4;
	
	this.Mx_CurrenciesDispather[ObjCurrency.currency].Top =  CanvasAttr.cGlobalTextTop;
   
    this.GlobalLeft = this.Mx_CurrenciesDispather[ObjCurrency.currency].PackageRight;
 }
 

 
   // Initialise le mouvement de facon concrête en positionnant le point
 this.TrjLine_IniMvt = function (key,i)  {  
	
	if (key != "length") {  
    this.Mx_CurrenciesDispather[key].CurrencyLeft = this.GlobalLeft1;
		
	this.Mx_CurrenciesDispather[key].DirectionIconLeft = this.Mx_CurrenciesDispather[key].CurrencyLeft + WidthsUptodate.CurrencyWidth + CanvasAttr.cSep1; 
	
	
	
    this.Mx_CurrenciesDispather[key].priceLeft =this.Mx_CurrenciesDispather[key].DirectionIconLeft + WidthsUptodate.DirectionIconWidth + CanvasAttr.cSep2;  

	this.Mx_CurrenciesDispather[key].PourcentageLeft = this.Mx_CurrenciesDispather[key].priceLeft +  WidthsUptodate.PriceWidth + CanvasAttr.cSep3 ; 
 
    this.Mx_CurrenciesDispather[key].PackageRight = this.Mx_CurrenciesDispather[key].PourcentageLeft + WidthsUptodate.PourcentageWidth  + CanvasAttr.cSep4;
	
	
	
	this.Mx_CurrenciesDispather[key].Top =  CanvasAttr.cGlobalTextTop;
   
    this.GlobalLeft1 = this.Mx_CurrenciesDispather[key].PackageRight;
	
	 //document.getElementById("DIV"+i).innerHTML= key ; 
	}

 }

 
   // Initialise le mouvement de facon concrête en positionnant le point
 this.TrjLine_Mvt = function (key,i)  {  
	
	 //CanvasAttr.cSep4=0;
	
	if (key != "length") {  
    this.Mx_CurrenciesDispather[key].CurrencyLeft = this.Mx_CurrenciesDispather[key].CurrencyLeft+ this.Vitesse; 
		
	this.Mx_CurrenciesDispather[key].DirectionIconLeft = this.Mx_CurrenciesDispather[key].CurrencyLeft + WidthsUptodate.CurrencyWidth + CanvasAttr.cSep1; 
	
	
	
    this.Mx_CurrenciesDispather[key].priceLeft =this.Mx_CurrenciesDispather[key].DirectionIconLeft + WidthsUptodate.DirectionIconWidth + CanvasAttr.cSep2;  

	this.Mx_CurrenciesDispather[key].PourcentageLeft = this.Mx_CurrenciesDispather[key].priceLeft +  WidthsUptodate.PriceWidth + CanvasAttr.cSep3 ; 
 
    this.Mx_CurrenciesDispather[key].PackageRight = this.Mx_CurrenciesDispather[key].PourcentageLeft + WidthsUptodate.PourcentageWidth  + CanvasAttr.cSep4;
	
	
	
	this.Mx_CurrenciesDispather[key].Top =  CanvasAttr.cGlobalTextTop;
   
   // this.GlobalLeft1 = this.Mx_CurrenciesDispather[key].PackageRight;
	
	//document.getElementById("DIV"+i).innerHTML= key ; 
	}

 }

 

/*  */
 
 
  // Create matrix
  this.UpdateStandardDataMx = function (ObjCurrency,i)  {   
   
    
    var pourcentage, direction;
  
	// pourcentage= (ObjCurrency.price - this.Mx_CurrenciesDispather[ObjCurrency.currency].price)/ this.Mx_CurrenciesDispather[ObjCurrency.currency].price;
	
	// pourcentage = pourcentage*100;
	
	pourcentage = ObjCurrency.percentage;
	
	pourcentage =  roundFloat(pourcentage,3);
		
	if ( pourcentage >= 0) { 
	    direction = cDirUp;
	  	
		this.Mx_CurrenciesDispather[ObjCurrency.currency].directionIcon = CanvasAttr.cDIRECTION_UP;
	
  	    this.Mx_CurrenciesDispather[ObjCurrency.currency].UpDownColor =CanvasAttr.cVALUE_UP_CLR;
	  
	} else  {
	
	    direction = cDirDown;
	    
	    this.Mx_CurrenciesDispather[ObjCurrency.currency].directionIcon = CanvasAttr.cDIRECTION_DOWN; 
	     
		this.Mx_CurrenciesDispather[ObjCurrency.currency].UpDownColor =CanvasAttr.cVALUE_DOWN_CLR;
	}
	
	this.Mx_CurrenciesDispather[ObjCurrency.currency].currency = ObjCurrency.currency;
   
    this.Mx_CurrenciesDispather[ObjCurrency.currency].price = ObjCurrency.price;
   
    this.Mx_CurrenciesDispather[ObjCurrency.currency].volume = ObjCurrency.volume;
   
    this.Mx_CurrenciesDispather[ObjCurrency.currency].pourcentage = pourcentage;
	
    this.Mx_CurrenciesDispather[ObjCurrency.currency].direction = direction;
	

   
 }

 
   // Retourne les tailles des textes
 this.SetTextWidth = function (ObjCurrency,i)  {  
 
        var CurrencyWidth = this.CanvasCtxt.measureText(ObjCurrency.currency).width;
	
		var DirectionIconWidth = this.CanvasCtxt.measureText(CanvasAttr.cDIRECTION_UP).width;
	
		var PriceWidth = this.CanvasCtxt.measureText(ObjCurrency.price).width;
	  
		var PourcentageWidth = this.CanvasCtxt.measureText("("+ObjCurrency.pourcentage+"%)").width;
	
		this.Mx_CurrenciesDispather[ObjCurrency.currency].CurrencyWidth =  CurrencyWidth;
	
		this.Mx_CurrenciesDispather[ObjCurrency.currency].DirectionIconWidth = DirectionIconWidth;

		this.Mx_CurrenciesDispather[ObjCurrency.currency].PriceWidth = PriceWidth;

		this.Mx_CurrenciesDispather[ObjCurrency.currency].PourcentageWidth =  PourcentageWidth+35;

		Widths.CurrencyWidth = CurrencyWidth;
	
		Widths.DirectionIconWidth = DirectionIconWidth
	
		Widths.PriceWidth =   PriceWidth;
	
		Widths.PourcentageWidth = PourcentageWidth;
	
    }
 
 
 
 
   // Retourne les tailles des textes
 this.GetUpdateTextWidth = function (KeyCurrency,i)  {  
 
    //if (KeyCurrency != "") { 
      	var CurrencyWidth  = this.Mx_CurrenciesDispather[KeyCurrency].CurrencyWidth;
	
		var DirectionIconWidth = this.Mx_CurrenciesDispather[KeyCurrency].DirectionIconWidth;

		var PriceWidth = this.Mx_CurrenciesDispather[KeyCurrency].PriceWidth;

		var PourcentageWidth =this.Mx_CurrenciesDispather[KeyCurrency].PourcentageWidth;

		WidthsUptodate.CurrencyWidth = CurrencyWidth;
	
		WidthsUptodate.DirectionIconWidth = DirectionIconWidth
	
		WidthsUptodate.PriceWidth =   PriceWidth;
	
		WidthsUptodate.PourcentageWidth = PourcentageWidth;
		
		
	//}
    }

 
 
 
 
  // Create matrix
  this.CreateMx = function (ObjCurrency,i)  {   
   
    this.CreateStandardDataMx(ObjCurrency,i); 
    
	this.SetTextWidth(ObjCurrency,i);
    
	//Créer une trajectoire en ligne droite pour des données temporaires
	this.TrjLine_AddPositionsMx(ObjCurrency,i)
	
	//Créer d'autre trajectoire éventuelle

	//document.getElementById("DIV"+i).innerHTML= ObjCurrency.currency + "   " + ObjCurrency.price + "   " + ObjCurrency.volume+ "   " + i;
  }


 
  // Mise à jour matrix
  this.UpdateMx = function (ObjCurrency,i)  {   
   
        this.UpdateStandardDataMx(ObjCurrency,i);
	
		this.SetTextWidth(ObjCurrency,i);
 
  }
 
   this.AffecterMx = function (ObjCurrency,i)  {  
     // document.getElementById("DIV1").innerHTML=  this.Mx_CurrenciesIn.length+ "  "+ this.DispatchDataState + "  "+ "<br>";
   
       // create add new values 
	 if (this.DispatchDataState == cDataStateCreation ) {
	 
	    this.CreateMx (ObjCurrency,i);
		
      }
	 // Update value
	  else if  (this.DispatchDataState == cDataStateEdit )   {
	    
	    this.UpdateMx (ObjCurrency,i);
        
	   }
	   
	   this.Afficher(ObjCurrency, i);	
	   
	   
	   // Affichage Test
	   
  }

 
   // Retournée les currencies provenant d'internet (tableau d'objets d'attributs: currency, price, volume, time) 
    this.DataIn = function()  { 
	     return this.Mx_CurrenciesIn;
   } 
	  // Retournée les currencies traitée (tableau d'objets d'attributs: currency, price, volume, time, pourcentage, direction) 	 
    this.DataDispatch = function()  { 
	     return this.Mx_CurrenciesDispather;
	} 
	    
 
 
 // Initialise les positions
 this.TrjLine_Localiser= function (x,y)  {  
 	
  var i = 0,Delta = 0;
  
   var bottom =  50 +  CanvasAttr.cCanvasHeight //50 because height from top of the browser screen
   //alert("SCSC");
  if ( this.DispatchDataState == cDataStateEdit ) {
     
  
    for(var key in this.Mx_CurrenciesDispather) {
       
     var left =this.Mx_CurrenciesDispather[key].CurrencyLeft  ;
     var Right =this.Mx_CurrenciesDispather[key].PackageRight;
	
	 if (((x >=left)&&(x <=Right)) && ((y >=50 )&&(y <=bottom))){
	    
		this.CurrencySelected = this.Mx_CurrenciesDispather[key].currency;
        
		 
		this.CurrencyLink =this.CurrencySelected;
		//window.alert(this.CurrencyLink);
		curr_name=this.Mx_CurrenciesDispather[key].currency;
        document.getElementById("cur_name").innerHTML= this.Mx_CurrenciesDispather[key].currency;
        document.getElementById("cur_price").innerHTML= this.Mx_CurrenciesDispather[key].price;
        document.getElementById("cur_variation").innerHTML= this.Mx_CurrenciesDispather[key].pourcentage +" "+ this.Mx_CurrenciesDispather[key].directionIcon;
		curr_description();	
			
	  }
    }
  }

 }
 
 
 // Renvoie la derniere position
 this.TrjLine_LastPosition= function ()  {  
    var Dernier = 0
    var ScreenRight;
	
	for(var key in this.Mx_CurrenciesDispather){
	   
	   if (key != "length") {
	        if (this.Mx_CurrenciesDispather[key].PackageRight >= Dernier) {  
			    Dernier = this.Mx_CurrenciesDispather[key].PackageRight;
	        }
	    }
	}
  
	ScreenRight = CanvasAttr.cCanvasLeft+CanvasAttr.cCanvasWidth;
	
	if (Dernier <  ScreenRight) {
		Dernier = ScreenRight
	}
	
	return Dernier;
  
 }
 
// Position em queue de file

 this.TrjLine_SetInEndLine= function ( key)  {  
		   
	   if (key != "length") {
	        if (this.Mx_CurrenciesDispather[key].PackageRight < CanvasAttr.cCanvasLeft) {  
			    Dernier = this.Mx_CurrenciesDispather[key].PackageRight;
				
				this.Mx_CurrenciesDispather[key].CurrencyLeft = this.TrjLine_LastPosition() - CanvasAttr.cSep4;
				
	        }
    }
  
 } 
  /**/
 
 // Initialise les positions
 this.TrjLine_IniPositions= function ()  {  
 
  var i = 0,Delta = 0;
 
 if ( this.DispatchDataState !=cDataStateCreation ) {
    
    
    this.SetGlobalLeft1();
	
    for(var key in this.Mx_CurrenciesDispather) {
    
	
	    this.GetUpdateTextWidth(key,i);
	  
	    if (this.IsTrjLine_IniMvtSet ==  cFalse) {
	 
	        this.TrjLine_IniMvt (key,i) ;
	    }
        else {
	 
	     this.TrjLine_Mvt(key,i);
		 
	    }
	 
	 this.TrjLine_SetInEndLine( key); 
	 
	}
	  this.IsTrjLine_IniMvtSet =  cTrue;
	
	
	
  }

 }
 

   // Afficher un elt du titre boursier
  this.TrjLine_AfficherCurrency= function (ObjCurrency)  {  
  
    var Texte, Price, AllVal, Left, Top;  
		
	
		this.CanvasCtxt.fillStyle= ObjCurrency.GlobalColor ;
	
		this.CanvasCtxt.font=ObjCurrency.GlobalFont;

		Texte =ObjCurrency.currency;
	
		Left = ObjCurrency.CurrencyLeft ;
		
		Top  = ObjCurrency.Top;
		
		this.CanvasCtxt.fillText(Texte,Left,Top);
	
  }
 
 
   // Afficher un elt du titre boursier
  this.TrjLine_AfficherDir= function (ObjCurrency)  {  
  
    var Texte, Price, AllVal, Left, Top;  
		
		this.CanvasCtxt.fillStyle= ObjCurrency.UpDownColor ;
	
		this.CanvasCtxt.font=ObjCurrency.GlobalFont;

		Texte =ObjCurrency.directionIcon;
	
		Left = ObjCurrency.DirectionIconLeft ;
		
		Top  = ObjCurrency.Top;
		
		this.CanvasCtxt.fillText(Texte,Left,Top);
  }
 
 
   // Afficher un elt du titre boursier
  this.TrjLine_AfficherPrice= function (ObjCurrency)  {  
  
    var Texte, Price, AllVal, Left, Top;  
	
		this.CanvasCtxt.fillStyle= ObjCurrency.GlobalColor ;
	
		this.CanvasCtxt.font=ObjCurrency.GlobalFont;

		Texte =ObjCurrency.price;
	
		Left = ObjCurrency.priceLeft ;
		
		Top  = ObjCurrency.Top;
		
		this.CanvasCtxt.fillText(Texte,Left,Top);
	
  }
 
   // Afficher un elt du titre boursier
  this.TrjLine_AfficherPourcentage= function (ObjCurrency)  {  
  
    var Texte, Price, AllVal, Left, Top;  
		
	
		this.CanvasCtxt.fillStyle= ObjCurrency.UpDownColor ;
	
		this.CanvasCtxt.font=ObjCurrency.GlobalFont;

		Texte ="("+ObjCurrency.pourcentage+"%)"; 

		Left = ObjCurrency.PourcentageLeft;
		
		Top  = ObjCurrency.Top;
		
		this.CanvasCtxt.fillText(Texte,Left,Top);
			
	
  }
 
 
  // Afficher tout le paquet du currency
  this.TrjLine_AfficherCurrPackage= function (ObjCurrency)  {  
    
	if 	(ObjCurrency !=undefined) {
	
        this.TrjLine_AfficherCurrency(ObjCurrency);
		
		this.TrjLine_AfficherDir(ObjCurrency);
		 
		this.TrjLine_AfficherPrice(ObjCurrency);
		
		this.TrjLine_AfficherPourcentage(ObjCurrency);/**/
	} 	
  }
 
 // Afficher tous les currencies
 this.TrjLine_AfficherCurrencies= function ()  {  
  var i = 0;
  if ( this.DispatchDataState == cDataStateEdit ) {
    for(var key in this.Mx_CurrenciesDispather) {
       
        var ObjCur = this.Mx_CurrenciesDispather[key];
    
		this.TrjLine_AfficherCurrPackage(ObjCur);
  		//i++;
    }
  }

 }
 
 
 
  // Test d'affichage
  this.Afficher = function (ObjCurrency, i)  {   
  
    var cu=  this.Mx_CurrenciesDispather[ObjCurrency.currency].currency; 
   
    var pr= this.Mx_CurrenciesDispather[ObjCurrency.currency].price;
   
    var vol = this.Mx_CurrenciesDispather[ObjCurrency.currency].volume;
   
    var pour =this.Mx_CurrenciesDispather[ObjCurrency.currency].pourcentage;
	
    var dir =this.Mx_CurrenciesDispather[ObjCurrency.currency].direction;
   
    var CurrencyWidth =   	this.Mx_CurrenciesDispather[ObjCurrency.currency].CurrencyWidth  ;
	
	var DirectionIconWidth =	this.Mx_CurrenciesDispather[ObjCurrency.currency].DirectionIconWidth; 

	var PriceWidth =	this.Mx_CurrenciesDispather[ObjCurrency.currency].PriceWidth ;

	var PourcentageWidth = 	this.Mx_CurrenciesDispather[ObjCurrency.currency].PourcentageWidth   ;

	var CurrencyLeft=   this.Mx_CurrenciesDispather[ObjCurrency.currency].CurrencyLeft;
		
	var DirectionIconLeft =this.Mx_CurrenciesDispather[ObjCurrency.currency].DirectionIconLeft ; 
	
    var priceLeft= this.Mx_CurrenciesDispather[ObjCurrency.currency].priceLeft ;  

	var PourcentageLeft = this.Mx_CurrenciesDispather[ObjCurrency.currency].PourcentageLeft ; 
 
    var PackageRight = this.Mx_CurrenciesDispather[ObjCurrency.currency].PackageRight;
	
	var top =this.Mx_CurrenciesDispather[ObjCurrency.currency].Top;

    // document.getElementById("DIV"+i).innerHTML=  "";
    //document.getElementById("DIV"+i).innerHTML=  cu + "   " + pr + "   " + vol + "   " + pour + "  " + dir+  "  " + CurrencyWidth +  "  " + DirectionIconWidth+  "  " + PriceWidth+  "  " + PourcentageWidth +  "  " ;
   
   //  document.getElementById("DIV"+i).innerHTML= document.getElementById("DIV"+i).innerHTML + CurrencyLeft + "   " + DirectionIconLeft + "   " + priceLeft + "   " + PourcentageLeft + "  " + PackageRight+  "  " + top +   " * " ;
  
 }


 

   this.BarreStop =function(){
     this.Vitesse =0;
   }

   this.BarreGo= function(){
     this.Vitesse =CanvasAttr.cVitesse;
   }
 
 
}

 

//***************************************les fonctions globales*********************************


    function curr_description(){

    	
        if(curr_name=="EUR/UtSD"){
        	document.getElementById("cur_nickname").innerHTML="euro";
            document.getElementById("cur_desc").innerHTML="The EUR/USD is the most widely traded pair because the Euro and the US Dollar are both considered to be very liquid, meaning that you can consistently put a large amount of money in a trade or take a large amount of money out with minimal movement to the price. </br>";
        }else if(curr_name=="USD/JPY"){
        	document.getElementById("cur_nickname").innerHTML="gopher";
        	document.getElementById("cur_desc").innerHTML="The abbreviation for the U.S. dollar and Japanese yen (USD/JPY) pair or cross for the currencies of the United States (USD) and Japan (JPY). The currency pair shows how many Japanese yen (the quote currency) are needed to purchase one U.S. dollar (the base currency). </br>";
        }else if(curr_name=="GBP/USD"){
        	document.getElementById("cur_nickname").innerHTML="Cable";
        	document.getElementById("cur_desc").innerHTML="The abbreviation for the British pound and U.S. dollar (GBP/USD) currency pair or cross. The currency pair tells the reader how many U.S. dollars (the quote currency) are needed to purchase one British pound (the base currency). </br>";
        }else if(curr_name=="GBP/CHF"){
        	document.getElementById("cur_nickname").innerHTML="--";
        	document.getElementById("cur_desc").innerHTML="The abbreviation for the British pound and Swiss franc (GBP/CHF) pair or cross for the currencies of the Great Britain (USD) and Switzerland (CHF). The currency pair shows how many Swiss francs (the quote currency) are needed to purchase one British Pound (the base currency). </br>";
        }else if(curr_name=="USD/CHF"){
        	document.getElementById("cur_nickname").innerHTML="Swissie";
        	document.getElementById("cur_desc").innerHTML="The abbreviation for the U.S. dollar and Swiss franc (USD/CHF) pair or cross for the currencies of the United States (USD) and Switzerland (CHF). The currency pair shows how many Swiss francs (the quote currency) are needed to purchase one U.S. dollar (the base currency). </br>";
        }else if(curr_name=="AUD/NZD"){
        	document.getElementById("cur_nickname").innerHTML="--";
        	document.getElementById("cur_desc").innerHTML="The abbreviation for the Australian dollar and New Zealand dollar (AUD/NZD) pair or cross for the currencies of Australia (AUD) and New Zealand (NZD). The currency pair shows how many New Zealand dollar (the quote currency) are needed to purchase one Australian dollar (the base currency). </br>";
        }else if(curr_name=="USD/CAD"){
        	document.getElementById("cur_nickname").innerHTML="--";
        	document.getElementById("cur_desc").innerHTML="The abbreviation for the Canadian dollar and U.S. Dollar (USD/CAD) pair or cross for the currencies of Canada (CAD) and United States (USD). The currency pair shows how many Canadian dollar (the quote currency) are required to purchase one U.S. dollar (the base currency). </br>";
        }
        // else if(curr_name=="USD/JPY"){
        // 	document.getElementById("cur_nickname").innerHTML="gopher";
        // 	document.getElementById("cur_desc").innerHTML=" </br>";
        // }else if(curr_name=="USD/JPY"){
        // 	document.getElementById("cur_nickname").innerHTML="gopher";
        // 	document.getElementById("cur_desc").innerHTML=" </br>";
        // }else if(curr_name=="USD/JPY"){
        // 	document.getElementById("cur_nickname").innerHTML="gopher";
        // 	document.getElementById("cur_desc").innerHTML=" </br>";
        // }else if(curr_name=="USD/JPY"){
        // 	document.getElementById("cur_nickname").innerHTML="gopher";
        // 	document.getElementById("cur_desc").innerHTML=" </br>";
        // }
        else{
          	document.getElementById("cur_nickname").innerHTML="--";	
            document.getElementById("cur_desc").innerHTML= "Sorry...No description available for this currency.";
        }
    }

// Arrondi les décimales
function roundFloat(num,dec){
    var d = 1;
    for (var i=0; i<dec; i++){
        d += "0";
    }
    return Math.round(num * d) / d;
}

function BarreOnclick() { 
  
	
	// curr_description();
 	//document.getElementById("cur_name").innerHTML= iCurrenciesDispather.CurrencyLink;
 
  
 //   location.href = "#hhh";

  
}

function BarreOnMove (e) { 
	
   x=e.clientX;
   y=e.clientY;
   iCurrenciesDispather.BarreStop();   
   iCurrenciesDispather.TrjLine_Localiser(x,y);
  
}

function BtnOnClick(curr){

		
		var price=iCurrenciesDispather.Mx_CurrenciesDispather[curr].price;
		return price;
}

function BarreOnMoveOut () { 

  iCurrenciesDispather.BarreGo();
  iCurrenciesDispather.Vitesse =CanvasAttr.cVitesse;
}





//Anime les élément en action
function Animer() {

    CanvasCtxt.fillStyle=CanvasAttr.cCanvasScreenColor ;

   CanvasCtxt.fillRect(CanvasAttr.cCanvasTop,CanvasAttr.cCanvasLeft,CanvasAttr.cCanvasWidth,CanvasAttr.cCanvasHeight);
 
    iCurrenciesDispather.TrjLine_IniPositions(); 

	iCurrenciesDispather.TrjLine_AfficherCurrencies();
	
    Pixelisation();
 
};

// Initialiser
function Initialiser() { 
 
    iCanvas=document.getElementById("CnvCurrenciesShow");
    //alert(icanvas);
	CanvasCtxt =iCanvas.getContext("2d");
	//alert(CanvasCtxt);

	iCanvas.width = window.innerWidth;

	//####### SECTION INITIALISATION #################/
    //Initialisation du dispatcher
 
 	//Instance de la classe 
	iCurrenciesDispather  = new  CurrenciesDispather();
	 
	iCurrenciesDispather.MxDispatchCreateNew(CanvasCtxt); 
	
 	iCurrenciesDispather.SetMxDispatchState(cDataStateCreation);
	
	iCurrenciesDispather.SetGlobalLeft();
	
	iCurrenciesDispather.SetGlobalLeft1();
	
	iCurrenciesDispather.IsTrjLine_IniMvtSet =  cFalse;


	
 
}

// Opérations des titres
function Traiter(MxCurreciesIn){ 

	iCurrenciesDispather.MxInAssign(MxCurreciesIn);

	var i=0;  

    
	
	for(var key in MxCurreciesIn) {
       
        var ObjCur = MxCurreciesIn[key];
    	
		//####### SECTION AFFECTATION  DE  DONNEÉES DANS LA MATRICE DE DISPATCH   #################/
        iCurrenciesDispather.AffecterMx( ObjCur,i);
		
		i++;
    }

	
    iCurrenciesDispather.SetDataStateEdit();
	
    //iCurrenciesDispather.TrjLine_IniPositions();
}


  //renvoie l'indice du pixel dans le data(matrice) 
 function getPixel(imagedata, x, y) {
   var i = (y * imagedata.width + x) * 4;
    return { ind: i, r: imagedata.data[i], g: imagedata.data[i+1], b: imagedata.data[i+2], a: imagedata.data[i+3]};
  }


// Pixélisation de la barre de défilement
function Pixelisation() {

 imgData=CanvasCtxt.getImageData(CanvasAttr.cCanvasTop,CanvasAttr.cCanvasLeft,CanvasAttr.cCanvasWidth,CanvasAttr.cCanvasHeight);

for (var i=0;i<imgData.width ;i++){
  
  for (var j=0;j<imgData.height;j++){
    if (j%2==0) { 
    Color = getPixel(imgData, i, j);	  
    if (i%2==0) { 
     imgData.data[Color.ind+0]=0;
     imgData.data[Color.ind+1]=0;
     imgData.data[Color.ind+2]=0;
     imgData.data[Color.ind+3]=250;
   }
  }
 }
}

 CanvasCtxt.putImageData(imgData,0,0);
}



