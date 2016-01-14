

// File: LobbyManager.java
// Author(s): Andrew Costa, Harsh Shah, Fred Sevilliano
// Last Modification: 9/11/14
// Desc: GameTable.java manages the game play for each table. The program provides the game logic and chat functionality
//       for each table.
// Copyright (C) 2014

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.vertx.java.core.Handler;
import org.vertx.java.core.Vertx;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;



public class GameTable {

	EventBus eb;
	int pauseCounter;
	// Remove: private long peaceGameTime;
	JsonArray instruments;
	int eliminatorRound;
	List<Player> listOfPlayers;
	List<Player> listOfPlayers_temp;
	List<JsonObject> chatMessage;
	Map<String, Float> currencyMap;
	Map<Player, ArrayList<String>> tradeHistory;
	List<Player> leaderBoard;
	Handler<Message<JsonObject>> tableInfoHandler;
	Handler<Message<JsonObject>> playersInfoHandler;
	Handler<Message<JsonObject>> chatHandler;
	Handler<Message<JsonObject>> tradeHandler;
	Handler<Message<JsonObject>> orderHandler;
	Handler<Message<JsonObject>> eliminatorHandler;
	Handler<Message<JsonObject>> historyHandler;
	// Handler<Message<JsonObject>> eliminatedPlayersHandler;
	private Vertx vertxInstance;
	private String tableName;
	private String gameType;
	private float tableBuyIn;
	private int maxPlayers;
	private int totalPlayers;
	private int tradeLimit;
	private boolean privateGame;
	private String password;
	private long totalGameTime;
	private long roundGameTime;
	private long startTime;
	private long roundStartTime;
	private long elapsedTime;
	private long elapsedRoundTime;
	private long tradeEngine;
	private long pauseTimer;
	private float tableMoney;
	private float hitAndRunAmount;
	private String chatAddr;
	private String leaderBoardAddr;
	private String timerAddr;
	private String gameStartAddr;
	private String newPlayerAddr;
	private boolean tradeEngineActive;

	private DateFormat dateFormat;

	public GameTable(JsonObject tableInfo, Vertx vertxInstance) {
		System.out.println("GameTable.GameTable(), tableInfo " + tableInfo.encodePrettily());

		this.vertxInstance = vertxInstance;
		eb = vertxInstance.eventBus();
		initializeTable(tableInfo);
		initializeTableLobby();
	}

	private void initializeTable(JsonObject tableInfo) {
		tableName = tableInfo.getString("tableName");
		gameType = tableInfo.getString("gameType");
		tableBuyIn = tableInfo.getNumber("buyIn").floatValue();
		maxPlayers = tableInfo.getNumber("maxPlayers").intValue();
		totalPlayers = 0;
		tradeLimit = tableInfo.getNumber("tradeLimit").intValue();
		privateGame = tableInfo.getBoolean("private");
		instruments = tableInfo.getArray("instruments");
		tradeEngineActive = false;
		tableMoney = 1000000;

		if (tableInfo.containsField("hitAndRunAmount"))
			hitAndRunAmount = tableInfo.getNumber("hitAndRunAmount").floatValue();

		chatAddr = tableName + ".ReceiveChatMessage";
		leaderBoardAddr = tableName + ".LeaderBoard";
		timerAddr = tableName + ".Timer";
		gameStartAddr = tableName + ".GameStart";
		newPlayerAddr = tableName + ".NewPlayer";

		listOfPlayers = new ArrayList<>();
		leaderBoard = new ArrayList<>();
		chatMessage = new ArrayList<>();
		tradeHistory = new ConcurrentHashMap<>();

		dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");

		if (privateGame)
			password = tableInfo.getString("password");
		else
			password = null;

		if (gameType.equals("Fourty four") || gameType.equals("Hit & Run")) {
			totalGameTime = tableInfo.getLong("totalGameTime");
			roundGameTime = 0;
		}

		if (gameType.equals("Survivor") || gameType.equals("Eliminator")) {
			pauseCounter = 30;
			roundGameTime = tableInfo.getLong("roundGameTime");
			totalGameTime = roundGameTime * (maxPlayers - 1);
			elapsedRoundTime = 0;
		}
	}

	private void initializeTableLobby() {

		tableInfoHandler = new Handler<Message<JsonObject>>() {
			public void handle(Message<JsonObject> message) {
				message.reply(toJson());
			}
		};

		playersInfoHandler = new Handler<Message<JsonObject>>() {
			public void handle(Message<JsonObject> message) {
				message.reply(getPlayerListAsJsonArray());

				System.out.println("-------------------");
				System.out.println("Requested: " + getPlayerListAsJsonArray());
				System.out.println("-------------------");
			}
		};

		chatHandler = new Handler<Message<JsonObject>>() {
			public void handle(Message<JsonObject> message) {
				if (message.body().containsField("msg") && message.body().containsField("sessionID")) {
					message.reply(chatEngine(message.body()));
				} else
					message.reply(false);
			}
		};

		eb.registerHandler(tableName + ".TableInfo", tableInfoHandler);
		eb.registerHandler(tableName + ".PlayersInfo", playersInfoHandler);
		eb.registerHandler(tableName + ".Chat", chatHandler);

	}

