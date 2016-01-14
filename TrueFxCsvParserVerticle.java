

import java.io.IOException;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.SortedSet;
import java.util.StringTokenizer;
import java.util.TreeSet;

import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.platform.Verticle;

import com.evtech.tradestar.EventbusAddress;

/**
 * Establish an authenticated session with truefx API and retrieves data in CSV
 * format. Parses and puts the data JSON format
 * 
 * @author dharani kumar p(dharani.kumar@gmail.com)
 *
 */
public class TrueFxCsvParserVerticle extends Verticle {

	private static final String USERNAME = "dharanikumar";
	private static final String PASSWORD = "26176667";
	public static final String FORMAT = "csv";
	Map<String, Float> RealCurrencyMap;
	Map<String, Float> FakeCurrencyMap;
	private JsonArray arrayForBar;


	

	public static final String[] ALL_CURRENCIES = { "EUR/USD", "USD/JPY", "GBP/USD", "EUR/GBP", "USD/CHF", "AUD/NZD",
			"CAD/CHF", "CHF/JPY", "EUR/AUD", "EUR/CAD", "EUR/JPY", "EUR/CHF", "USD/CAD", "AUD/USD", "GBP/JPY",
			"AUD/CAD", "AUD/CHF", "AUD/JPY", "EUR/NOK", "EUR/NZD", "GBP/CAD", "GBP/CHF", "NZD/JPY", "NZD/USD",
			"USD/NOK", "USD/SEK" };

	public static final String CONNECT_URL = "http://webrates.truefx.com/rates/connect.html?u=dharanikumar&p=26176667&q=techrates&c="
			+ String.join(",", ALL_CURRENCIES) + "&f=csv&s=y";
	// +
	// "EUR/USD,USD/JPY,GBP/USD,EUR/GBP,USD/CHF,AUD/NZD,CAD/CHF,CHF/JPY,EUR/AUD,EUR/CAD,EUR/JPY,EUR/CHF,USD/CAD,AUD/USD,GBP/JPY,"
	// +
	// "AUD/CAD,AUD/CHF,AUD/JPY,EUR/NOK,EUR/NZD,GBP/CAD,GBP/CHF,NZD/JPY,NZD/USD,USD/NOK,USD/SEK&f=csv&s=y";

	public static final String SESSION_URL = "http://webrates.truefx.com/rates/connect.html?id=" + USERNAME + ":"
			+ PASSWORD + ":techrates:";

	public static final int TIMER_REFRESH = 5000;
	public static final int MAX_OHLCDATA = 30;
	private Map<String, SortedSet<JsonObject>> currencyMap = new HashMap<String, SortedSet<JsonObject>>();

	private String sessionId;

	public void start() {
		container.logger().info("TrueFxCsvParserVerticle.start()");

		container.logger().info("CONNECT_URL " + CONNECT_URL);
		
			arrayForBar = new JsonArray();
		
		
		RealCurrencyMap = vertx.sharedData().getMap("currencyMap");


		for (int i = 0; i < ALL_CURRENCIES.length; i++) {
			currencyMap.put(ALL_CURRENCIES[i], new TreeSet<JsonObject>(new OHLCDataComparator()));
		}

		vertx.eventBus().registerHandler(EventbusAddress.GetAllCurrencyPairs.name(),
				new Handler<Message<JsonObject>>() {

					@Override
					public void handle(Message<JsonObject> message) {
						long startTime = System.currentTimeMillis();

						message.reply(new JsonObject().putString("status", "ok").putArray("allCurrencies",
								new JsonArray(Arrays.asList(ALL_CURRENCIES))));

						container.logger().info("Time taken " + (System.currentTimeMillis() - startTime) + "ms");
					}
				});

		vertx.eventBus().registerHandler(EventbusAddress.GetLatestCurrencyQuote.name(),
				new Handler<Message<JsonObject>>() {
					@Override
					public void handle(Message<JsonObject> message) {
						long startTime = System.currentTimeMillis();
						JsonObject body = message.body();

						container.logger().info(
								EventbusAddress.GetLatestCurrencyQuote + " handler body " + body.encodePrettily());

						String currencyPair = body.getString("currencyPair");
						container.logger().info("currencyPair " + currencyPair);

						if (currencyPair != null && !currencyPair.isEmpty()) {

							SortedSet<JsonObject> set = currencyMap.get(currencyPair);
							container.logger().info("set.last() " + set.last());

							message.reply(
									new JsonObject().putString("status", "ok").putObject(currencyPair, set.last()));
							// message.reply(new
							// JsonObject().putString("status",
							// "ok").putObject(currencyPair,
							// new OHLCData(currencyPair,
							// System.currentTimeMillis(), Math.random(),
							// (int) (Math.random() * 1000), Math.random(), 100,
							// Math.random(),
							// Math.random(), Math.random()).toJson()));

						} else {
							message.reply(new JsonObject().putString("status", "error").putString("message",
									"Param currencyPair is missing in request"));
						}

						container.logger().info("Time taken " + (System.currentTimeMillis() - startTime) + "ms");
					}
				});

		vertx.eventBus().registerHandler(EventbusAddress.GetPastCurrencyQuotes.name(),
				new Handler<Message<JsonObject>>() {

					@Override
					public void handle(Message<JsonObject> message) {
						long startTime = System.currentTimeMillis();
						JsonObject body = message.body();
						container.logger()
								.info(EventbusAddress.GetPastCurrencyQuotes + " handler body " + body.encodePrettily());

						String currencyPair = body.getString("currencyPair");
						container.logger().info("currencyPair " + currencyPair);

						if (currencyPair != null && !currencyPair.isEmpty()) {
							SortedSet<JsonObject> set = currencyMap.get(currencyPair);
							JsonArray arr = new JsonArray();
							for (JsonObject jsonObject : set) {
								arr.addObject(jsonObject);
							}
							message.reply(new JsonObject().putString("status", "ok").putArray(currencyPair, arr));
						} else {
							message.reply(new JsonObject().putString("status", "error").putString("message",
									"Param currencyPair is missing in request"));
						}

						container.logger().info("Time taken " + (System.currentTimeMillis() - startTime) + "ms");
					}

				});

		vertx.setPeriodic(TIMER_REFRESH, new Handler<Long>() {

			@Override
			public void handle(Long event) {

				JsonObject allCurrenciesMap = null;

				if (TrueFxCsvParserVerticle.this.sessionId == null) {
					getSessionID();
				}
				allCurrenciesMap = fetchQuotes(TrueFxCsvParserVerticle.this.sessionId);
				Set<String> keySet = currencyMap.keySet();

				if (allCurrenciesMap != null && allCurrenciesMap.size() > 0) {
					for (String string : keySet) {
						SortedSet<JsonObject> sortedSet = currencyMap.get(string);
						sortedSet.add(allCurrenciesMap.getObject(string));
						if (sortedSet.size() > MAX_OHLCDATA) {
							sortedSet.remove(sortedSet.first());
						}
					}
				}
			}
		});


	}

