

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.platform.Verticle;
 
/**
 * This verticle handles the balance top up for a player (reload chips)
 * 
 * @author dharani kumar p(dharani.kumar@gmail.com)
 *
 */
public class TopupVerticle extends Verticle {

	@Override
	public void start() {
		container.logger().info("TopupVerticle.start()");

		vertx.eventBus().registerHandler(EventbusAddress.GetTimeRemainingForTopup.name(),
				new GetTimeRemainingForNextTopupHandler());
		vertx.eventBus().registerHandler(EventbusAddress.PerformBalanceTopup.name(), new PerformBalanceTopupHandler());
	}

	@Override
	public void stop() {
		container.logger().info("TopupVerticle.stop()");
	}

	private class GetTimeRemainingForNextTopupHandler implements Handler<Message<JsonObject>> {

		@Override
		public void handle(Message<JsonObject> message) {
			long startTime = System.currentTimeMillis();
			JsonObject body = message.body();

			container.logger()
					.info("GetTimeRemainingForNextTopupHandler.handle() with message " + body.encodePrettily());

			String username = body.getString("username");

			if (username != null && !username.isEmpty()) {

				DatabaseManager dbManager = DatabaseManager.getInstance();

				JsonObject query = new JsonObject()
						.putString(DBManagerFields.collection.name(), DBCollections.users.name())
						.putObject(DBManagerFields.matcher.name(), new JsonObject().putString("username", username));

				JsonArray results = dbManager.find(query).getArray("results");

				if (results.size() <= 0) {
					message.reply(
							new JsonObject().putString("status", "error").putString("message", "Invalid username!!!"));

				} else {

					JsonObject userObj = results.get(0);
					long timeRemainingInSecs = 0;

					if (userObj.containsField("topUp")) {
						long timeLastToppedUp = userObj.getLong("topUp");
						long currentTime = System.currentTimeMillis();
						long diff = timeLastToppedUp + (TopupConfig.getDefaultConfig().getInterval() * 60 * 60 * 1000);
						if (diff > currentTime) {
							timeRemainingInSecs = (diff - currentTime) / 1000;
						}
					}
					message.reply(new JsonObject().putString("status", "ok").putNumber("timeRemainingInSecs",
							timeRemainingInSecs));
				}

			} else {
				message.reply(new JsonObject().putString("status", "error").putString("message",
						"Mandatory params are missing in request"));
			}
			container.logger().info("Time taken " + (System.currentTimeMillis() - startTime) + "ms");
		}
	}

	private class PerformBalanceTopupHandler implements Handler<Message<JsonObject>> {

		@Override
		public void handle(Message<JsonObject> message) {
			long startTime = System.currentTimeMillis();
			JsonObject body = message.body();

			container.logger().info("PerformBalanceTopupHandler.handle() with message " + body.encodePrettily());

			String username = body.getString("username");
			Number balanceObj = body.getNumber("balance");

			if (username != null && !username.isEmpty() && balanceObj != null) {

				double balance = balanceObj.doubleValue();

				if (balance < TopupConfig.getDefaultConfig().getThreshold()) {

					vertx.eventBus().send(EventbusAddress.GetTimeRemainingForTopup.name(),
							new JsonObject().putString("username", username), new Handler<Message<JsonObject>>() {

								@Override
								public void handle(Message<JsonObject> reply) {
									JsonObject replyBody = reply.body();

									if (replyBody.getString("status").equals("ok")) {

										long timeRemainingInSecs = replyBody.getNumber("timeRemainingInSecs")
												.longValue();

										if (timeRemainingInSecs <= 0) {
											// Now perform top up

											double newBalance = balance
													+ TopupConfig.getDefaultConfig().getTopUpAmount();

											JsonObject playerUpdateJson = new JsonObject()
													.putString("username", username).putNumber("balance", newBalance);

											vertx.eventBus().publish(EventbusAddress.PlayerUpdates.name(),
													playerUpdateJson);

											vertx.eventBus().publish("Authenticator",
													new JsonObject().putString("action", "update")
															.putString("username", username).putObject("fields",
																	new JsonObject().putNumber("balance", newBalance)
																			.putNumber("topUp",
																					System.currentTimeMillis())));

											message.reply(new JsonObject().putString("status", "ok"));

										} else {
											message.reply(new JsonObject().putString("status", "error").putString(
													"message",
													"Still " + timeRemainingInSecs + " seconds remaining to top up."));
										}

									} else {
										message.reply(replyBody);
									}
								}

							});
				} else {
					message.reply(
							new JsonObject().putString("status", "error").putString("message",
									"Balance amount is greater than threshold amount of "
											+ TopupConfig.getDefaultConfig().getThreshold()
											+ ". You cannot topup now."));
				}

			} else {
				message.reply(new JsonObject().putString("status", "error").putString("message",
						"Mandatory params are missing in request"));
			}
			container.logger().info("Time taken " + (System.currentTimeMillis() - startTime) + "ms");
		}
	}
}