	public void startGame() {

		long countdown = vertxInstance.setPeriodic(1000, new Handler<Long>() {
			int counter = 0;

			public void handle(Long countdown) {
				System.out.println("loading startgame..");
				if (counter < 5)
					eb.publish(tableName + ".GameStart", 5 - counter);
				else if (counter == 6) {
					eb.publish(gameStartAddr, "modalOff");
					vertxInstance.cancelTimer(countdown);
					startGamePlay();
				} else {
					eb.publish(gameStartAddr, "Start!");
				}
				counter++;
			}
		});
	}

	public void startGamePlay() {
		tableStartMsg();
		elapsedTime = 0;
		//currencyMap = vertxInstance.sharedData().getMap("currencyMap");
		currencyMap = vertxInstance.sharedData().getMap("RealTradingData");

		historyHandler = new Handler<Message<JsonObject>>() {
			public void handle(Message<JsonObject> message) {
				Player player = getPlayerWithSessionID(message.body().getString("sessionID"));
				message.reply(tradeHistoryAsJson(player));
			}
		};

		tradeHandler = new Handler<Message<JsonObject>>() {
			public void handle(Message<JsonObject> message) {
				// Expect: JsonObject of SessionID/TradeTypeFlag(1 buy - 2 sell
				// - 3 close buy - 4 close sell)/Currency/Volume
				message.reply(processTrade(message.body()));
			}
		};

		orderHandler = new Handler<Message<JsonObject>>() {
			public void handle(Message<JsonObject> message) {
				// Expect: JsonObject of SessionID/TradeTypeFlag(1 buy - 2 sell
				// - 3 close buy - 4 close sell)/Currency/Volume
				message.reply(processOrder(message.body()));
			}
		};

		initiateGlobalGameTimerControls();

		eb.registerHandler(tableName + ".NewTrade", tradeHandler);
		eb.registerHandler(tableName + ".NewOrder", orderHandler);
		eb.registerHandler(tableName + ".History", historyHandler);
		// eb.registerHandler(tableName + ".EliminatedPlayers",
		// eliminatedPlayersHandler);

	}

	public Player getPlayerWithSessionID(String sessionID) {
		for (int i = 0; i < listOfPlayers.size(); i++) {
			if (listOfPlayers.get(i).getSessionID().equals(sessionID))
				return listOfPlayers.get(i);
		}
		return null;
	}

	private JsonArray tradeHistoryAsJson(Player player) {
		List<String> tempHistory = tradeHistory.get(player);
		JsonArray tradeHistory = new JsonArray();
		for (int i = 0; i < tempHistory.size(); i++) {
			tradeHistory.add(new JsonObject().putString("tradeHistory", tempHistory.get(i)));
		}
		return tradeHistory;
	}

	public void launchTradeEngine() {
		tradeEngineActive = true;
		updateTimers();
		updateTrades();
		updateLeaderBoard();

		if (gameType.equals("Hit & Run")) {
			checkHitAndRunCondition();
		}

		tradeEngine = vertxInstance.setPeriodic(1000, new Handler<Long>() {
			public void handle(Long tradeEngine) {
				tradeEngineActive = true;
				updateTimers();
				updateTrades();
				updateLeaderBoard();
				if (gameType.equals("Hit & Run")) {
					checkHitAndRunCondition();
				}
				tradeEngineActive = false;
			}
		});
	}

	private void checkHitAndRunCondition() {
		for (int i = 0; i < leaderBoard.size(); i++) {
			Player winner = leaderBoard.get(i);
			Financials tempFinance = winner.getTableFinancials(getName());
			if ((tempFinance.totalVolume - tableMoney) >= hitAndRunAmount) {
				unregisterHandlers();
				vertxInstance.cancelTimer(tradeEngine);

				// notify winner
				eb.publish(winner.getSessionID() + "." + tableName + ".HitAndRunNotifications",
						new JsonObject().putBoolean("winner", true).putBoolean("end", true)
								.putArray("allPlayersRanking", getLeaderboardAsJsonArray()));

				// update player balance
				winner.setBalance(winner.getBalance() + tableBuyIn * totalPlayers);

				// update balance in graphic
				eb.publish(winner.getSessionID() + ".ProfileUpdates",
						new JsonObject().putNumber("balance", winner.getBalance()));

				// update balance in db
				eb.publish("Authenticator",
						new JsonObject().putString("action", "update").putString("username", winner.getUsername())
								.putObject("fields", new JsonObject().putNumber("balance", winner.getBalance())));

				eliminate(winner);

				for (int j = 0; j < listOfPlayers.size(); j++) {
					Player player = listOfPlayers.get(j);
					if (!player.getUsername().equals(winner.getUsername())) {
						eb.publish(player.getSessionID() + "." + tableName + ".HitAndRunNotifications", new JsonObject()
								.putBoolean("end", true).putArray("allPlayersRanking", getLeaderboardAsJsonArray()));
						eliminate(player);
					}
				}
				break;
			}
		}
	}

