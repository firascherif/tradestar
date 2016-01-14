
import org.vertx.java.core.json.JsonObject;

import java.util.ArrayList;
import java.util.List;

public class Financials {
    List<Trade> trades;
    float freeVolume;
    float totalVolume;
    boolean eliminated;
    int order;

    public Financials(float startVolume, int order) {
        this.trades = new ArrayList<Trade>();
        this.freeVolume = startVolume;
        this.totalVolume = startVolume;
        this.eliminated = false;
        this.order = order;
    }

    public void addTrade(Trade newTrade) {
        trades.add(newTrade);
    }

    public void print() {
        System.out.println("-----------------------------");
        System.out.println("FreeVolume: " + freeVolume);
        System.out.println("TotalVolume: " + totalVolume);
        System.out.println("Total Trades in action:" + trades.size());
        System.out.println("-----------------------------");

    }

    public JsonObject toJson (){

        JsonObject financialsAsJson = new JsonObject();

        financialsAsJson.putNumber("freeVolume", freeVolume);
        financialsAsJson.putNumber("totalVolume", totalVolume);
        financialsAsJson.putBoolean("eliminated", eliminated);
        financialsAsJson.putNumber("order", order);

        return financialsAsJson;
    }
}
