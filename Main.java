//tradestar

import java.io.File;

import org.vertx.java.core.AsyncResult;
import org.vertx.java.core.Handler;
import org.vertx.java.core.http.HttpServer;
import org.vertx.java.core.http.HttpServerRequest;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.sockjs.EventBusBridgeHook;
import org.vertx.java.core.sockjs.SockJSServer;
import org.vertx.java.core.sockjs.SockJSSocket;
import org.vertx.java.platform.Verticle;
//import org.vertx.java.core.buffer.Buffer;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;


import org.vertx.java.core.http.RouteMatcher;

import java.util.Map;

//import com.evtech.tradestar.topup.TopupVerticle;
//import com.evtech.tradestar.truefx.TrueFxCsvParserVerticle;
//import com.evtech.tradestar.xp.XPPointsCalculatorVerticle;
//import com.evtech.tradestar.xp.XPVerticle;

public class Main extends Verticle {

    private EventBus eb;

	private HttpServer server;
	private SockJSServer sockJSServer;
	public	String webRootDir;
	private boolean responseLogin;
	private int isRobotVerticleReadyToStart = 0;

	public void start() {
	eb = vertx.eventBus();
		container.logger().info("Main.start()");
		 webRootDir = System.setProperty("WEBROOT","webroot");
	
		webRootDir = System.getProperty("WEBROOT");
		if (webRootDir == null) {
			container.logger().error("Webroot directory not given as system property. Exiting!!!");
			System.exit(-1);
		}

		getDatabaseconfig();
		/*

	//	container.deployWorkerVerticle(MarketUpdater.class.getName());
		container.deployWorkerVerticle(MarketRequests.class.getName());
		container.deployWorkerVerticle("MarketRequests.");
		container.deployWorkerVerticle(Authenticator.class.getName());
		container.deployWorkerVerticle(LobbyManager.class.getName());
		container.deployWorkerVerticle(XPVerticle.class.getName());
		container.deployWorkerVerticle(LeaderBoardVerticle.class.getName());
		container.deployWorkerVerticle(PaymentVerticle.class.getName());
		container.deployWorkerVerticle(TopupVerticle.class.getName());
		container.deployWorkerVerticle(MarketUpdaterRealTime.class.getName());
		//container.deployWorkerVerticle(JsoupWorker.class.getName());
		//container.deployWorkerVerticle(TrueFxCsvParserVerticle.class.getName());

		container.deployVerticle(XPPointsCalculatorVerticle.class.getName());
		container.deployVerticle(MarketUpdater.class.getName());
		*/


//	container.deployWorkerVerticle(MarketUpdater.class.getName());
		container.deployWorkerVerticle("MarketRequests.java");
		 
		container.deployWorkerVerticle("Authenticator.java");
		container.deployWorkerVerticle("LobbyManager.java");
		container.deployWorkerVerticle("XPVerticle.java");
		container.deployWorkerVerticle("LeaderBoardVerticle.java");
		container.deployWorkerVerticle("PaymentVerticle.java");
		container.deployWorkerVerticle("TopupVerticle.java");
		container.deployWorkerVerticle("MarketUpdaterRealTime.java");
		//container.deployWorkerVerticle(JsoupWorker.class.getName());
		//container.deployWorkerVerticle(TrueFxCsvParserVerticle.class.getName());

		container.deployVerticle("XPPointsCalculatorVerticle.java");
		//container.deployVerticle("MarketUpdater.java");
		//quand les handler de verticles authenticator et lobbyManager ont ete traites demmarer robot verticle.
	    eb.registerHandler("HandlerRegistred",new Handler<Message>(){
	        public void handle(Message reply){
	            isRobotVerticleReadyToStart ++;

	            if(isRobotVerticleReadyToStart == 2)
	            {
	               container.deployVerticle("RobotVerticle.java");
	            }
	        }
	    });



		String ip = (String) container.env().get("OPENSHIFT_VERTX_IP");
		if (ip == null) {
			ip = "127.0.0.1";
		}
		String port = (String) container.env().get("OPENSHIFT_VERTX_PORT");
		if (port == null) {
			port = "8080";
		}
		container.logger().info("ip");
		container.logger().info(ip);
		container.logger().info("port");
		container.logger().info(ip);
        
        RouteMatcher rm = new RouteMatcher();
       
        rm.get("/test",new Handler<HttpServerRequest>(){
        public void handle(HttpServerRequest req){
              req.response().sendFile("webroot/test.html");
        }
    });
   
        
        rm.get("/",new Handler<HttpServerRequest>(){
        public void handle(HttpServerRequest req){
              req.response().sendFile("webroot/login.html");
        }
    });
      
        rm.get("/index",new Handler<HttpServerRequest>(){
        public void handle(HttpServerRequest req){
               container.logger().info("/index");
            if( responseLogin )
            
            
              req.response().sendFile("webroot/index.html");
        
            
        }
        
        
    });
        
        
        
          rm.get("/controlroom",new Handler<HttpServerRequest>(){
        public void handle(HttpServerRequest req){
               container.logger().info("/index");
            if( responseLogin )
            
            
              req.response().sendFile("webroot/controlroom.html");
        
            
        }
        
        
    });
      
      
         rm.get("/login/:username/:password", new Handler<HttpServerRequest>() {
         public void handle(HttpServerRequest req) {
               container.logger().info("Username: " + req.params().get("username") + " Password: " + req.params().get("password"));
              String username = req.params().get("username");
              String password = req.params().get("password");
              if(username.equals("1")&&password.equals("1"))
                    responseLogin = true;
              

          
        
        req.response().end("User: " + req.params().get("username") + " ID: " + req.params().get("password"));
      }
    });

 // Catch all - serve the index page
        rm.getWithRegEx(".*", new Handler<HttpServerRequest>() {
        public void handle(HttpServerRequest req) {
              //container.logger().info("Catch all - serve the index page");
                 if( responseLogin )
                req.response().sendFile(webRootDir + File.separatorChar + req.path());
         
      
      }
    });
        
        
        
        
        
        
        
        
        
        
        

		server = vertx.createHttpServer();
        server.requestHandler(rm);
/*
server.requestHandler(new Handler<HttpServerRequest>() {
			public void handle(HttpServerRequest req) {
                 req.dataHandler(new Handler<Buffer>() {
            public void handle(Buffer buffer) {
            	 String username = null;
				     String password =null;
                container.logger().info("I received " + buffer.toString() + " bytes");

                String request = buffer.toString();
                int separator = request.indexOf("&");
                String first = request.substring(0,separator);
                 String second = request.substring(separator+1);
                 separator = first.indexOf("=");
                 String key = first.substring(0,separator);
                 username = first.substring(separator+1);
                 container.logger().info(username);


                 separator = second.indexOf("=");
                 key = second.substring(0,separator);
                  password = second.substring(separator+1);
                 container.logger().info(password);


                  if(username.equals("test")&&password.equals("test123.")) {
					 	container.logger().info("valid user");
					 //	req.response().sendFile("webroot/index.html");
                      Buffer responseLogin = new Buffer();
                      responseLogin.appendString("Success");
                          req.response().end(responseLogin);

                
 




            }
        };
});
                
                /*

				if (req.path().equals("/"))
					req.response().sendFile(webRootDir + File.separatorChar + "index.html");
				else
					req.response().sendFile(webRootDir + File.separatorChar + req.path());
                
                
			}
		});
*/

		JsonArray permitted = new JsonArray();
		permitted.add(new JsonObject());

		// final ServerHook hook = new ServerHook(logger);

		sockJSServer = vertx.createSockJSServer(server);
		// sockJSServer.setHook(hook);
		sockJSServer.bridge(new JsonObject().putString("prefix", "/eventbus"), permitted, permitted);
		sockJSServer.setHook(new EventBusBridgeHook() {

			@Override
			public boolean handleUnregister(SockJSSocket sockJSSocket, String str) {
				container.logger().info("EventBusBrideHook.handleUnregister, headers" + sockJSSocket.headers());
				return true;
			}

			@Override
			public boolean handleSocketCreated(SockJSSocket sockJSSocket) {
				container.logger().info("EventBusBrideHook.handleSocketCreated, headers" + sockJSSocket.headers());
				return true;
			}

			@Override
			public void handleSocketClosed(SockJSSocket sockJSSocket) {
				container.logger().info("EventBusBrideHook.handleSocketClosed, headers" + sockJSSocket.headers());
			}

			@Override
			public boolean handleSendOrPub(SockJSSocket sockJSSocket, boolean arg1, JsonObject arg2, String arg3) {
				container.logger().info("EventBusBrideHook.handleSendOrPub, headers" + sockJSSocket.headers());
				return true;
			}

			@Override
			public boolean handlePreRegister(SockJSSocket sockJSSocket, String arg1) {
				container.logger().info("EventBusBrideHook.handlePreRegister, headers" + sockJSSocket.headers());
				return true;
			}

			@Override
			public void handlePostRegister(SockJSSocket sockJSSocket, String arg1) {
				container.logger().info("EventBusBrideHook.handlePostRegister, headers" + sockJSSocket.headers());
			}

			@Override
			public boolean handleAuthorise(JsonObject arg0, String arg1, Handler<AsyncResult<Boolean>> arg2) {
				container.logger().info("EventBusBrideHook.handleAuthorise, headers");
				return true;
			}
		});

		server.listen(Integer.parseInt(port), ip);

		long timerID = vertx.setPeriodic(10000, new Handler<Long>() {
			public void handle(Long timerID) {
				vertx.eventBus().publish("ping", new JsonObject().putString("status", "ok").putString("serverTime",
						"Timestamp at server: " + System.currentTimeMillis()));
			}
		});

		container.logger().info("timerID " + timerID);
	}

	@Override
	public void stop() {
		container.logger().info("Main.stop()");

		if (sockJSServer != null)
			sockJSServer.close();

		if (server != null)
			server.close();

		container.logger().info("Closing the sockJS and http server.");
	}

	public JsonObject getDatabaseconfig(){
		//OPENSHIFT_MONGODB_DB_PORT
		//OPENSHIFT_MONGODB_DB_HOST

//OPENSHIFT_MONGODB_DB_USERNAME
//OPENSHIFT_MONGODB_DB_PORT
		return new JsonObject();




	}
}
