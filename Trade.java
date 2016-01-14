
import org.vertx.java.core.json.JsonObject;

public class Trade {
    String ID;
    String type;
    String currency;
    float curValAtPurchase;
    float volume;
    int typeFlag;

    public Trade(float volume, float curValAtPurchase, String currency, int typeFlag, String ID) {
        this.volume = volume;
        this.curValAtPurchase = curValAtPurchase;
        this.currency = currency;
        this.typeFlag = typeFlag;

        if (typeFlag == 1) this.type = "Buy";
        else this.type = "Sell";

        this.ID = ID;
    }

    public void print() {
        System.out.println("-----------------------------");
        System.out.println("New " + type + " Trade");
        System.out.println("Currency: " + currency);
        System.out.println("Purchased @: " + curValAtPurchase);
        System.out.println("Volume: " + volume);
        System.out.println("Trade ID: " + ID);
        System.out.println("-----------------------------");
    }

    public JsonObject toJson() {
        JsonObject tradeAsJson = new JsonObject();
        tradeAsJson.putNumber("tradeTypeFlag", typeFlag);
        tradeAsJson.putString("tradeID", ID);
        tradeAsJson.putString("tradeCurrency", currency);
        tradeAsJson.putNumber("tradeVolume", volume);
        tradeAsJson.putNumber("tradePrice", curValAtPurchase);

        return tradeAsJson;
    }
}