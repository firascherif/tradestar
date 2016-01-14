

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;
/*
import com.evtech.tradestar.DBCollections;
import com.evtech.tradestar.DBManagerFields;
import com.evtech.tradestar.DatabaseManager;*/

/**
 * Retrives the player XP from database
 * 
 * @author dharani kumar p (dharani.kumar@gmail.com)
 *
 */
public class GetPlayerXPHandler implements Handler<Message<JsonObject>> {

	private final XPVerticle xpVerticle;

	/**
	 * @param xpVerticle
	 */
	public GetPlayerXPHandler(XPVerticle xpVerticle) {
		this.xpVerticle = xpVerticle;
	}

	@Override
	public void handle(Message<JsonObject> message) {
		long startTime = System.currentTimeMillis();
		Logger logger = xpVerticle.getContainer().logger();
		JsonObject messageBody = message.body();
		logger.info("GetPlayerXPHandler.handle() with message " + messageBody.encodePrettily());

		String username = messageBody.getString("username");

		if (username != null && !username.isEmpty()) {
			DatabaseManager dbManager = DatabaseManager.getInstance();

			JsonObject getPlayerXPRequest = new JsonObject()
					.putString(DBManagerFields.collection.name(), DBCollections.xp.name())
					.putObject(DBManagerFields.matcher.name(), new JsonObject().putString("username", username));

			JsonArray results = dbManager.find(getPlayerXPRequest).getArray("results");

			if (results.size() > 0) {
				message.reply(new JsonObject().putString("status", "ok").putObject("playerXP", results.get(0))
						.putObject("xpConfig", XPConfig.getDefaultConfig().toJson()));
			} else {

				message.reply(new JsonObject().putString("status", "error").putString("reason",
						"username " + username + " not found!!!"));

				logger.info("Player " + username + " is not present in XP collection. So add it now.");
				this.xpVerticle.getVertx().eventBus().publish(XPEventHandlersAddress.CreatePlayerXP.name(),
						new JsonObject().putString("username", username));
			}

		} else {
			message.reply(
					new JsonObject().putString("status", "error").putString("reason", "username is not provided."));
		}
		logger.info("Time taken : " + (System.currentTimeMillis() - startTime) + "ms");
	}
}