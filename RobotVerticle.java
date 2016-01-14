
import java.util.HashMap;
import java.util.Map;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.platform.Verticle;



public class RobotVerticle extends Verticle {
	private EventBus eb;
	Robots robots;
	String sessionID;
	
	public void start() {
		container.logger().info("Verticule robot a demarre");

		eb = vertx.eventBus();
		robots = new Robots();
		try{
			robots.populateRobotList();
			for(Robot robot:robots.getRobots()){
			    this.startGame(robot);
			}
		}
		catch(Exception e){
			e.printStackTrace();
		}


	}

    public void logout(){
     eb.send("Logout",new JsonObject().putString("sessionID", sessionID),new Handler<Message>(){
            public void handle(Message reply){

            }
     });
    }


	public void startGame(Robot robot){
	    container.logger().info("Robot " + robot.getUsername() + " a demarre");


/*

            vertxEventBusService.send('PlayerInfo', infoRequest).then(function (reply) {
                console.log("PlayerInfo response : " + JSON.stringify(reply));
                if (reply.status == 'ok') {
                    //$scope.$apply(function () {
                    $scope.playerInfo.username = reply.username;
                    $scope.playerInfo.flagUrl = reply.flagUrl;
                    $scope.playerInfo.imgUrl = reply.imgUrl;
                    $scope.playerInfo.level = reply.level;
                    $scope.playerInfo.streak = reply.streak;
                    $scope.playerInfo.tables = reply.tables ? reply.tables : [];
                    $scope.playerInfo.balance = reply.balance;
                    $scope.playerInfo.email = reply.email;
                    //});
                } else {

                }
            }).catch(function () {
                $scope.errorFuncHolder.handler('PlayerInfo', infoRequest);
            });
        }


*/



	}

	public void stop() {}

}