	public void initiateGlobalGameTimerControls() {

		if (gameType.equals("Hit & Run")) {
			launchTradeEngine();
		}

		if (gameType.equals("Fourty four")) {
			launchTradeEngine();
			long globalTimer = vertxInstance.setTimer(totalGameTime, new Handler<Long>() {
				public void handle(Long globalTimer) {
					unregisterHandlers();
					vertxInstance.cancelTimer(tradeEngine);
					while (tradeEngineActive)
						;
					System.out.println("tradeengine false");

					JsonArray leaderBoardArray = getLeaderboardAsJsonArray();
					eb.publish(tableName + ".Notifications",
							new JsonObject().putBoolean("end", true).putArray("allPlayersRanking", leaderBoardArray));

					Player winner = leaderBoard.get(0);
					winner.setBalance(winner.getBalance() + tableBuyIn * totalPlayers);
					winner.setNumStars(winner.getNumStars() + 1);

					eb.publish("Authenticator",
							new JsonObject().putString("action", "update").putString("username", winner.getUsername())
									.putObject("fields", new JsonObject().putNumber("balance", winner.getBalance())
											.putNumber("numStars", winner.getNumStars())));

					eb.publish(winner.getSessionID() + ".ProfileUpdates", new JsonObject()
							.putNumber("balance", winner.getBalance()).putNumber("numStars", winner.getNumStars()));

					JsonObject tableDetails = new JsonObject().putString("tableName", tableName).putArray("leaderBoard",
							leaderBoardArray).putNumber("totalGameTime", totalGameTime).putNumber("tableBuyIn", tableBuyIn);
					eb.publish(XPEventHandlersAddress.GameCompleted.name(), tableDetails);
					
					eb.publish(EventbusAddress.GlobalLeaderBoardUpdate.name(), winner.toJson());

				//	eb.publish("DestroyTable",new JsonObject().putString("tableName",tableName));
					//eb.send("DestroyTable",new JsonObject().putString("tableName",tableName));




					for (int i = listOfPlayers.size() - 1; i >= 0; i--) {
						removePlayer(listOfPlayers.get(i));
					}
				}
			});
		}

		if (gameType.equals("Survivor")) {
			launchTradeEngine();
			long roundTimer = vertxInstance.setPeriodic(roundGameTime, new Handler<Long>() {
				public void handle(Long roundTimer) {
					vertxInstance.cancelTimer(tradeEngine);
					while (tradeEngineActive)
						;

					Player eliminatedPlayer = null; // get eliminated player
													// (last place)
					Boolean found = false;
					int index = 1;
					while (!found) {
						if (!leaderBoard.get(leaderBoard.size() - index).getTableFinancials(tableName).eliminated) {
							found = true;
							eliminatedPlayer = leaderBoard.get(leaderBoard.size() - index);
						}
						index++;
					}

					eliminate(eliminatedPlayer); // Set elimination flag to true

					System.out.println("-------------------");
					System.out.println(eliminatedPlayer.getUsername() + " Eliminated: "
							+ eliminatedPlayer.getTableFinancials(tableName).eliminated);
					System.out.println("-------------------");

					// Notify eliminated player of elimination
					eb.publish(eliminatedPlayer.getSessionID() + "." + tableName + ".SurvivorNotifications",
							new JsonObject().putBoolean("elimination", true));

					System.out.println("-------------------");
					System.out.println("Notifying " + eliminatedPlayer.getUsername() + " of his elimination");
					System.out.println("-------------------");

					// Send all other players, still in the game and previously
					// eliminated, notification of who was eliminated
					for (int i = 0; i < listOfPlayers.size(); i++) {
						Player player = listOfPlayers.get(i);
						if (!player.getUsername().equals(eliminatedPlayer.getUsername())) {
							eb.publish(player.getSessionID() + "." + tableName + ".SurvivorNotifications",
									eliminatedPlayer.toJson().putBoolean("playerEliminated", true));

							System.out.println("-------------------");
							System.out.println("Notifying " + player.getUsername() + " of "
									+ eliminatedPlayer.getUsername() + "'s elimination");
							System.out.println("-------------------");

						}
					}

					System.out.println("-------------------");
					System.out.println("There are " + getActivePlayers() + " players still in the game");
					System.out.println("-------------------");

					if (getActivePlayers() > 1)
						launchTradeEngine();
					else { // end of game condition

						unregisterHandlers();
						vertxInstance.cancelTimer(roundTimer); // Stop rounds
						vertxInstance.cancelTimer(tradeEngine); // Stop trade
																// engine
						while (tradeEngineActive)
							; // wait for trade engine to stop

						Player winner = leaderBoard.get(0); // Get the winner
						eliminate(winner);

						winner.setBalance(winner.getBalance() + (tableBuyIn * maxPlayers)); // update
																							// winner's
																							// balance
						eb.publish(winner.getSessionID() + ".ProfileUpdates",
								new JsonObject().putNumber("balance", winner.getBalance())); // Update
																								// balance
																								// graphic
																								// for
																								// winner

						eb.publish("Authenticator",
								new JsonObject().putString("action", "update")
										.putString("username", winner.getUsername()).putObject("fields",
												new JsonObject().putNumber("balance", winner.getBalance())));

						// Notify Winner of end, win and ranking
						eb.publish(winner.getSessionID() + "." + tableName + ".SurvivorNotifications",
								new JsonObject().putBoolean("win", true).putBoolean("end", true)
										.putArray("allPlayersRanking", leaderBoardAsJsonArray()));

						for (int i = 0; i < listOfPlayers.size(); i++) {
							Player player = listOfPlayers.get(i);

							// notify rest players of end with ranking
							if (!player.getUsername().equals(winner.getUsername()))
								eb.publish(player.getSessionID() + "." + tableName + ".SurvivorNotifications",
										new JsonObject().putArray("allPlayersRanking", leaderBoardAsJsonArray())
												.putBoolean("end", true));
						}
					}
				}
			});
		}

		if (gameType.equals("Eliminator")) {
			eliminatorHandler = new Handler<Message<JsonObject>>() {
				public void handle(Message<JsonObject> message) {
					vertxInstance.cancelTimer(pauseTimer); // cancel pause timer
															// (pauses the game
															// so that leader
															// can eliminate
															// player

					Player eliminatedPlayer = getPlayerWithUsername(message.body().getString("username")); // get
																											// eliminated
																											// player
																											// from
																											// user
																											// message
					eliminate(eliminatedPlayer); // eliminate player

					System.out.println("-------------------");
					System.out.println(eliminatedPlayer.getUsername() + " Eliminated: "
							+ eliminatedPlayer.getTableFinancials(tableName).eliminated);
					System.out.println("-------------------");

					// notify eliminated player
					eb.publish(eliminatedPlayer.getSessionID() + "." + tableName + ".EliminatorNotifications",
							new JsonObject().putBoolean("elimination", true));

					System.out.println("-------------------");
					System.out.println("Notifying " + eliminatedPlayer.getUsername() + " of his elimination");
					System.out.println("-------------------");

					// notify all other players of the new elimination
					for (int i = 0; i < listOfPlayers.size(); i++) {
						Player player = listOfPlayers.get(i);
						if (!player.getUsername().equals(eliminatedPlayer.getUsername())) {
							eb.publish(player.getSessionID() + "." + tableName + ".EliminatorNotifications",
									new JsonObject().putBoolean("playerEliminated", true)
											.putString("username", eliminatedPlayer.getUsername())
											.putString("imgUrl", eliminatedPlayer.getImgUrl()));

							System.out.println("-------------------");
							System.out.println("Notifying " + player.getUsername() + " of "
									+ eliminatedPlayer.getUsername() + "'s elimination");
							System.out.println("-------------------");
						}
					}

					message.reply("");
					elapsedTime--;
					elapsedRoundTime--;
					launchTradeEngine();
					eliminatorRound();
				}
			};

			launchTradeEngine();
			eliminatorRound();

			eb.registerHandler(tableName + ".Eliminator", eliminatorHandler);

		}
	}

