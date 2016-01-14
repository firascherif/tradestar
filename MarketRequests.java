
import java.util.Map;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.platform.Verticle;

public class MarketRequests extends Verticle {

	Map<String, Float> currencyMap;
	JsonObject currencies;
	EventBus eb;

	public void start() {
		System.out.println("MarketRequests.start()");

		currencyMap = vertx.sharedData().getMap("fakeCurrencyMap");

		eb = vertx.eventBus();

		currencies = new JsonObject();

		Handler<Message<JsonObject>> requestCurrencyHandler = new Handler<Message<JsonObject>>() {
			public void handle(Message<JsonObject> message) {

				for (String key : currencyMap.keySet()) {
					currencies.putNumber(key, currencyMap.get(key));
				}

				message.reply(currencies);
			}
		};

		eb.registerHandler("RequestCurrency", requestCurrencyHandler);
	}
}
