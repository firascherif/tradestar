
import java.util.Comparator;

import org.vertx.java.core.json.JsonObject;

public class LeaderBoardComp implements Comparator<Player> {
    private String tableName;

    public LeaderBoardComp (String tableName) {
        this.tableName = tableName;
    }

    public int compare(Player one, Player two) {
            
            if(one.getTableFinancials(tableName).totalVolume > two.getTableFinancials(tableName).totalVolume)
                return -1;
                
            if(one.getTableFinancials(tableName).totalVolume < two.getTableFinancials(tableName).totalVolume)
                return 1;
        return 0;

    }
}