	public void eliminatorRound() {
		long roundTimer = vertxInstance.setTimer(roundGameTime, new Handler<Long>() {
			Player leader;

			public void handle(Long roundTimer) {
				vertxInstance.cancelTimer(tradeEngine);
				while (tradeEngineActive)
					;

				leader = leaderBoard.get(0); // Get the leader
				System.out.println("LEADER IS " + leader.getUsername());
				clearAllFinancials(); // Clear all players financials

				System.out.println("-------------------");
				System.out.println("There are " + getActivePlayers() + " players still in the game");
				System.out.println("-------------------");

				if (getActivePlayers() > 2) { // If game isn't over, do
												// elimination functions
					for (int i = 0; i < listOfPlayers.size(); i++) { // Send
																		// Wait
																		// for
																		// pick
																		// notification
																		// to
																		// everyone
																		// besides
																		// leader
						Player player = listOfPlayers.get(i);
						if (!player.getUsername().equals(leader.getUsername()))
							eb.publish(player.getSessionID() + "." + tableName + ".EliminatorNotifications",
									new JsonObject().putBoolean("waitForPick", true).putNumber("pauseCounter",
											pauseCounter));
					}
					eb.publish(leader.getSessionID() + "." + tableName + ".EliminatorNotifications",
							new JsonObject().putBoolean("makeAPick", true).putNumber("pauseCounter", pauseCounter));
					pauseCounter--;
					pauseTimer = vertxInstance.setPeriodic(1000, new Handler<Long>() { // Send
																						// the
																						// same
																						// message
																						// as
																						// above
																						// another
																						// 29
																						// times
						public void handle(Long pauseTimer) {
							if (pauseCounter > 0) {
								for (int i = 0; i < listOfPlayers.size(); i++) { // Send
																					// Wait
																					// for
																					// pick
																					// notification
																					// to
																					// everyone
																					// besides
																					// leader
									Player player = listOfPlayers.get(i);
									if (!player.getUsername().equals(leader.getUsername()))
										// eb.publish(player.getSessionID() +
										// "." + tableName +
										// ".EliminatorNotifications", new
										// JsonObject().putBoolean("waitForPick",
										// true).putNumber("pauseCounter",
										// pauseCounter));
										eb.publish(player.getSessionID() + "." + tableName + ".EliminatorNotifications",
												new JsonObject().putNumber("pauseCounter", pauseCounter));
								}
								// eb.publish(leader.getSessionID() + "." +
								// tableName + ".EliminatorNotifications", new
								// JsonObject().putBoolean("makeAPick",
								// true).putNumber("pauseCounter",
								// pauseCounter));
								eb.publish(leader.getSessionID() + "." + tableName + ".EliminatorNotifications",
										new JsonObject().putNumber("pauseCounter", pauseCounter));
								pauseCounter--;
							} else { // When timer has ellapsed and player
										// choice wasnt made
								vertxInstance.cancelTimer(pauseTimer);

								Player eliminatedPlayer = leaderBoard.get(1); // eliminate
																				// second
																				// placed
																				// player
								eliminate(eliminatedPlayer);

								// notify elimininated player
								eb.publish(
										eliminatedPlayer.getSessionID() + "." + tableName + ".EliminatorNotifications",
										new JsonObject().putBoolean("elimination", true));

								for (int i = 0; i < listOfPlayers.size(); i++) { // notify
																					// all
																					// players
																					// except
																					// elimininated
																					// player
																					// of
																					// elimination
									Player player = listOfPlayers.get(i);

									if (!player.getUsername().equals(eliminatedPlayer.getUsername())) {
										eb.publish(player.getSessionID() + "." + tableName + ".EliminatorNotifications",
												new JsonObject().putBoolean("playerEliminated", true)
														.putString("username", eliminatedPlayer.getUsername())
														.putString("imgUrl", eliminatedPlayer.getImgUrl()));
									}
								}
								elapsedTime--;
								elapsedRoundTime--;
								launchTradeEngine();
								eliminatorRound();
							}
						}
					});
				} else {
					vertxInstance.cancelTimer(tradeEngine);
					while (tradeEngineActive)
						;

					Player eliminatedPlayer = leaderBoard.get(1);
					eliminate(eliminatedPlayer);

					Player winner = leaderBoard.get(0);
					eliminate(winner);

					// notify eliminated player
					eb.publish(eliminatedPlayer.getSessionID() + "." + tableName + ".EliminatorNotifications",
							new JsonObject().putBoolean("elimination", true).putBoolean("end", true)
									.putArray("allPlayersRanking", getLeaderboardAsJsonArray()));

					// notify winner
					eb.publish(winner.getSessionID() + "." + tableName + ".EliminatorNotifications",
							new JsonObject().putBoolean("win", true).putBoolean("end", true)
									.putArray("allPlayersRanking", getLeaderboardAsJsonArray()));

					// update winner balance
					winner.setBalance(winner.getBalance() + (tableBuyIn * maxPlayers));

					// update winner balance graphic
					eb.publish(winner.getSessionID() + ".ProfileUpdates",
							new JsonObject().putNumber("balance", winner.getBalance()));

					eb.publish("Authenticator",
							new JsonObject().putString("action", "update").putString("username", winner.getUsername())
									.putObject("fields", new JsonObject().putNumber("balance", winner.getBalance())));

					for (int i = 0; i < listOfPlayers.size(); i++) { // notify
																		// rest
																		// of
																		// players
						Player player = listOfPlayers.get(i);
						if (!player.getUsername().equals(eliminatedPlayer.getUsername())
								|| !player.getUsername().equals(winner.getUsername()))
							eb.publish(player.getSessionID() + "." + tableName + ".EliminatorNotifications",
									new JsonObject().putBoolean("end", true).putArray("allPlayersRanking",
											getLeaderboardAsJsonArray()));
					}
				}
			}
		});
	}

