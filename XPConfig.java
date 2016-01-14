
import org.vertx.java.core.json.JsonObject;

/**
 * The place holder class to hold XP configuration
 * 
 * @author dharani kumar p (dharani.kumar@gmail.com)
 *
 */
public final class XPConfig {

	private double multiplier;
	private double xpPerMinute;
	private double xpPerWin;
	private double levelOnePoints;
	private double buyinMultiplier;

	public XPConfig(JsonObject json) {
		this(json.getNumber("multiplier").doubleValue(), json.getNumber("xpPerMinute").doubleValue(),
				json.getNumber("xpPerWin").doubleValue(), json.getNumber("levelOnePoints").doubleValue(),
				json.getNumber("buyinMultiplier").doubleValue());
	}

	public XPConfig(double multiplier, double xpPerMinute, double xpPerWin, double levelOnePoints,
			double buyinMultiplier) {
		this.multiplier = multiplier;
		this.xpPerMinute = xpPerMinute;
		this.xpPerWin = xpPerWin;
		this.levelOnePoints = levelOnePoints;
		this.buyinMultiplier = buyinMultiplier;
	}

	public double getMultiplier() {
		return multiplier;
	}

	public double getXpPerMinute() {
		return xpPerMinute;
	}

	public double getXpPerWin() {
		return xpPerWin;
	}

	public double getLevelOnePoints() {
		return levelOnePoints;
	}

	public double getBuyinMultiplier() {
		return buyinMultiplier;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("XPConfig [multiplier=");
		builder.append(multiplier);
		builder.append(", xpPerMinute=");
		builder.append(xpPerMinute);
		builder.append(", xpPerWin=");
		builder.append(xpPerWin);
		builder.append(", levelOnePoints=");
		builder.append(levelOnePoints);
		builder.append(", buyinMultiplier=");
		builder.append(buyinMultiplier);
		builder.append("]");
		return builder.toString();
	}

	public JsonObject toJson() {
		return new JsonObject().putNumber("multiplier", multiplier).putNumber("xpPerMinute", xpPerMinute)
				.putNumber("xpPerWin", xpPerWin).putNumber("levelOnePoints", levelOnePoints)
				.putNumber("buyinMultipler", buyinMultiplier);
	}

	public static XPConfig getDefaultConfig() {
		return new XPConfig(2.5, 0.5, 50, 500, 0.025);
	}
}
