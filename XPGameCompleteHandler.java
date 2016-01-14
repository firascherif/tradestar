
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;

/**
 * Listens for game complete event and publish the information to the points
 * calculator
 * 
 * @author dharani kumar p (dharani.kumar@gmail.com)
 *
 */
public class XPGameCompleteHandler implements Handler<Message<JsonObject>> {

	private final XPVerticle xpVerticle;

	/**
	 * @param xpVerticle
	 */
	public XPGameCompleteHandler(XPVerticle xpVerticle) {
		this.xpVerticle = xpVerticle;
	}

	@Override
	public void handle(Message<JsonObject> message) {
		long startTime = System.currentTimeMillis();
		Logger logger = xpVerticle.getContainer().logger();
		JsonObject body = message.body();
		logger.info("XPGameCompleteHandler.handle with message " + body.encodePrettily());

		JsonArray leaderBoard = body.getArray("leaderBoard");

		if (leaderBoard != null && leaderBoard.size() > 0) {

			for (int i = 0; i < leaderBoard.size(); i++) {

				JsonObject obj = (JsonObject) leaderBoard.get(i);
				obj.putNumber("totalGameTime", body.getNumber("totalGameTime"));
				obj.putString("tableName", body.getString("tableName"));
				obj.putNumber("tableBuyIn", body.getNumber("tableBuyIn"));
				publishToXPCalculator(obj, i == 0);
			}

		} else {
			logger.error("Attribute leaderBoard is not present");
		}
		logger.info("Time taken " + (System.currentTimeMillis() - startTime) + "ms");
	}

	private void publishToXPCalculator(JsonObject obj, boolean winner) {
		this.xpVerticle.getVertx().eventBus().send(XPEventHandlersAddress.GetPlayerXP.name(),
				new JsonObject().putString("username", obj.getString("username")), new Handler<Message<JsonObject>>() {

					@Override
					public void handle(Message<JsonObject> message) {

						JsonObject reply = message.body();
						if (reply.getString("status").equals("ok")) {

							JsonObject playerXP = reply.getObject("playerXP").putBoolean("winner", winner)
									.putNumber("totalGameTime", obj.getNumber("totalGameTime"))
									.putNumber("tableBuyIn", obj.getNumber("tableBuyIn"))
									.putString("tableName", obj.getString("tableName"));
							XPGameCompleteHandler.this.xpVerticle.getVertx().eventBus()
									.publish(XPEventHandlersAddress.CalculateXP.name(), playerXP);
						}
					}
				});
	}
}