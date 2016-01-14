
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;

 
/**
 * Creates a new entry in the database for a player
 * 
 * @author dharani kumar p (dharani.kumar@gmail.com)
 *
 */
public class XPCreatePlayerHandler implements Handler<Message<JsonObject>> {

	private final XPVerticle xpVerticle;
	private final XPConfig config;

	/**
	 * @param xpVerticle
	 */
	public XPCreatePlayerHandler(XPVerticle xpVerticle) {
		this.xpVerticle = xpVerticle;
		config = XPConfig.getDefaultConfig();
	}

	@Override
	public void handle(Message<JsonObject> message) {
		long startTime = System.currentTimeMillis();
		Logger logger = this.xpVerticle.getContainer().logger();
		JsonObject messageBody = message.body();
		logger.info("XPCreatePlayerHandler.handle() with message " + messageBody.encodePrettily());

		String username = messageBody.getString("username");

		if (username != null && !username.isEmpty()) {
			DatabaseManager dbManager = DatabaseManager.getInstance();

			JsonObject playerXPDetails = new JsonObject().putString("username", username).putNumber("totalXP", 0)
					.putNumber("currentLevel", 0).putNumber("pointsToNextLevel", config.getLevelOnePoints());

			JsonObject createPlayerXP = new JsonObject()
					.putString(DBManagerFields.collection.name(), DBCollections.xp.name())
					.putObject(DBManagerFields.document.name(), playerXPDetails);

			JsonObject result = dbManager.save(createPlayerXP);
			if (result.getString("status").equals("ok")) {
				this.xpVerticle.getContainer().logger().info("XP entry created for player " + username);

				this.xpVerticle.getVertx().eventBus().publish(username + "." + XPEventHandlersAddress.UpdateXP.name(),
						result.putObject("playerXP", playerXPDetails));
			} else {
				logger.error("Failed to create entry for player " + username + ". Reason " + result.encodePrettily());
			}

		} else {
			logger.error("username is not provided.");
		}
		logger.info("Time taken : " + (System.currentTimeMillis() - startTime) + "ms");
	}
}