	public void removePlayer(Player player) {
		System.out.println("Removing: " + player.getUsername());
		listOfPlayers.remove(player);
		leaderBoard.remove(player);
		tradeHistory.remove(player);
		totalPlayers--;

		eb.publish(newPlayerAddr, player.toJson().putNumber("order", player.getTableFinancials(tableName).order)
				.putString("function", "remove"));
		eb.publish(player.getSessionID() + ".ProfileUpdates",
				new JsonObject().putString("table", tableName).putString("function", "remove"));
		eb.publish("IncomingTables", this.toJson());
		player.removeTableFinancials(tableName);

		for (String key : player.tableFinancials.keySet())
			System.out.println(key);
	}

	public void eliminate(Player player) {
		player.getTableFinancials(tableName).eliminated = true;
		/*
		 * if(gameType.equals("Eliminator")) { leaderBoard.remove(player);
		 * leaderBoard.add(player); }
		 */
	}

	private void unregisterHandlers() {
		eb.registerHandler(tableName + ".NewTrade", tradeHandler);
	}

	private void updateTimers() {
		/*
		 * long currentTime = System.currentTimeMillis(); long elapsedTime =
		 * currentTime - startTime; long timeRemaining = totalGameTime -
		 * elapsedTime;
		 */

		long timeRemaining = totalGameTime - (elapsedTime * 1000);
		elapsedTime++;

		JsonObject time = new JsonObject();
		time.putNumber("timeRemaining", timeRemaining);

		if (gameType.equals("Survivor") || gameType.equals("Eliminator")) {
			// long elapsedRoundTime = currentTime - roundStartTime;

			if (elapsedRoundTime == roundGameTime / 1000)
				elapsedRoundTime = 0;

			if (timeRemaining == 0)
				elapsedRoundTime = roundGameTime / 1000;

			long roundTimeRemaining = roundGameTime - (elapsedRoundTime * 1000);

			elapsedRoundTime++;

			time.putNumber("roundTimeRemaining", roundTimeRemaining);
		}
		time.putString("tableTimer", tableName).putString("gameType", gameType);
		eb.publish(timerAddr, time);

	}

