

import java.util.HashMap;
import java.util.Map;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.platform.Verticle;

import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import com.stripe.net.RequestOptions;
import com.stripe.net.RequestOptions.RequestOptionsBuilder;

/**
 * Handles the communication with stripe
 * 
 * @author dharani kumar p(dharani.kumar@gmail.com)
 *
 */
public class PaymentVerticle extends Verticle {

	public static final String TEST_SECRET_KEY = "sk_test_mEUWGqZnXdQoyTqcl6n85ezS";
	public static final String LIVE_SECRET_KEY = "sk_live_igDrqqk5OWswzNOe6E2aiZ6q";

	public static final String SUCCEEDED = "succeeded";

	@Override
	public void start() {
		container.logger().info("PaymentVerticle.start()");
		vertx.eventBus().registerHandler(EventbusAddress.ChargePayment.name(), new PaymentHandler());
	}

	@Override
	public void stop() {
		container.logger().info("PaymentVerticle.stop()");
	}

	private class PaymentHandler implements Handler<Message<JsonObject>> {

		@Override
		public void handle(Message<JsonObject> message) {
			long startTime = System.currentTimeMillis();
			JsonObject body = message.body();

			container.logger().info("PaymentHandler.handle() with message " + body.encodePrettily());

			String username = body.getString("username");
			String sessionID = body.getString("sessionID");
			String source = body.getString("token");
			String currency = body.getString("currency");

			if (username != null && !username.isEmpty() && sessionID != null && !sessionID.isEmpty() && source != null
					&& !source.isEmpty() && currency != null && !currency.isEmpty() && body.containsField("numChips")
					&& body.containsField("balance")) {
				int amountInCents = body.getNumber("amount").intValue();
				double currentBalance = body.getNumber("balance").doubleValue();
				int numChips = body.getNumber("numChips").intValue();

				RequestOptions requestOptions = new RequestOptionsBuilder().setApiKey(TEST_SECRET_KEY).build();
				Map<String, Object> chargeMap = new HashMap<String, Object>(10, 1);
				chargeMap.put("amount", amountInCents);
				chargeMap.put("currency", currency);
				chargeMap.put("source", source);

				try {
					Charge charge = Charge.create(chargeMap, requestOptions);

					if (charge.getStatus().equals(SUCCEEDED)) {

						// First send reply to the client
						message.reply(new JsonObject().putString("status", "ok").putString("message",
								charge.getReceiptNumber()));

						double newBalance = currentBalance + numChips;

						JsonObject playerUpdateJson = new JsonObject().putString("username", username)
								.putNumber("balance", newBalance);

						vertx.eventBus().publish(EventbusAddress.PlayerUpdates.name(), playerUpdateJson);

						vertx.eventBus().publish("Authenticator",
								new JsonObject().putString("action", "update").putString("username", username)
										.putObject("fields", new JsonObject().putNumber("balance", newBalance)));

					} else {
						container.logger().error("Payment failed with error code " + charge.getFailureCode()
								+ ", error message " + charge.getFailureMessage());

						message.reply(new JsonObject().putString("status", "error").putString("message",
								charge.getFailureCode() + ", " + charge.getFailureMessage()));
					}

				} catch (StripeException e) {
					container.logger().error("Exception while processing payment", e);
					message.reply(new JsonObject().putString("status", "error").putString("message", e.getMessage()));
				}
			} else {
				message.reply(new JsonObject().putString("status", "error").putString("message",
						"Mandatory parameters are missing in payload"));
			}
			container.logger().info("Time taken " + (System.currentTimeMillis() - startTime) + "ms");
		}

	}
}
