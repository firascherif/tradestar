
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;
/*
import com.evtech.tradestar.DBCollections;
import com.evtech.tradestar.DBManagerFields;
import com.evtech.tradestar.DatabaseManager;*/

/**
 * This event handler updates the player XP in the data base.
 * 
 * @author dharani kumar p (dharani.kumar@gmail.com)
 *
 */
public class XPDBUpdateHandler implements Handler<Message<JsonObject>> {

	private final XPVerticle xpVerticle;

	public XPDBUpdateHandler(XPVerticle xpVerticle) {
		this.xpVerticle = xpVerticle;
	}

	@Override
	public void handle(Message<JsonObject> message) {
		long startTime = System.currentTimeMillis();

		Logger logger = this.xpVerticle.getContainer().logger();
		JsonObject messageBody = message.body();
		logger.info("XPDBUpdateHandler.handle() with message " + messageBody.encodePrettily());

		JsonObject playerXPObj = messageBody.getObject("playerXP");
		String username = playerXPObj != null ? playerXPObj.getString("username") : null;

		if (username != null && !username.isEmpty()) {
			DatabaseManager dbManager = DatabaseManager.getInstance();

			JsonObject updatePlayerXP = new JsonObject()
					.putString(DBManagerFields.collection.name(), DBCollections.xp.name())
					.putObject(DBManagerFields.criteria.name(), new JsonObject().putString("username", username))
					.putObject(DBManagerFields.objNew.name(), messageBody.getObject("playerXP"));

			JsonObject result = dbManager.update(updatePlayerXP);
			logger.info("result of udpating XP of player " + username + " is " + result.encodePrettily());

		} else {
			logger.error("username is not provided.");
		}
		logger.info("Time taken : " + (System.currentTimeMillis() - startTime) + "ms");
	}

}
