
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;

public class Player {

	private String sessionID;
	private String username;
	private String flagUrl;
	private String imgUrl;
	private String email;
	private double level;
	private double balance;
	private int streak;
	private int numStars;
	

	Map<String, Financials> tableFinancials;

	public Player(String sessionID, String username,String email, String flagUrl, String imgUrl, double level, double balance,
			int streak, int numStars) {
		this.sessionID = sessionID;
		this.username = username;
		this.email = email;
		this.flagUrl = flagUrl;
		this.imgUrl = imgUrl;
		this.level = level;
		this.balance = balance;
		this.streak = streak;
		this.numStars = numStars;
		tableFinancials = new ConcurrentHashMap<>();
	}

	public String getSessionID() {
		return sessionID;
	}

	public String getEmail() {
		return email;
	}

	public void setMail(String Email) {
		this.email = Email;
	}

	public void setSessionID(String sessionID) {
		this.sessionID = sessionID;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getFlagUrl() {
		return flagUrl;
	}

	public void setFlagUrl(String flagUrl) {
		this.flagUrl = flagUrl;
	}

	public String getImgUrl() {
		return imgUrl;
	}

	public void setImgUrl(String imgUrl) {
		this.imgUrl = imgUrl;
	}

	public double getLevel() {
		return level;
	}

	public void setLevel(double level) {
		this.level = level;
	}

	public double getBalance() {
		return balance;
	}

	public void setBalance(double balance) {
		this.balance = balance;
	}

	public int getStreak() {
		return streak;
	}

	public void setStreak(int streak) {
		this.streak = streak;
	}

	public int getNumStars() {
		return numStars;
	}

	public void setNumStars(int numStars) {
		this.numStars = numStars;
	}

	public void initializeTableFinancials(String tableName, float startMoney, int order) {
		tableFinancials.put(tableName, new Financials(startMoney, order));
	}

	public Financials getTableFinancials(String tableName) {
		return tableFinancials.get(tableName);
	}

	public void removeTableFinancials(String tableName) {
		tableFinancials.remove(tableName);
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		long temp;
		temp = Double.doubleToLongBits(balance);
		result = prime * result + (int) (temp ^ (temp >>> 32));
		result = prime * result + ((flagUrl == null) ? 0 : flagUrl.hashCode());
		result = prime * result + ((imgUrl == null) ? 0 : imgUrl.hashCode());
		temp = Double.doubleToLongBits(level);
		result = prime * result + (int) (temp ^ (temp >>> 32));
		result = prime * result + ((sessionID == null) ? 0 : sessionID.hashCode());
		result = prime * result + streak;
		result = prime * result + ((username == null) ? 0 : username.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Player other = (Player) obj;
		if (Double.doubleToLongBits(balance) != Double.doubleToLongBits(other.balance))
			return false;
		if (flagUrl == null) {
			if (other.flagUrl != null)
				return false;
		} else if (!flagUrl.equals(other.flagUrl))
			return false;
		if (imgUrl == null) {
			if (other.imgUrl != null)
				return false;
		} else if (!imgUrl.equals(other.imgUrl))
			return false;
		if (Double.doubleToLongBits(level) != Double.doubleToLongBits(other.level))
			return false;
		if (sessionID == null) {
			if (other.sessionID != null)
				return false;
		} else if (!sessionID.equals(other.sessionID))
			return false;
		if (streak != other.streak)
			return false;
		if (username == null) {
			if (other.username != null)
				return false;
		} else if (!username.equals(other.username))
			return false;
		return true;
	}

	public JsonObject toJson() {
		JsonArray tables = new JsonArray();

		for (String key : tableFinancials.keySet()) {
			tables.add(new JsonObject().putString("tableName", key));
		}

		JsonObject newPlayerObj = new JsonObject().putString("username", getUsername())
				.putString("flagUrl", getFlagUrl()).putString("imgUrl", getImgUrl()).putNumber("level", getLevel())
				.putNumber("streak", getStreak()).putNumber("balance", getBalance()).putArray("tables", tables)
				.putNumber("numStars", getNumStars()).putString("email", getEmail());

		return newPlayerObj;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder(200);
		builder.append("Player [sessionID=");
		builder.append(sessionID);
		builder.append(", username=");
		builder.append(username);
		builder.append(", mail=");
		builder.append(email);
		builder.append(", flagUrl=");
		builder.append(flagUrl);
		builder.append(", imgUrl=");
		builder.append(imgUrl);
		builder.append(", level=");
		builder.append(level);
		builder.append(", balance=");
		builder.append(balance);
		builder.append(", streak=");
		builder.append(streak);
		builder.append(", numStars=");
		builder.append(numStars);
		builder.append(", tableFinancials=");
		builder.append(tableFinancials);
		builder.append("]");
		return builder.toString();
	}
}
