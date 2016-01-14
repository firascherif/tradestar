
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.platform.Verticle;

/**
 * Calculates points and publish the information to the listeners
 * 
 * @author dharani kumar p (dharani.kumar@gmail.com)
 *
 */
public class XPCalculatorHandler implements Handler<Message<JsonObject>> {

	private final Verticle xpVerticle;
	private final XPConfig config;

	public XPCalculatorHandler(Verticle xpVerticle) {
		this.xpVerticle = xpVerticle;
		config = XPConfig.getDefaultConfig();
	}

	@Override
	public void handle(Message<JsonObject> message) {
		Logger logger = xpVerticle.getContainer().logger();
		long startTime = System.currentTimeMillis();
		JsonObject body = message.body();
		logger.info("XPCalculatorHandler.handle with message " + body.encodePrettily());

		boolean levelUp = false;
		double currentLevel = body.getNumber("currentLevel").doubleValue();
		double totalXP = body.getNumber("totalXP").doubleValue();
		double totalGameTime = (body.getNumber("totalGameTime").doubleValue()) / (1000 * 60);
		float tableBuyIn = body.getNumber("tableBuyIn").floatValue();

		double pointsToNextLevel = config.getLevelOnePoints() * (Math.pow(config.getMultiplier(), currentLevel));

		double newXP = totalXP + totalGameTime * config.getXpPerMinute() + tableBuyIn * config.getBuyinMultiplier();

		if (body.getBoolean("winner")) {
			newXP += config.getXpPerWin();
		}

		if (newXP >= pointsToNextLevel) {
			currentLevel += 1;
			levelUp = true;

			pointsToNextLevel = config.getLevelOnePoints() * (Math.pow(config.getMultiplier(), currentLevel));
		}

		JsonObject newXPDetails = new JsonObject().putString("username", body.getString("username"))
				.putNumber("totalXP", newXP).putNumber("pointsToNextLevel", pointsToNextLevel)
				.putNumber("currentLevel", currentLevel);

		// publish the XP changes to database as well as client
		JsonObject pushMessage = new JsonObject().putString("status", "ok").putBoolean("levelUP", levelUp)
				.putObject("playerXP", newXPDetails).putObject("xpConfig", config.toJson());

		this.xpVerticle.getVertx().eventBus()
				.publish(body.getString("username") + "." + XPEventHandlersAddress.UpdateXP.name(), pushMessage);

		this.xpVerticle.getVertx().eventBus().publish(XPEventHandlersAddress.UpdateXPDB.name(), pushMessage);

		logger.info("Time taken : " + (System.currentTimeMillis() - startTime) + " ms");
	}
}
