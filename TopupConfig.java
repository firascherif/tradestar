

import org.vertx.java.core.json.JsonObject;

/**
 * Holds the configuration information for the top up
 * 
 * @author dharani kumar p(dharani.kumar@gmail.com)
 *
 */
public final class TopupConfig {

	// Number of hours
	private int interval;
	// Threshold balance below which topup is allowed
	private int threshold;

	// The amount to topup
	private double topUpAmount;

	public TopupConfig(int interval, int threshold, double topUpAmount) {
		this.interval = interval;
		this.threshold = threshold;
		this.topUpAmount = topUpAmount;
	}

	public int getInterval() {
		return this.interval;
	}

	public int getThreshold() {
		return this.threshold;
	}

	public double getTopUpAmount() {
		return topUpAmount;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("TopupConfig [interval=");
		builder.append(interval);
		builder.append(", threshold=");
		builder.append(threshold);
		builder.append(", topUpAmount=");
		builder.append(topUpAmount);
		builder.append("]");
		return builder.toString();
	}

	public JsonObject toJson() {
		return new JsonObject().putNumber("interval", interval).putNumber("threshold", threshold)
				.putNumber("topUpAmount", topUpAmount);
	}

	public static TopupConfig getDefaultConfig() {
		return new TopupConfig(24, 5000, 5000);
	}
}
