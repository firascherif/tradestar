

import java.text.DecimalFormat;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Set;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.platform.Verticle;
import org.vertx.java.core.http.HttpClient;
import org.vertx.java.core.http.HttpClientResponse;
import org.vertx.java.core.http.HttpClientRequest;
import org.vertx.java.core.buffer.Buffer;

public class MarketUpdaterRealTime extends Verticle {
	public static final int TIMER_REFRESH = 1000;
    
    JsonArray currencyStore = new JsonArray();
    
    Map<String, Float> currencyMap;
    Map<String, Currency> currencyClassMap = new ConcurrentHashMap<String, Currency>();
    boolean firstTime = true;
 

	public void start(){
        
     String[] currencyNames = new String[]{"EUR/USD", "USD/JPY", "GBP/USD", "EUR/GBP", "USD/CHF", "EUR/JPY", "EUR/CHF", "USD/CAD", "AUD/USD", "GBP/JPY"};
        
        for(String currencyName : currencyNames) {
            currencyClassMap.put(currencyName, new Currency(currencyName));
            
        }
  
        
       

       
        EventBus eb = vertx.eventBus();
       
        currencyMap = vertx.sharedData().getMap("RealTradingData");  
        
      //  RealCurrencyMap = vertx.sharedData().getMap("currencyMap");

        HttpClient client = vertx.createHttpClient().setHost("webrates.truefx.com");

        HttpClientRequest request = client.get("//rates/connect.html?u=pauldetarse&p=p0498151&q=ozrates&f=csv&s=y/", new Handler<HttpClientResponse>() {
            public void handle(HttpClientResponse resp) {
                
                //container.logger().info("Got a response: " + resp.statusCode());
                resp.bodyHandler(new Handler<Buffer>(){
                        public void handle(Buffer buffer){
                            
                            
                     //       container.logger().info(buffer.toString());
                            String str = buffer.toString().trim();
                            String path = "/rates/connect.html?id="+ str;
                            vertx.setPeriodic(TIMER_REFRESH, new Handler<Long>() {

                        @Override
                        public void handle(Long event) {
                          HttpClientRequest request = client.get(path, new Handler<HttpClientResponse>() {
                            public void handle(HttpClientResponse resp) {

                                resp.bodyHandler(new Handler<Buffer>(){
                                    public void handle(Buffer buffer){
                                        
                                          JsonObject currencyObject = new JsonObject();
                                      
                                        
                                        
                                        /*
                                    percentage = ((currency.getCurrentRate() - currency.getOpeningRate()) / currency.getOpeningRate())
                                * 100;

                                arrayForBar.add(new JsonObject().putString("currency", currency.getName()).putNumber("volume", 0)
                                .putNumber("price", currency.getCurrentRate()).putString("time", "0")
                                .putNumber("percentage", percentage));
                                */


                                //   container.logger().info(buffer.toString());
                                currencyObject   = parseCurrencyData(buffer.toString());
                                        //  container.logger().info(currencyObject);
                               JsonArray arrayForBar = createObjectArrayForBar(currencyObject);
                                      //   container.logger().info(arrayForBar.encodePrettily());
                                

                                vertx.eventBus().publish("RealTradingData", currencyObject);
                             vertx.eventBus().publish("ArrayForBar", arrayForBar);
                    
        		              }

        	               });
        	           };
        	

                     });
        			  request.end();
                    }

        		});
        };
    });
};


});
        
     Handler<Message<JsonObject>> getPastCurrenciesHandler = new Handler<Message<JsonObject>>(){
         public void handle(Message<JsonObject> message){
             JsonArray replyCurrencyArray = new JsonArray();
             JsonObject messageBody = message.body();
            // container.logger().info("getPastCurrencies");
          //   container.logger().info(messageBody);
        //    final int currencyQuantity = Integer.parseInt(messageBody.getString("currencyQuantity"));
             final int currencyQuantity = messageBody.getNumber("currencyQuantity").intValue();
         
             
             if(currencyStore.size() >= currencyQuantity)
             {
                 for(int i = 0; i<currencyQuantity;i++)
                 {
                    replyCurrencyArray.add(currencyStore.get(i));
                    
                 }
                 message.reply(new JsonObject().putString("status", "ok").putArray("currencies", replyCurrencyArray));
                 
             }else{
                 /*
                 
                 long timerID = vertx.setPeriodic(10000, new Handler<Long>() {
    public void handle(Long timerID) {
          container.logger().info( currencyQuantity+" "+currencyStore.size());
        if(currencyQuantity<=currencyStore.size()) {
             container.logger().info("dans if ");
             container.logger().info(replyCurrencyArray);
            
          message.reply(new JsonObject().putString("status", "ok").putArray("currencies", replyCurrencyArray));
        }
        
        
    }
});
*/

                 
                  message.reply(new JsonObject().putString("status", "erreur"));
             }
              
             
             
             
         }
     };
        
         eb.registerHandler("GetPastCurrencies", getPastCurrenciesHandler);
        			  
        			  
request.end();
}
    