	/*
	vertx.setPeriodic(1000,new Handler<Long() {
			@Override 
			public void handle(Long event){

				container.logger().info("");
				SortedSet<JsonObject> set = currencyMap.get("EUR/USD");
				container.logger().info(set.last());
				
				vertx.eventBus().publish("RealTimeCurrencyData2", set.last());


			}
		});

		*/

	public void stop() {
		container.logger().info("TrueFxCsvParserVerticle.stop()");
	}

	private JsonObject fetchQuotes(String sessionId) {
		JsonObject allCurrenciesMap = null;

		if (sessionId != null) {
			try {
				Document doc = Jsoup.connect(SESSION_URL + sessionId).timeout(5 * 1000).get();
				//container.logger().info("response from truefx " + doc);

				if (doc.text() != null && !doc.text().isEmpty()) {
					allCurrenciesMap = new JsonObject();
					StringTokenizer stOuter = new StringTokenizer(doc.text(), " ");

					if (stOuter.hasMoreTokens()) {
						while (stOuter.hasMoreTokens()) {

							StringTokenizer stInner = new StringTokenizer(stOuter.nextToken(), ",");
							double percentage;
							while (stInner.hasMoreTokens()) {
								String currencyPair = stInner.nextToken();
								OHLCData d1 = new OHLCData(currencyPair,
										Long.parseLong(stInner.nextToken()), stInner.nextToken(),
										stInner.nextToken(), Double.parseDouble(stInner.nextToken()),
										Integer.parseInt(stInner.nextToken()), Double.parseDouble(stInner.nextToken()),
										Double.parseDouble(stInner.nextToken()),
										Double.parseDouble(stInner.nextToken()));
								allCurrenciesMap.putObject(currencyPair,d1.toJson());
								RealCurrencyMap.put(d1.getCurrencyPair(), (float)d1.getClose());
								percentage = (d1.getClose() - 1.1013) / 1.1013;
								arrayForBar.add(new JsonObject().putString("currency", d1.getCurrencyPair()).putNumber("volume", 0)
										.putNumber("price", d1.getClose()).putString("time", "0")
										.putNumber("percentage", percentage));
								vertx.eventBus().publish("ArrayForBar", arrayForBar);
								


							}
						}

					} else {

					}

				}

			} catch (IOException e) {
				container.logger().error("IOException while retrieving value from truefx", e);
			} catch (Exception e) {
				container.logger().error("Exception caught while retrieving and parsing values from truefx", e);
			}
		}
		return allCurrenciesMap;
	}

	private void getSessionID() {
		try {
			Connection connect = Jsoup.connect(CONNECT_URL).timeout(5 * 1000);
			Connection.Response response = null;

			response = connect.execute();
			String htmlResponse = response.body();
			String[] segments = htmlResponse.split(":");
			// container.logger().info("session id " + segments[3]);

			sessionId = segments[3];
			// return segments[3];
		} catch (Exception e) {
			container.logger().error(e);
		}
		// return null;
	}

	private class OHLCDataComparator implements Comparator<JsonObject> {

		@Override
		public int compare(JsonObject o1, JsonObject o2) {
			long ts1 = o1.getLong("timeStamp");
			long ts2 = o2.getLong("timeStamp");

			return (int) (ts1 - ts2);
		}
	}
}
