public class RobotTable{


    private String tableName;
    	private String gameType;
    	private int maxPlayers;
    	private long totalTime;
    	private List<PlayerInfoRobot> playerList;

    	public RobotName(){}

    	public String getGameType(){
    	    return gameType;
    	}

    	public void setGameType(String gameType){
    	    this.gameType = gameType;
    	}

    	public List<PlayerInfoRobot> getPlayerList(){
    	    return playerList;
    	}

    	public void setPlayerList(List<PlayerInfoRobot>){
    	    this.playerList = playerList;
    	}

}
/* "tableName": "",
              "gameType": "",*
              "totalTime": 0,*
              "maxPlayers": 0,*
              "playerList": [],
              "leaderBoard": [],
              "chat": [],
              "history": [],
              "positions": [],
              "orders": [],
              "endResults": [],
              "gritter": []*/