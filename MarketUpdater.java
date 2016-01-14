

import java.text.DecimalFormat;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.platform.Verticle;

public class MarketUpdater extends Verticle {

	JsonObject currencyList;
	List currencyStore = new ArrayList();

	EventBus eb;
	

	Map<String, Float> currencyMap;

	public void start() {

//		System.out.println("MarketUpdater.start()");

		eb = vertx.eventBus();

		currencyMap = vertx.sharedData().getMap("fakeCurrencyMap");



//System.out.println("repetition currencyMap1 " + currencyMap.size());


		CurrencyTypes[] currencies = new CurrencyTypes[8];
		currencies[0] = new CurrencyTypes(1.1078f, "AUD/NZD", 0.0001f);
		currencies[1] = new CurrencyTypes(1.4249f, "EUR/AUD", 0.0005f);
		currencies[2] = new CurrencyTypes(1.3527f, "EUR/USD", 0.0002f);
		currencies[3] = new CurrencyTypes(1.5130f, "GBP/CHF", 0.0003f);
		currencies[4] = new CurrencyTypes(1.6570f, "GBP/USD", 0.00005f);
		currencies[5] = new CurrencyTypes(1.0932f, "USD/CAD", 0.00004f);
		currencies[6] = new CurrencyTypes(0.9120f, "USD/CHF", 0.0002f);
		currencies[7] = new CurrencyTypes(103.527f, "USD/JPY", 0.02f);
	
	
	
		

		DecimalFormat df = new DecimalFormat("#.####");

		
		JsonArray arrayForBar;
		float percentage;

		while (true) {

			arrayForBar = new JsonArray();
currencyList = new JsonObject();




			for (CurrencyTypes currency : currencies) {

				


				currency.updateCurrency();
				
				currencyList.putNumber(currency.getName(), currency.getCurrentRate());
				currencyStore.add(currency);

				// if(currency.getName().equals("USD/CAD")){
				// System.out.println(currency.getCurrentRate());
				// }

				percentage = ((currency.getCurrentRate() - currency.getOpeningRate()) / currency.getOpeningRate())
						* 100;

				arrayForBar.add(new JsonObject().putString("currency", currency.getName()).putNumber("volume", 0)
						.putNumber("price", currency.getCurrentRate()).putString("time", "0")
						.putNumber("percentage", percentage));

			}


			//vertx.eventBus().publish("RealTimeTrades", currencyList);
          //  System.out.println("arrayForBar");
			//System.out.println(arrayForBar);
			vertx.eventBus().publish("ArrayForBar", arrayForBar);
			vertx.eventBus().publish("FakeTradingData", currencyList);

 

			for (int i = 0; i < currencies.length; i++) {
				currencyMap.put(currencies[i].getName(), currencies[i].getCurrentRate());
			}

//  currencyMap.clear();
//System.out.println("currencyMap");

//System.out.println("repetition currencyMap3 " + currencyMap.size());

			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

	
/*
		eb = vertx.eventBus();

		JsonObject currencies2 = new JsonObject();

		Handler<Message<JsonObject>> requestCurrencyHandler = new Handler<Message<JsonObject>>() {
			public void handle(Message<JsonObject> message) {
					JsonObject body = message.body();
					String packageNumber =Integer.parseInt(body.getString("packageNumber"));
					for(int i = 0;i<packageNumber;i++){



				for (String key : currencyMap.keySet()) {
					currencies2.putNumber(key, currencyMap.get(key));
				}
			}
			

				message.reply(currencies2);
			}
		};

		eb.registerHandler("RequestCurrency", requestCurrencyHandler);

		*/




		}
	}
}