	private void updateLeaderBoard() {
		List<Player> tempList = new ArrayList<Player>();

		for (int i = 0; i < leaderBoard.size(); i++) {
			Player player = leaderBoard.get(i);
			if (!player.getTableFinancials(this.getName()).eliminated) {
				tempList.add(player);
			}
		}
		Collections.sort(tempList, new LeaderBoardComp(tableName));

		for (int i = 0; i < leaderBoard.size(); i++) {
			Player player = leaderBoard.get(i);
			if (player.getTableFinancials(this.getName()).eliminated) {
				tempList.add(player);
			}
		}

		leaderBoard = tempList;

		eb.publish(leaderBoardAddr, leaderBoardAsJsonArray());
		// System.out.println(leaderBoard);
	}

	private JsonArray leaderBoardAsJsonArray() {
		JsonArray leaderBoardAsJsonArray = new JsonArray();

		for (int i = 0; i < leaderBoard.size(); i++) {
			Player player = leaderBoard.get(i);
			JsonObject playerJson = new JsonObject().putString("username", player.getUsername())
					.putNumber("totalVolume", player.getTableFinancials(tableName).totalVolume);
			leaderBoardAsJsonArray.add(playerJson);
		}
		return leaderBoardAsJsonArray;
	}

	private void updateTrades() {
		for (int j = 0; j < listOfPlayers.size(); j++) {

			JsonArray tradeList = new JsonArray();

			Financials tempFinance = listOfPlayers.get(j).getTableFinancials(tableName);

			if (!tempFinance.eliminated) {

				float tempTotalPlayerVolume = tempFinance.freeVolume;

				for (int i = 0; i < tempFinance.trades.size(); ++i) {

					Trade trade = tempFinance.trades.get(i);

					JsonObject tempTradeToAdd = trade.toJson();
					float tempTradePercentage;
					if (trade.typeFlag == 1)
						tempTradePercentage = (currencyMap.get(trade.currency) - trade.curValAtPurchase)
								/ trade.curValAtPurchase;
					else
						tempTradePercentage = -1 * (currencyMap.get(trade.currency) - trade.curValAtPurchase)
								/ trade.curValAtPurchase;
					float tempTradeGain = tempTradePercentage * trade.volume;

					tempTradeToAdd.putString("tableName", tableName);
					tempTradeToAdd.putNumber("tradePercentage", tempTradePercentage);
					tempTradeToAdd.putNumber("tradeGain", tempTradeGain);

					tempTotalPlayerVolume += trade.volume + tempTradeGain;
					tradeList.add(tempTradeToAdd);
				}
				tempFinance.totalVolume = tempTotalPlayerVolume;

				if (tradeList.size() > 0)
					eb.publish(listOfPlayers.get(j).getSessionID() + "." + tableName + ".Trades", tradeList);
			}
		}
	}

	// -------------------------------------------------------------------
	private JsonObject processOrder(JsonObject msg) {
		if (getPlayerWithSessionID(msg.getString("sessionID")) != null) {
			Player player = getPlayerWithSessionID(msg.getString("sessionID"));

			if (!player.getTableFinancials(tableName).eliminated) {
				Financials tempFinance = player.getTableFinancials(tableName);
				int tempTradeFlag = msg.getInteger("tradeTypeFlag");

				if (tempTradeFlag <= 2) { // Add -> Buy/Sell
					if (validateInstrument(msg.getString("currency"))) {
						if (tradeLimit == 0 || tempFinance.trades.size() < tradeLimit) {
							float tempTradeVolume = msg.getNumber("volume").floatValue();
							float tempCurrencyValue = currencyMap.get(msg.getString("currency"));
							String tradeID = UUID.randomUUID().toString();

							if (tempFinance.freeVolume >= tempTradeVolume) {
								tempFinance.freeVolume = tempFinance.freeVolume - tempTradeVolume;

								Trade tempTrade = new Trade(tempTradeVolume, tempCurrencyValue,
										msg.getString("currency"), tempTradeFlag, tradeID);
								tempFinance.trades.add(tempTrade);

								tempTrade.print();

								eb.publish(tableName + ".Volumes",
										new JsonObject().putString("username", player.getUsername())
												.putNumber("freeVolume", tempFinance.freeVolume)
												.putNumber("order", player.getTableFinancials(tableName).order));
								logTrade(player, tempTrade, false);

								return tempTrade.toJson().putString("message", "success");
							} else
								return new JsonObject()
										.putString("message", "Player does not have that volume to trade!")
										.putBoolean("stat", false);
						} else
							return new JsonObject().putString("message", "Player does not have any trades left")
									.putBoolean("stat", false);
					} else
						return new JsonObject().putString("message", "Instrument not available to trade in this game")
								.putBoolean("stat", false);
				} else if (tempTradeFlag == 3) { // Close
					for (int i = 0; i < tempFinance.trades.size(); ++i) {
						Trade trade = tempFinance.trades.get(i);
						if (trade.ID.equals(msg.getString("tradeID"))) {
							closeTrade(player, tempFinance, trade);
						}
					}
					eb.publish(tableName + ".Volumes",
							new JsonObject().putString("username", player.getUsername())
									.putNumber("freeVolume", tempFinance.freeVolume)
									.putNumber("order", player.getTableFinancials(tableName).order));
					return new JsonObject().putString("message", "success");
				} else if (tempTradeFlag == 4) { // Close all
					for (int i = 0; i < tempFinance.trades.size(); ++i) {
						float gain = 0;
						Trade trade = tempFinance.trades.get(i);
						closeTrade(player, tempFinance, trade);
					}
					eb.publish(tableName + ".Volumes",
							new JsonObject().putString("username", player.getUsername())
									.putNumber("freeVolume", tempFinance.freeVolume)
									.putNumber("order", player.getTableFinancials(tableName).order));
					return new JsonObject().putString("message", "success");
				}
				return new JsonObject().putString("message", "success");
			} else
				return new JsonObject().putString("message", "Player is eliminated").putBoolean("stat", false);
		} else
			return new JsonObject().putString("message", "SessionID does not exist in this game!").putBoolean("stat",
					false);
	}

