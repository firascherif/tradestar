import org.vertx.java.core.Handler;
import org.vertx.java.core.Vertx;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;

public class PlayerInfoRobot{

   private Vertx vertx;
   EventBus eb;
   private String username;
   private double balance;
   private int level;
   private int streak;
   private List<RobotTable> tables;
   private String imgUrl;
   private String flagUrl;
   private String currentTable;
   private int numStars;
   private boolean Auth;
   private sessionID;

   public PlayerInfoRobot(Vertx vertx){
        this.vertx = vertx;
        this.eb = vertx.eventBus();
   }

   public PlayerInfoRobot(Vertx vertx, String username, double balance, int level, int streak, List<RobotTable> tables,
                              String imgUrl, String flagUrl, String currentTable, int numStars){

         this.vertx = vertx;
         this.eb = vertx.eventBus();
         this.username = username;
         this.balance = balance;
         this.level = level;
         this.streak = streak;
         this.tables = tables;
         this.imgUrl = imgUrl;
         this.flagUrl = flagUrl;
         this.currentTable = currentTable;
         this.numStars = numStars;
   }

   public void startGame(){
        init_lobby();
        if(!authenticate())
        {
            return;
        }
        loadTradestarExperience();
        viewFloor();


        logout();
   }

    public boolean authenticate(){
           JsonObject paramAuthenticate = new JsonObject();


                    String action = "authenticate";
                    String username = robot.getUsername();
                    String password = robot.getPassword();

                    paramAuthenticate.putString("action", action).putString("username", username)
                    .putString("password",password);
           	    eb.send("Authenticator",paramAuthenticate, new Handler<Message>(){

           	        public void handle(Message reply){
           	            container.logger().info("RobotAuthenticate");
           	            container.logger().info(reply.body());
                           String status = reply.body().getString("status");
           	            this.sessionID = reply.body().getString("sessionID");

           	           return status.equals("ok");
           	        }
           	    });
      }

      public void logout(){
           eb.send("Logout",new JsonObject().putString("sessionID", sessionID),new Handler<Message>(){
                  public void handle(Message reply){

                  container.logger().info("RobotLogout");


                       String status = reply.body().getString("status");
                       if(status.equals("ok")){
                       container.logger().info("Le robot " + this.getUsername() + " s'est deconnecte");
                            setSessionID("");
                            setUsername("");
                            setFlagUrl("");
                            setImgUrl("");
                            setLevel(0);
                            setStreak(0);
                            setTables(null);
                            setBalance(0);
                       }else

                  }
           });
      }



   public void getPlayerInfo(){
        container.logger().info("PlayerInfo");
   }

   public void init_lobby(){
         container.logger().info("init_lobby");
         sortTables();
   }

   public void loadTradestarExperience(){
      getPlayerInfo();

   container.logger().info("loadTradestarExperience");
   }

   public void viewFloor(){

   }

   public action_buy(){}

   public void action_sell(){}

   public void makeTrade(){}

   public void sortTables(){
   JsonObject sortParams = new JsonObject();
   sortParams.putString("gameType","any").putNumber("buyIn", -1).putNumber("totalTime", -1);
   eb.send("TableList",sortParams,new Handler<Message>(){
        public void handle(Message reply){
            container.logger().info("RobotTableList");
            container.logger().info(reply.body());
        }
   });

    //NEW
           $scope.sortParams = {
               "gameType": 'any',
               "buyIn": -1,
               "totalGameTime": -1
           };



   /*

   $scope.sortTables = function () {
               $scope.andrew_tables = [];

               $scope.sortParams.buyIn = parseFloat($scope.sortParams.buyIn);
               $scope.sortParams.totalGameTime = parseFloat($scope.sortParams.totalGameTime);


               vertxEventBusService.send('TableList', $scope.sortParams, {timeout: 3000}).then(function (reply) {
                   //$scope.$apply(function () {
                   console.info("Reply for TableList is " + JSON.stringify(reply));
                   $scope.andrew_tables = reply;
                   //});
               }).catch(function () {
                   console.error("No response within 3 seconds for TableList");
               });

           }



   */



   }

   public String getUsername(){
        return username;
   }

   public double getBalance(){
        return balance;
   }

   public int getLevel(){
        return level;
   }

   public int getStreak(){
        return streak;
   }

   public List<TableRobot> getTables(){
        return tables;
   }

   public String getImgUrl(){
        return imgUrl;
   }

   public String getFlagUrl(){
        return flagUrl;
   }

   public String getCurrentTable(){
        return currentTable;
   }

   public int getNumStars(){
        return numStars;
   }

   public boolean getAuth(){
        return Auth;
   }

   public String getSessionID(){
        return sessionID;
   }

   public void setUsername(String username){
         this.username = username;
   }

   public void setBalance(double balance){
         this.balance = balance;
   }

   public void setLevel(int level){
        this.level = level;
   }

   public void setStreak(int streak){
         this.streak = streak;
   }

   public void setTables( List<TableRobot> tables){
         this.tables = tables;
   }

   public setImgUrl(String imgUrl){
         this.imgUrl = imgUrl;
   }

   public setFlagUrl(String flagUrl){
         this.flagUrl = flagUrl;
   }

   public void setCurrentTable(String currentTable){
        this.currentTable = currentTable;
   }

   public void setNumStars(int numStars){
        this.numStars = numStars;
   }

   public void setAuth(boolean Auth){
        this.Auth = Auth;
   }

   public void setSessionID(String sessionID){
        this.sessionID = sessionID;
   }


}