    public JsonObject parseCurrencyData(String currencyData ){
       String[] currencyRows = currencyData.split("\\s");
        float precedentValue = 0;
        JsonObject currencyList = new JsonObject();
        
        for(String currencyRow: currencyRows)
        {
            String[] currencyItem = currencyRow.split(",");
            String currencyName = currencyItem[0];
    
            String currencyValue = currencyItem[2]+currencyItem[3];
            
         
          /*  container.logger().info(currencyRow);
            container.logger().info(currencyName);
            container.logger().info(currencyValue);
            currencyObject.putNumber(currencyName,Float.parseFloat(currencyValue));*/
            
            
            currencyList.putNumber(currencyName,Float.parseFloat(currencyValue));
            currencyMap.put (currencyName, Float.parseFloat(currencyValue));
            
            
            
        }
        
        currencyStore.add(currencyList);
        
        
        return currencyList;
			
			
			
        
        	
            
            
    }
    
    
    public JsonArray createObjectArrayForBar(JsonObject currencyObject){
       
                            JsonArray arrayForBar = new JsonArray();
                            Currency currency = null;
                            float percentage = 0.0f;
            
                                        /*
                                    percentage = ((currency.getCurrentRate() - currency.getOpeningRate()) / currency.getOpeningRate())
                                * 100;

                                arrayForBar.add(new JsonObject().putString("currency", currency.getName()).putNumber("volume", 0)
                                .putNumber("price", currency.getCurrentRate()).putString("time", "0")
                                .putNumber("percentage", percentage));
                                */


                                //   container.logger().info(buffer.toString());
                                
                                  
                                  
                                        
                                   
                                Map map = currencyObject.toMap();
                                Set<Map.Entry<String,Float>> entrySet =  map.entrySet();
                                for(Map.Entry<String,Float> entry : entrySet){
                                   // container.logger().info(entry.getKey()+" "+entry.getValue());
                                    String presentCurrencyName = entry.getKey();
                                    float presentCurrencyValue = entry.getValue();
                                    
                                    currency = currencyClassMap.get(presentCurrencyName);
                                    
                                    
                                   /* float precedentCurrencyValue = currency.getPresentRate();
                                    currency.setPresentRate(presentCurrencyValue);
                                    currency.setPrecedentRate(precedentCurrencyValue);
                                    float percentage = currency.getPercentage();*/
                                     if(firstTime){
                                    //     container.logger().info("premiere fois");
                                            currency.setOpeningRate(presentCurrencyValue);
                                          
                                        //  container.logger().info(presentCurrencyValue);
                                        }
                                    
                                    currency.setPresentRate(presentCurrencyValue);
                                   
                                    percentage = currency.getPercentage();
                                    
                                      arrayForBar.add(new JsonObject().putString("currency", currency.getCurrencyName()).putNumber("volume",0).putNumber("price", currency.getPresentRate()).putString("time", "0").putNumber("percentage", percentage));
        
                                }
        if(  firstTime) {
              firstTime = false;
        }
        
      
        
        return arrayForBar;
        
                                
        
        
        
        
    }
}

