

// File: LobbyManager.java
// Author(s): Andrew Costa, Jean Baptist Luccioni, Harsh Shah
// Last Modification: 9/11/14
// Desc: LobbyManager.java manages tables and players. The program contains
//       handlers to deal with client requests for table creation, table joining,
//       table destruction, table lists, player logout and player load into memory.
// Copyright (C) 2014

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Map;
import java.util.Random;
import java.util.Scanner;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.platform.Verticle;

public class LobbyManager extends Verticle {

	private EventBus eb;

	private Map<String, GameTable> gameTables;
	private Map<String, Player> players;
	private Map<String, String> sessions;
	private JsonArray tableNameManager;


	private ConcurrentMap<String, Player> signedInPlayers;
	
	public void stop() {
		container.logger().info("LobbyManager.stop()");
	}

	public void start() {
		container.logger().info("LobbyManager.start()");

		sessions = vertx.sharedData().getMap("sessions");
		players = new ConcurrentHashMap<>();
		gameTables = new ConcurrentHashMap<>();
		tableNameManager = new JsonArray();

		signedInPlayers = new ConcurrentHashMap<String, Player>();

		eb = vertx.eventBus();

		try {
			populateTableNamingList();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
        
        Handler<Message<JsonObject>> changePlayerHandler = new Handler<Message<JsonObject>>() {
            public void handle(Message<JsonObject> message) {
                
                String oldUserName = message.body().getString("oldUserName");
                String newUserName = message.body().getString("newUserName");
                String newEmail = message.body().getString("newEmail");
                String newImgUrl =  "assets/images/users/" + newUserName + "/profile_pic.png";
                
                container.logger().info("changePlayerHandler appele");
                container.logger().info(message.body().encodePrettily());
                container.logger().info("fin de changePlayerHandler");
                
                //TODO : regarder si il faut modifier la map players

                 container.logger().info("map de signedInPlayers");
                  container.logger().info(signedInPlayers);
                
                
                
                Player signedInPlayer = signedInPlayers.get(oldUserName);
               
                signedInPlayer.setMail(newEmail);
                signedInPlayer.setUsername(newUserName);
                signedInPlayer.setImgUrl(newImgUrl);
                
                signedInPlayers.remove(oldUserName);
                signedInPlayers.put(newUserName,signedInPlayer);         
                
            
                 eb.publish(EventbusAddress.OnlinePlayers.name(), new JsonObject().putString("status", "ok")
									.putString("action", "update").putString("oldUsername", oldUserName).putString("newUsername", newUserName));
               
                
            }
        };
        Handler<Message<JsonObject>> changeImageHandler = new Handler<Message<JsonObject>>() {
            public void handle(Message<JsonObject> message) {
                container.logger().info("changeImageHandler");
                
                
                
                  container.logger().info("players");
                
                
                
                for(String playerKey : players.keySet())
                {
                    container.logger().info(playerKey);
                    container.logger().info(players.get(playerKey).toString());
                }
                
                
                
                container.logger().info("signedInPlayers");
                
                for(String playerKey : signedInPlayers.keySet())
                {
                    container.logger().info(playerKey);
                    container.logger().info(signedInPlayers.get(playerKey).toString());
                }
                
                String username = message.body().getString("username");
                String sessionID = message.body().getString("sessionID");
                String dataImage = message.body().getString("dataImage");
                
                Player signedInPlayer = signedInPlayers.get(username);
                Player player = players.get(sessionID);
                
                player.setImgUrl(dataImage);
                signedInPlayer.setImgUrl(dataImage);
                
                eb.publish(EventbusAddress.OnlinePlayers.name(), new JsonObject().putString("status", "ok")
									.putString("action", "updateImg").putString("username", username).putString("dataImage", dataImage));
                
            }};
            
        

		Handler<Message<JsonObject>> getOnlinePlayersHandler = new Handler<Message<JsonObject>>() {

			public void handle(Message<JsonObject> message) {
				long startTime = System.currentTimeMillis();
				JsonObject body = message.body();
                
				container.logger()
						.info("LobbyManager.getOnlinePlayersHandler.handle(), message " + body.encodePrettily());
				String sessionID = body.getString("sessionID");
				String username = body.getString("username");
                container.logger().info("username " + username);

				System.out.println("signedInPlayers " + signedInPlayers.keySet());

				if (sessionID != null && !sessionID.isEmpty() && username != null && !username.isEmpty()) {
					Set<String> keyset = signedInPlayers.keySet();
					JsonArray allPlayersJsonArr = new JsonArray();

					for (String string : keyset) {

						if (!string.equals(username)) {
							Player player = signedInPlayers.get(string);

							if (player != null) {
								allPlayersJsonArr.addObject(player.toJson());
							}
						}
					}
                    
                    
					message.reply(
							new JsonObject().putString("status", "ok").putArray("friendsList", allPlayersJsonArr));
				} else {
					message.reply(new JsonObject().putString("status", "error").putString("message",
							"Unable to retrive player from sessionID"));
				}
				container.logger().info("Time taken " + (System.currentTimeMillis() - startTime) + "ms");
			}
		};

		Handler<Message<JsonObject>> playerPresencePublisherHandler = new Handler<Message<JsonObject>>() {
			public void handle(Message<JsonObject> message) {
				long startTime = System.currentTimeMillis();

				container.logger().info("LobbyManager.playerPresencePublisherHandler.handle(), message "
						+ message.body().encodePrettily());

				String action = message.body().getString("action");
				String status = message.body().getString("status");

				if (status != null && !status.isEmpty() && action != null && !action.isEmpty()) {

					switch (action) {
					case "remove":

						String username = message.body().getString("username");

						if (username != null && !username.isEmpty()) {
							eb.publish(EventbusAddress.OnlinePlayers.name(), new JsonObject().putString("status", "ok")
									.putString("action", "remove").putString("username", username));
						} else {
							container.logger().error("action remove with no username!!!");
						}

						break;

					case "add":

						JsonObject obj = message.body().getObject("playerInfo");
						if (obj != null) {
							eb.publish(EventbusAddress.OnlinePlayers.name(), new JsonObject().putString("status", "ok")
									.putString("action", "add").putObject("playerInfo", obj));

						} else {
							container.logger().error("action add without playerInfo object!!!");
						}

						break;

					case "udpate":

						// TODO will do later
						break;
					default:
						container.logger().error("Error: Unknown action type!!!");
						break;
					}
				}

				container.logger().info("Time taken " + (System.currentTimeMillis() - startTime) + "ms");
			}
		};

		Handler<Message<JsonObject>> logoutPlayerHandler = new Handler<Message<JsonObject>>() {
			public void handle(Message<JsonObject> message) {
				long startTime = System.currentTimeMillis();
				container.logger().info("LobbyManager.logoutPlayerHandler.handle() " + message.body().encodePrettily());

				String sessionID = message.body().getString("sessionID");

				if (sessionID != null && !sessionID.isEmpty() && players.containsKey(sessionID)) {
					String username = players.get(sessionID).getUsername();
					String replyMessage = username + " has been loged off";
					Player playerInfo = players.get(sessionID);
					players.remove(sessionID);
					signedInPlayers.remove(playerInfo.getUsername());

					container.logger().info(replyMessage);

					message.reply(new JsonObject().putString("status", "ok").putString("message", replyMessage));
					// vertx.sharedData().getMap("sessions").remove(sessionID);

					eb.publish(EventbusAddress.PublishPlayerPresence.name(), new JsonObject().putString("status", "ok")
							.putString("action", "remove").putString("username", username));
				} else {
					String replyMessage = message.body().getString("sessionID") + "'s logout attempt was unsuccessful";
					container.logger().info(replyMessage);
					message.reply(new JsonObject().putString("status", "error").putString("message", replyMessage));
				}

				container.logger().info("Time taken " + (System.currentTimeMillis() - startTime) + "ms");
			}
		};

		Handler<Message<JsonObject>> playerUpdateHandler = new Handler<Message<JsonObject>>() {
			public void handle(Message<JsonObject> message) {

				System.out.println(
						"LobbyManager.playerUpdateHandler.handle() with message " + message.body().encodePrettily());

				JsonObject updates = message.body();
				String username = updates.getString("username");
				Player player = getPlayerWithUsername(username);
				player.setBalance(updates.getNumber("balance").doubleValue());
				player.setMail(updates.getString("email"));
				
				eb.publish(player.getSessionID() + ".ProfileUpdates", new JsonObject()
						.putNumber("balance", player.getBalance()).putNumber("numStars", player.getNumStars()).putString("email", player.getEmail()));

			}
		};

		Handler<Message<JsonObject>> newPlayerHandler = new Handler<Message<JsonObject>>() {
			public void handle(Message<JsonObject> message) {

				System.out.println(
						"LobbyManager.newPlayerHandler.handle() with message " + message.body().encodePrettily());
				JsonObject newPlayerCreateRequest = message.body();
				if (isLegalPlayerCreateRequest(newPlayerCreateRequest)) {
					Player newPlayer = createPlayer(newPlayerCreateRequest);
					loadPlayerIntoMemory(newPlayer);
					System.out.println(newPlayer.getUsername() + " is loaded into memory");

					System.out.println("Before publishing message to " + EventbusAddress.PublishPlayerPresence.name());
					// Notify other players that new one has logged in
					eb.publish(EventbusAddress.PublishPlayerPresence.name(), new JsonObject().putString("status", "ok")
							.putString("action", "add").putObject("playerInfo", newPlayer.toJson()));
				}
			}
		};

		Handler<Message<JsonObject>> connectPlayerHandler = new Handler<Message<JsonObject>>() {
			public void handle(Message<JsonObject> message) {
				System.out.println(
						"LobbyManager.connectPlayerHandler.handle() with message " + message.body().encodePrettily());

				String sessionID = message.body().getString("sessionID");
				String username = message.body().getString("username");

				Player player = getPlayerWithUsername(username);
				System.out.println("player " + player);

				if (player != null) {
					player.setSessionID(sessionID);
					players.remove(player);
					players.put(sessionID, player);
					System.out.println("New id = " + sessionID);

					eb.publish(EventbusAddress.PublishPlayerPresence.name(), new JsonObject().putString("status", "ok")
							.putString("action", "add").putObject("playerInfo", player.toJson()));

				} else {
					eb.send("NewPlayer", message.body());
				}
			}
		};

		Handler<Message<JsonObject>> createTableHandler = new Handler<Message<JsonObject>>() {
			public void handle(Message<JsonObject> message) {
				JsonObject newTableCreateRequest = message.body();

				System.out.println(players);

				if (playerExists(newTableCreateRequest.getString("sessionID"))) {
					System.out.println(message.body());

					if (isLegalTableCreateRequest(newTableCreateRequest)) {
						String sessionID = newTableCreateRequest.getString("sessionID");

						if (players.get(sessionID).getBalance() >= newTableCreateRequest.getNumber("buyIn")
								.longValue()) {
							GameTable newTable = createTable(newTableCreateRequest);
							loadTableIntoMemory(newTable);
							// Prepare Json output for lobby
							JsonObject joined = joinTable(sessionID, newTable.getName(), newTable.getPassword(), 0);
							message.reply(joined);

						} else
							message.reply(new JsonObject().putBoolean("status", false).putString("message",
									"Not enough cash bruh!"));

					} else
						message.reply(new JsonObject().putBoolean("status", false).putString("message",
								"illegal table create requests"));
				} else
					message.reply(
							new JsonObject().putBoolean("status", false).putString("message", "No session found"));
			}
		};

		Handler<Message<JsonObject>> joinTableHandler = new Handler<Message<JsonObject>>() {
			// Expects: JsonObject ... see isLegalPlayerJoinRequest() for
			// required params
			public void handle(Message<JsonObject> message) {
				
				long startTime = System.currentTimeMillis();
				
				JsonObject newPlayerJoinRequest = message.body();
				String sessionID = newPlayerJoinRequest.getString("sessionID");
				
				container.logger().info("joinTableHandler.handle " + newPlayerJoinRequest.encodePrettily());
				

				if (isLegalPlayerJoinRequest(newPlayerJoinRequest)) {
					if (sessions.containsKey(sessionID)) {
						String tableName = newPlayerJoinRequest.getString("tableName");
						String password = newPlayerJoinRequest.getString("password");
						int order = newPlayerJoinRequest.getNumber("order").intValue();
						JsonObject joined = joinTable(sessionID, tableName, password, order);
						if (joined.getBoolean("status")) {
							GameTable tempTable = gameTables.get(tableName);
							if (tempTable.isFull())
								tempTable.startGame();
						}
						message.reply(joined);
					} else
						message.reply(
								new JsonObject().putBoolean("status", false).putString("message", "Invalid sessionID"));

				} else
					message.reply(
							new JsonObject().putBoolean("status", false).putString("message", "illegal join request"));
				
				container.logger().info("Time taken " + (System.currentTimeMillis() - startTime) + "ms");
			}
		};

		Handler<Message<JsonObject>> exitTableHandler = new Handler<Message<JsonObject>>() {
			public void handle(Message<JsonObject> message) {
				JsonObject newPlayerExitRequest = message.body();
				if (isLegalPlayerExitRequest(newPlayerExitRequest)) {
					String sessionID = newPlayerExitRequest.getString("sessionID");
					if (sessions.containsKey(sessionID)) {
						String tableName = newPlayerExitRequest.getString("tableName");
						if (!(gameTables.get(tableName).getTotalPlayers() == gameTables.get(tableName)
								.getMaxPlayers())) {
							JsonObject exit = exitTable(sessionID, tableName);
							message.reply(exit);
						} else
							message.reply(new JsonObject().putBoolean("status", false).putString("message",
									"Cannot leave game in progress!"));
					} else
						message.reply(
								new JsonObject().putBoolean("status", false).putString("message", "Invalid sessionID"));
				} else
					message.reply(
							new JsonObject().putBoolean("status", false).putString("message", "illegal exit request"));
			}

		};

		Handler<Message<JsonObject>> destroyTableHandler = new Handler<Message<JsonObject>>() {
			public void handle(Message<JsonObject> message) {
				if (message.body().containsField("tableName")) {
					String tableName = message.body().getString("tableName");
					if (tableExists(tableName)) {
						gameTables.remove(tableName);
						System.out.println(tableName + " was destroyed.");
						System.out.println("table destruction successful");
					} else
						System.out.println("table destruction failed: table does not exist");
				} else
					System.out.println("table destruction failed: invalid destruction request");
			}
		};

		Handler<Message<JsonObject>> tableListHandler = new Handler<Message<JsonObject>>() {
			// Expects: JsonObject containing sorting integer flag and
			// corresponding another flag or string
			// 0=all, 1=empty, 2=full, 3=private 4=tradelimit 5=gametype
			public void handle(Message<JsonObject> message) {
				long startTime = System.currentTimeMillis();
				JsonObject params = message.body();

				container.logger().info("tableListHandler.handle " + params.encodePrettily());

				JsonArray tables = new JsonArray();

				String gameType = params.getString("gameType");
				long totalGameTime = params.getNumber("totalGameTime").longValue();
				long buyIn = params.getNumber("buyIn").longValue();

				for (String key : gameTables.keySet()) {
					GameTable curTable = gameTables.get(key);
					System.out.println(curTable.getBuyIn());

					if (gameType.equals("any") || gameType.equals(curTable.getGameType())) {
						if (buyIn == -1 || buyIn == curTable.getBuyIn()) {
							if (totalGameTime == -1 || totalGameTime == curTable.getTotalTime()) {
								tables.add(curTable.toJson());
							}
						}
					}
				}

				message.reply(tables);
				container.logger().info("Time taken " + (System.currentTimeMillis() - startTime) + "ms");
			}
		};

		Handler<Message<JsonObject>> playerInfoHandler = new Handler<Message<JsonObject>>() {

			public void handle(Message<JsonObject> message) {

				long startTime = System.currentTimeMillis();
				JsonObject body = message.body();

				container.logger()
						.info("LobbyManager.playerInfoHandler.handle() with message " + body.encodePrettily());

				String sessionID = body.getString("sessionID");
				String username = body.getString("username");

				if (sessionID != null && !sessionID.isEmpty()) {
					Player playerInfo = players.get(sessionID);
					System.out.println("playerInfo : " + playerInfo);

					if (playerInfo != null) {
						message.reply(players.get(sessionID).toJson().putString("status", "ok"));
					} else {

						// Lets get it from DB (a little bit performance penalty
						// to avoid glitches)

						if (username != null && !username.isEmpty()) {

							container.logger().info("Unable to find playerInfo from session for " + username);

							DatabaseManager dbManager = DatabaseManager.getInstance();

							JsonObject playerDataReq = new JsonObject()
									.putString(DBManagerFields.collection.name(), DBCollections.users.name())
									.putObject(DBManagerFields.matcher.name(),
											new JsonObject().putString("username", username));

							JsonArray playerData = dbManager.find(playerDataReq)
									.getArray(DBManagerFields.results.name());

							if (playerData.size() > 0) {
								JsonObject playerDataAsJsonObject = playerData.get(0);
								System.out.println(playerDataAsJsonObject.encodePrettily());
								message.reply(playerDataAsJsonObject.putString("status", "ok"));
							} else {
								message.reply(new JsonObject().putString("status", "error").putString("message",
										"Unable to find " + username + " in the database."));
							}

						} else {
							message.reply(new JsonObject().putString("status", "error").putString("message",
									"Unable to find player info from sessionID " + sessionID
											+ ", and username is not present in request."));
						}
					}
				} else {
					message.reply(new JsonObject().putString("status", "error").putString("message",
							"Session id doesnt exist"));
				}
			}
		};
//hy
		eb.registerHandler("NewPlayer", newPlayerHandler);
		eb.registerHandler(EventbusAddress.PlayerUpdates.name(), playerUpdateHandler);
		eb.registerHandler("ConnectPlayer", connectPlayerHandler);
		eb.registerHandler("CreateTable", createTableHandler);
		eb.registerHandler("JoinTable", joinTableHandler);
		eb.registerHandler("ExitTable", exitTableHandler);
		eb.registerHandler("TableList", tableListHandler);
		eb.registerHandler("DestroyTable", destroyTableHandler);
		eb.registerHandler("Logout", logoutPlayerHandler);
		eb.registerHandler("PlayerInfo", playerInfoHandler);
        eb.registerHandler("ChangePlayer", changePlayerHandler);
        eb.registerHandler("ChangeImage", changeImageHandler);
            // TODO regarder si on utilise PublishPlayerPresence
		eb.registerHandler(EventbusAddress.PublishPlayerPresence.name(), playerPresencePublisherHandler);
		eb.registerHandler(EventbusAddress.GetOnlinePlayers.name(), getOnlinePlayersHandler);

		eb.send("HandlerRegistred",new JsonObject().putString("Verticle","LobbyManager"));
	}

	public JsonObject exitTable(String sessionID, String tableName) {
		GameTable table = gameTables.get(tableName);
		Player player = table.getPlayerWithSessionID(sessionID);
		if (player == null) {
			return new JsonObject().putBoolean("status", false).putString("message", "Session ID not on the table");
		} else {
			table.removePlayer(player);
			player.setBalance(player.getBalance() + table.getBuyIn());
			eb.publish(player.getSessionID() + ".ProfileUpdates",
					new JsonObject().putString("table", tableName).putString("function", "remove"));
			return new JsonObject().putBoolean("status", true).putString("message", "Table exit success!");
		}
	}

	public boolean isLegalPlayerCreateRequest(JsonObject newPlayerCreateRequest) {
		if (newPlayerCreateRequest.containsField("sessionID") && newPlayerCreateRequest.containsField("username")
				&& newPlayerCreateRequest.containsField("flagUrl") && newPlayerCreateRequest.containsField("usrImg")
				&& newPlayerCreateRequest.containsField("level") && newPlayerCreateRequest.containsField("balance")
				&& newPlayerCreateRequest.containsField("streak")) {
			return true;
		}
		return false;
	}

	public Player createPlayer(JsonObject newPlayerCreateRequest) {
		String sessionID = newPlayerCreateRequest.getString("sessionID");
		String username = newPlayerCreateRequest.getString("username");
		String flagUrl = newPlayerCreateRequest.getString("flagUrl");
		String imgUrl = newPlayerCreateRequest.getString("usrImg");
		String email = newPlayerCreateRequest.getString("email");
		double level = newPlayerCreateRequest.getNumber("level").doubleValue();
		double balance = newPlayerCreateRequest.getNumber("balance").doubleValue();
		int streak = newPlayerCreateRequest.getNumber("streak").intValue();
		int numStars = newPlayerCreateRequest.getNumber("numStars").intValue();
		return new Player(sessionID, username, email, flagUrl, imgUrl, level, balance, streak, numStars);
	}

	public boolean isLegalTableCreateRequest(JsonObject newTableCreateRequest) {
		if (newTableCreateRequest.containsField("maxPlayers") && newTableCreateRequest.containsField("buyIn")
				&& newTableCreateRequest.containsField("private") && newTableCreateRequest.containsField("tradeLimit")
				&& newTableCreateRequest.containsField("instruments")
				&& newTableCreateRequest.containsField("totalGameTime")
				&& newTableCreateRequest.containsField("roundGameTime")
				// Remove: &&
				// newTableCreateRequest.containsField("peaceGameTime")
				&& newTableCreateRequest.containsField("sessionID")
				&& newTableCreateRequest.containsField("gameType")) {

			if (newTableCreateRequest.getString("gameType").equals("Hit & run")) {
				if (!newTableCreateRequest.containsField("hitAndRunAmount"))
					return false;
			}

			if (newTableCreateRequest.getBoolean("private")) {
				if (newTableCreateRequest.containsField("password"))
					return true;
				else
					return false; // is private has no password: invalid
			} else
				return true; // not private
		}
		return false; // invalid table req
	}

	public boolean isLegalPlayerJoinRequest(JsonObject newJoinTableRequest) {
		if (newJoinTableRequest.containsField("sessionID") && newJoinTableRequest.containsField("tableName")
				&& newJoinTableRequest.containsField("order")) {
			if (!newJoinTableRequest.containsField("password")) {
				newJoinTableRequest.putString("password", "");
			}
			return true;
		}
		return false;
	}

	public boolean isLegalPlayerExitRequest(JsonObject newJoinTableRequest) {
		if (newJoinTableRequest.containsField("sessionID") && newJoinTableRequest.containsField("tableName")) {
			return true;
		}
		return false;
	}

	public GameTable createTable(JsonObject newTableCreateRequest) {
		String newTableName = getUnusedTableName();
		JsonObject newTableParams = new JsonObject().putString("tableName", newTableName)
				.putNumber("maxPlayers", newTableCreateRequest.getNumber("maxPlayers").intValue())
				.putNumber("buyIn", newTableCreateRequest.getNumber("buyIn").intValue())
				.putBoolean("private", newTableCreateRequest.getBoolean("private"))
				.putNumber("tradeLimit", newTableCreateRequest.getNumber("tradeLimit").intValue())
				.putArray("instruments", newTableCreateRequest.getArray("instruments"))
				.putNumber("totalGameTime", newTableCreateRequest.getNumber("totalGameTime").doubleValue())
				.putNumber("roundGameTime", newTableCreateRequest.getNumber("roundGameTime").doubleValue())
				// Remove: .putNumber("peaceGameTime",
				// newTableCreateRequest.getNumber("peaceGameTime").doubleValue())
				.putString("gameType", newTableCreateRequest.getString("gameType"));
		if (newTableCreateRequest.containsField("password"))
			newTableParams.putString("password", newTableCreateRequest.getString("password"));
		if (newTableCreateRequest.containsField("hitAndRunAmount"))
			newTableParams.putNumber("hitAndRunAmount",
					newTableCreateRequest.getNumber("hitAndRunAmount").floatValue());

		return new GameTable(newTableParams, vertx);
	}

	public void loadTableIntoMemory(GameTable newTable) {
		gameTables.put(newTable.getName(), newTable);
	}

	public void loadPlayerIntoMemory(Player newPlayer) {
		players.put(newPlayer.getSessionID(), newPlayer);
		signedInPlayers.put(newPlayer.getUsername(), newPlayer);
	}

	public JsonObject joinTable(String sessionID, String tableName, String password, int order) {
		JsonObject joinStatus = new JsonObject();
		if (!playerExists(sessionID)) {
			String message = "Session ID cannot be found";
			System.out.println(message);
			joinStatus.putBoolean("status", false).putString("message", message);
			return joinStatus;
		}
		if (!tableExists(tableName)) {
			String message = "Table name: " + tableName + " cannot be found";
			System.out.println(message);
			joinStatus.putBoolean("status", false).putString("message", message);
			return joinStatus;
		}
		GameTable tableRequested = gameTables.get(tableName);
		Player playerRequesting = players.get(sessionID);
		if (tableRequested.getPlayerWithSessionID(sessionID) != null) {
			String message = playerRequesting.getUsername() + " has already joined the table";
			System.out.println(message);
			joinStatus.putBoolean("status", false).putString("message", message);
			return joinStatus;
		}
		if (tableRequested.isPrivate()) {
			if (!(tableRequested.getPassword().equals(password))) {
				String message = playerRequesting.getUsername() + " has entered the wrong password";
				System.out.println(message);
				joinStatus.putBoolean("status", false).putString("message", message);
				return joinStatus;
			}
		}
		if (tableRequested.isFull()) {
			String message = tableName + " is full";
			System.out.println(message);
			joinStatus.putBoolean("status", false).putString("message", message);
			return joinStatus;
		}

		// System.out.println("\n\nCONDITION BUYIN :
		// "+playerRequesting.getBalance()+"<"+tableRequested.getBuyIn()+"\n\n");
		if (playerRequesting.getBalance() < tableRequested.getBuyIn()) {
			String message = playerRequesting.getUsername() + " cannot meet the buy-in";
			System.out.println(message);
			joinStatus.putBoolean("status", false).putString("message", message);
			return joinStatus;
		}
		String message = playerRequesting.getUsername() + " has joined table " + tableName;
		System.out.println(message);
		joinStatus.putBoolean("status", true).putString("message", message).putString("tableName", tableName);
		playerRequesting.setBalance(playerRequesting.getBalance() - tableRequested.getBuyIn());
		playerRequesting.initializeTableFinancials(tableName, 1000000, order);

		// store new balance in database, update balance display
		// store table name in database
		eb.publish("Authenticator",
				new JsonObject().putString("action", "update").putString("username", playerRequesting.getUsername())
						.putObject("fields", new JsonObject().putNumber("balance", playerRequesting.getBalance())));
		eb.publish(playerRequesting.getSessionID() + ".ProfileUpdates",
				new JsonObject().putNumber("balance", playerRequesting.getBalance()));
		eb.publish(playerRequesting.getSessionID() + ".ProfileUpdates",
				new JsonObject().putString("table", tableName).putString("function", "add"));

		tableRequested.addPlayer(playerRequesting);
		return joinStatus;
	}

	public boolean tableExists(String tableName) {
		return gameTables.containsKey(tableName);
	}

	public boolean playerExists(String sessionID) {
		return players.containsKey(sessionID);
	}

	private void populateTableNamingList() throws FileNotFoundException {
		String filePath = this.getClass().getClassLoader().getResource("TableNamingList.txt").getPath();
		Scanner fileScanner = new Scanner(new File(filePath));
		while (fileScanner.hasNextLine()) {
			tableNameManager
					.add(new JsonObject().putString("tableName", fileScanner.nextLine()).putNumber("frequency", 0));
		}

		fileScanner.close();
	}

	private String getUnusedTableName() {
		int tableNameListSize = tableNameManager.size();
		int randomNumber = new Random().nextInt(tableNameListSize - 1);
		JsonObject tableNameObject = tableNameManager.get(randomNumber);
		String tableName = tableNameObject.getString("tableName");
		tableNameObject.putNumber("frequency", tableNameObject.getNumber("frequency").intValue() + 1);
		return tableName + " " + tableNameObject.getNumber("frequency").intValue();
	}

	private Player getPlayerWithUsername(String username) {
		for (String sessionID : players.keySet()) {
			if (players.get(sessionID).getUsername().equals(username))
				return players.get(sessionID);
		}
		return null;
	}
}
