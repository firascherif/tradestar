

import org.vertx.java.platform.Verticle;
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.logging.Logger;

import java.util.Arrays;
import java.util.Map;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.logging.Level;

/**
 * This verticle will fetch real time quotes from the URL webrates.truefx.com
 * and publish it to
 * 
 * @author unknown
 *
 */
public class JsoupWorker extends Verticle {

	public static final String CONNECT_URL = "http://webrates.truefx.com/rates/connect.html?u=Caponne01&p=Salope01&q=techrates&c="
			+ "EUR/USD,USD/JPY,GBP/USD,EUR/GBP,USD/CHF,AUD/NZD,CAD/CHF,CHF/JPY,EUR/AUD,EUR/CAD,EUR/JPY,EUR/CHF,USD/CAD,AUD/USD,GBP/JPY,"
			+ "AUD/CAD,AUD/CHF,AUD/JPY,EUR/NOK,EUR/NZD,GBP/CAD,GBP/CHF,NZD/JPY,NZD/USD,USD/NOK,USD/SEK&f=html&s=y";

	public static final String SESSION_URL = "http://webrates.truefx.com/rates/connect.html?id=Caponne01:Salope01:techrates:";

	Map<String, Double> currencyMap;
	JsonObject currencyList = new JsonObject();;

	String[] arrForex = new String[69];
	String[] arrForexTemp = new String[69];
	DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
	Logger logger;

	public void start() {
		container.logger().info("JsoupWorker.start()");

		currencyMap = vertx.sharedData().getMap("currencyMap");

		while (true)
			try {
				Fetchquotes(FetchSessID());
			} catch (InterruptedException | IOException ex) {
				java.util.logging.Logger.getLogger(JsoupWorker.class.getName()).log(Level.SEVERE, null, ex);
			}
	}

	public String FetchSessID() throws IOException {
		Connection connect = Jsoup.connect(CONNECT_URL).timeout(5 * 1000);
		Connection.Response response = null;

		response = connect.execute();
		String htmlResponse = response.body();
		String[] Segments = htmlResponse.split(":");

		return Segments[3];
	}

	public JsonArray Fetchquotes(String SessionId) throws InterruptedException, IOException {
		JsonArray arrObj = new JsonArray();
		Document doc;
		Elements elements;
		int c = 0, v = 1, y = 2, z = 3;

		System.arraycopy(arrForex, 0, arrForexTemp, 0, arrForex.length);

		doc = Jsoup.connect(SESSION_URL + SessionId).timeout(5 * 1000).get();
		elements = doc.getElementsByTag("td");

		for (int i = 0; i < 69; i += 3) {
			arrForex[i] = elements.eq(c).text();
			arrForex[i + 1] = elements.eq(v).text();
			arrForex[i + 2] = elements.eq(y).text() + elements.eq(z).text();

			c += 9;
			v += 9;
			y += 9;
			z += 9;
			Calendar cal = Calendar.getInstance();

			currencyMap.put(arrForex[i], Double.parseDouble(arrForex[i + 2]));

			currencyList.putNumber(arrForex[i], Double.parseDouble(arrForex[i + 2]));

			arrObj.add(new JsonObject().putString("currency", arrForex[i]).putString("volume", arrForex[i + 1])
					.putString("price", arrForex[i + 2]).putString("time", (dateFormat.format(cal.getTime()))));

		}

		vertx.eventBus().publish("RealTimeTrades", currencyList);

		if (!Arrays.equals(arrForex, arrForexTemp)) {
			vertx.eventBus().publish("ArrayForBar", arrObj);
		}

		Thread.sleep(200);
		return arrObj;
	}

	public void stop() {
		container.logger().info("JsoupWorker.stop()");
	}
}