	// ----------------------------------------------

	private JsonObject processTrade(JsonObject msg) {
		if (getPlayerWithSessionID(msg.getString("sessionID")) != null) {
			Player player = getPlayerWithSessionID(msg.getString("sessionID"));

			if (!player.getTableFinancials(tableName).eliminated) {
				Financials tempFinance = player.getTableFinancials(tableName);
				int tempTradeFlag = msg.getInteger("tradeTypeFlag");

				if (tempTradeFlag <= 2) { // Add -> Buy/Sell
					if (validateInstrument(msg.getString("currency"))) {
						if (tradeLimit == 0 || tempFinance.trades.size() < tradeLimit) {
							float tempTradeVolume = msg.getNumber("volume").floatValue();
							float tempCurrencyValue = currencyMap.get(msg.getString("currency"));
							String tradeID = UUID.randomUUID().toString();

							if (tempFinance.freeVolume >= tempTradeVolume) {
								tempFinance.freeVolume = tempFinance.freeVolume - tempTradeVolume;

								Trade tempTrade = new Trade(tempTradeVolume, tempCurrencyValue,
										msg.getString("currency"), tempTradeFlag, tradeID);
								tempFinance.trades.add(tempTrade);

								tempTrade.print();

								eb.publish(tableName + ".Volumes",
										new JsonObject().putString("username", player.getUsername())
												.putNumber("freeVolume", tempFinance.freeVolume)
												.putNumber("order", player.getTableFinancials(tableName).order));
								logTrade(player, tempTrade, false);

								return tempTrade.toJson().putString("message", "success");
							} else
								return new JsonObject()
										.putString("message", "Player does not have that volume to trade!")
										.putBoolean("stat", false);
						} else
							return new JsonObject().putString("message", "Player does not have any trades left")
									.putBoolean("stat", false);
					} else
						return new JsonObject().putString("message", "Instrument not available to trade in this game")
								.putBoolean("stat", false);
				} else if (tempTradeFlag == 3) { // Close
					for (int i = 0; i < tempFinance.trades.size(); ++i) {
						Trade trade = tempFinance.trades.get(i);
						if (trade.ID.equals(msg.getString("tradeID"))) {
							closeTrade(player, tempFinance, trade);
						}
					}
					eb.publish(tableName + ".Volumes",
							new JsonObject().putString("username", player.getUsername())
									.putNumber("freeVolume", tempFinance.freeVolume)
									.putNumber("order", player.getTableFinancials(tableName).order));
					return new JsonObject().putString("message", "success");
				} else if (tempTradeFlag == 4) { // Close all
					for (int i = 0; i < tempFinance.trades.size(); ++i) {
						float gain = 0;
						Trade trade = tempFinance.trades.get(i);
						closeTrade(player, tempFinance, trade);
					}
					eb.publish(tableName + ".Volumes",
							new JsonObject().putString("username", player.getUsername())
									.putNumber("freeVolume", tempFinance.freeVolume)
									.putNumber("order", player.getTableFinancials(tableName).order));
					return new JsonObject().putString("message", "success");
				}
				return new JsonObject().putString("message", "success");
			} else
				return new JsonObject().putString("message", "Player is eliminated").putBoolean("stat", false);
		} else
			return new JsonObject().putString("message", "SessionID does not exist in this game!").putBoolean("stat",
					false);
	}

	private void closeTrade(Player player, Financials tempFinance, Trade trade) {
		// System.out.println("closing a trade");
		float gain = 0;
		if (trade.typeFlag == 1)
			gain = (trade.volume
					* (1 * (currencyMap.get(trade.currency) - trade.curValAtPurchase) / trade.curValAtPurchase));
		else
			gain = (trade.volume
					* (-1 * (currencyMap.get(trade.currency) - trade.curValAtPurchase) / trade.curValAtPurchase));

		logTrade(player, trade, true);
		tempFinance.freeVolume += trade.volume + gain;
		tempFinance.trades.remove(trade);
	}

	private void logTrade(Player player, Trade tempTrade, boolean close) {
		Date date = new Date();
		String history;

		if (close) {
			history = dateFormat.format(date) + ": Closed a " + tempTrade.type + " position " + " with "
					+ tempTrade.volume + " @ " + +tempTrade.curValAtPurchase + " " + tempTrade.currency;
		} else {
			history = dateFormat.format(date) + ": Took a " + tempTrade.type + " position " + " with "
					+ tempTrade.volume + " @ " + +tempTrade.curValAtPurchase + " " + tempTrade.currency;
		}

		// System.out.println("\n\nERROR player :" + tradeHistory+"\n\n");
		// tradeHistory.get(player).add(history);
		eb.publish(player.getSessionID() + "." + tableName + ".History", history);
	}

	public JsonObject toJson() {
		JsonObject newTableObj = new JsonObject().putString("tableName", getName()).putNumber("buyIn", getBuyIn())
				.putNumber("maxPlayers", getMaxPlayers()).putNumber("totalPlayers", getTotalPlayers())
				.putNumber("tradeLimit", getTradeLimit()).putString("gameType", getGameType())
				.putNumber("totalGameTime", getTotalTime()).putBoolean("private", isPrivate());
		return newTableObj;
	}

	private JsonArray getPlayerListAsJsonArray() {
		JsonArray playerList = new JsonArray();
		Player player;
		for (int i = 0; i < listOfPlayers.size(); i++) {
			player = leaderBoard.get(i);
			playerList.add(player.toJson().putObject("financials", player.getTableFinancials(tableName).toJson()));
		}
		return playerList;
	}

	/////////////////////////// GET LEADERBOARD PLAYERS
	/////////////////////////// /////////////////////////
	private JsonArray getLeaderboardAsJsonArray() {
		JsonArray playerList = new JsonArray();
		Player player;
		for (int i = 0; i < leaderBoard.size(); i++) {
			player = leaderBoard.get(i);
			playerList.add(player.toJson().putObject("financials", player.getTableFinancials(tableName).toJson()));
		}
		return playerList;
	}

	/////////////////////////// GET LEADERBOARD PLAYERS
	/////////////////////////// /////////////////////////
	/*
	 * private JsonArray getEliminatedPlayersAsJsonArray() { JsonArray
	 * playerList = new JsonArray(); for (int i = 0; i <
	 * eliminatedPlayers.size(); i++) {
	 * playerList.add(eliminatedPlayers.get(i).toJson()); } return playerList; }
	 */

	private boolean chatEngine(JsonObject tempChatInfo) {
		String sessionID = tempChatInfo.getString("sessionID");
		if (getPlayerWithSessionID(sessionID) != null) {
			JsonObject chatObj = new JsonObject();
			Player player = getPlayerWithSessionID(sessionID);
			chatObj.putString("username", player.getUsername());
			chatObj.putString("message", tempChatInfo.getString("msg"));
			chatMessage.add(chatObj);
			eb.publish(chatAddr, chatObj);
			return true;
		} else {
			System.out.println("Player not in this table....");
			return false;
		}
	}

	private Player getPlayerWithUsername(String username) {
		for (int i = 0; i < listOfPlayers.size(); i++) {
			if (listOfPlayers.get(i).getUsername().equals(username))
				return listOfPlayers.get(i);
		}
		return null;
	}

	private void tableStartMsg() {
		System.out.println(" ");
		System.out.println("Table " + tableName + " was launched!");
		System.out.println("-----------------------------------------------");
	}

	private boolean validateInstrument(String instrument) {
		for (int i = 0; i < instruments.size(); i++) {
			JsonObject tempInstrumentObj = instruments.get(i);
			String tempInstrument = tempInstrumentObj.getString("instrument");
			if (tempInstrument.equals(instrument)) {
				if (currencyMap.containsKey(instrument))
					return true;
			}
		}
		return false;
	}

	public void addPlayer(Player player) {
		if (totalPlayers < maxPlayers) {
			listOfPlayers.add(player);
			leaderBoard.add(player);
			tradeHistory.put(player, new ArrayList<String>());
			totalPlayers++;
			eb.publish("IncomingTables", this.toJson());
			eb.publish(newPlayerAddr, player.toJson().putNumber("order", player.getTableFinancials(tableName).order)
					.putString("function", "add"));
			System.out.println("NEW PLAYER COME : " + newPlayerAddr);
		}
	}

	private void clearAllFinancials() {
		for (int i = 0; i < listOfPlayers.size(); i++) {
			Player player = listOfPlayers.get(i);
			if (!player.getTableFinancials(tableName).eliminated) {
				int order = player.getTableFinancials(tableName).order;
				player.removeTableFinancials(tableName);
				player.initializeTableFinancials(tableName, tableMoney, order);
			}
		}
	}

	private int getActivePlayers() {
		int activePlayers = 0;
		for (int i = 0; i < listOfPlayers.size(); i++) {
			Player player = listOfPlayers.get(i);
			if (!player.getTableFinancials(tableName).eliminated)
				activePlayers++;
		}
		return activePlayers;
	}

	public String getName() {
		return tableName;
	}

	public String getGameType() {
		return gameType;
	}

	public float getBuyIn() {
		return tableBuyIn;
	}

	public int getMaxPlayers() {
		return maxPlayers;
	}

	public int getTotalPlayers() {
		return totalPlayers;
	}

	public void setTotalPlayers(int totalPlayers) {
		this.totalPlayers = totalPlayers;
	}

	public int getTradeLimit() {
		return tradeLimit;
	}

	public boolean isPrivate() {
		return privateGame;
	}

	public String getPassword() {
		return password;
	}

	public long getTotalTime() {
		return totalGameTime;
	}

	public boolean isFull() {
		if (totalPlayers == maxPlayers)
			return true;
		return false;
	}
}
