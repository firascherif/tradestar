
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.vertx.java.core.Handler;
import org.vertx.java.core.Vertx;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;

public class Survivor {

	EventBus eb;
	Vertx vertxInstance;

	Handler<Message<JsonObject>> tradeHandler;
	Handler<Message<JsonObject>> leaderBoardHandler;
	Handler<Message<JsonObject>> runningTradesHandler;
	Handler<Message<JsonObject>> gameTimerHandler;
	Handler<Message<JsonObject>> chatHandler;
	Handler<Message<JsonObject>> playerStatusHandler;
	Handler<Message<JsonObject>> realTimeTradesHandler;

	Map<String, Double> currencyMap;
	JsonObject tableInfo = new JsonObject();
	JsonArray playersFinance = new JsonArray();
	JsonArray actionLog = new JsonArray();
	JsonArray instruments = new JsonArray();

	String gameEventsAddr;
	long startTime;
	long gameTimeInMillis;
	long eliminationInterval;
	boolean gameInProgress;

	Survivor(JsonObject newTableInfo, Vertx newVertxInstance) {
		System.out.println("Survivor.Survivor()");
		vertxInstance = newVertxInstance;
		eb = vertxInstance.eventBus();
		tableInfo = newTableInfo;
		start();
	}

	public void start() {
		System.out.println("Survivor.start()");

		gameEventsAddr = tableInfo.getString("tableName") + ".GameEvents";
		currencyMap = vertxInstance.sharedData().getMap("currencyMap");
		eliminationInterval = tableInfo.getLong("eliminationInterval");
		gameTimeInMillis = eliminationInterval * ((tableInfo.getNumber("maxPlayers").intValue()) - 1);
		System.out.println(gameTimeInMillis);
		startTime = System.currentTimeMillis();
		gameInProgress = true;
		instruments = tableInfo.getArray("instruments");

		prepareTable(); // Preps table by creating a JsonArray called
						// playersFinance. playersFincance holds all game
						// related information for a specific player.
		createActionLog(); // Trade history for each player in the current game.

		System.out.println(tableInfo);
		System.out.println(" ");
		System.out.println("Table " + tableInfo.getString("tableName") + " was launched!");
		System.out.println("-----------------------------------------------");

		tradeHandler = new Handler<Message<JsonObject>>() {
			public void handle(Message<JsonObject> message) {

				// Expect: JsonObject of SessionID/TradeTypeFlag(1 buy - 2 sell
				// - 3 close buy - 4 close sell)/Currency/Volume
				JsonObject newTradeRequest = message.body();
				System.out.println(newTradeRequest);
				int tempSessionArrayPosition = isSessionIDOnTable(newTradeRequest);

				if (tempSessionArrayPosition >= 0) {

					JsonObject tempTablePlayerInfo = playersFinance.get(tempSessionArrayPosition);
					int tempTradeFlag = newTradeRequest.getInteger("tradeTypeFlag");

					if (tempTradeFlag <= 2) { // Add -> Buy/Sell

						if (validateInstrument(newTradeRequest.getString("currency"))) {

							int playerTradeLimit = tempTablePlayerInfo.getInteger("tradeLimit");
							String tradeTypeString;
							if (tempTradeFlag == 1)
								tradeTypeString = "buy";
							else
								tradeTypeString = "sell";

							if (playerTradeLimit > 0 || playerTradeLimit < 0) {
								double tempPlayerFreeVolume = tempTablePlayerInfo.getNumber("freeVolume").doubleValue();
								double tempTradeVolume = newTradeRequest.getNumber("volume").doubleValue();
								double tempCurrencyValue = currencyMap.get(newTradeRequest.getString("currency"));

								String tradeID = UUID.randomUUID().toString();

								if (tempPlayerFreeVolume >= tempTradeVolume) {

									tempTablePlayerInfo.putNumber("freeVolume", tempPlayerFreeVolume - tempTradeVolume);
									JsonArray tempTrade = tempTablePlayerInfo.getArray("trades");
									JsonObject newTrade = new JsonObject();
									newTrade.putNumber("tradeVolume", tempTradeVolume)
											.putNumber("tradePrice", tempCurrencyValue)
											.putString("tradeCurrency", newTradeRequest.getString("currency"))
											.putString("tradeID", tradeID).putNumber("tradeTypeFlag", tempTradeFlag);
									tempTrade.add(newTrade);
									System.out.println("New " + tradeTypeString + " trade:");
									System.out.println("Table Name: " + tableInfo.getString("tableName"));
									System.out.println("Volume: " + tempTradeVolume);
									System.out.println("Price: " + tempCurrencyValue);
									System.out.println("Currency: " + newTradeRequest.getString("currency"));
									System.out.println("TradeID: " + tradeID);
									System.out.println(" ");
									tempTablePlayerInfo.putNumber("tradeLimit", playerTradeLimit - 1);

									message.reply(new JsonObject().putString("tradeID", tradeID)
											.putNumber("tradeVolume", tempTradeVolume)
											.putString("tradeCurrency", newTradeRequest.getString("currency"))
											.putNumber("tradePrice", tempCurrencyValue)
											.putNumber("freeVolume",
													tempTablePlayerInfo.getNumber("freeVolume").doubleValue())
											.putNumber("tradeLimit",
													tempTablePlayerInfo.getNumber("tradeLimit").intValue())
											.putBoolean("stat", true));
								} else
									message.reply(new JsonObject()
											.putString("error", "Player does not have that volume to trade!")
											.putBoolean("stat", false));
							} else
								message.reply(
										new JsonObject().putString("error", "Player does not have any trades left")
												.putBoolean("stat", false));
						} else
							message.reply(new JsonObject()
									.putString("error", "Instrument not available to trade in this game")
									.putBoolean("stat", false));
					} else if (tempTradeFlag == 3) { // Close
						JsonArray tempTrades = tempTablePlayerInfo.getArray("trades");
						System.out.println("closing a trade");

						for (int i = 0; i < tempTrades.size(); ++i) {
							JsonObject tempTrade = tempTrades.get(i);
							if (tempTrade.getString("tradeID").equals(newTradeRequest.getString("tradeID"))) {

								closeTrade(tempTrade, tempSessionArrayPosition, tempTablePlayerInfo);

								JsonArray newTradesArray = new JsonArray();

								for (int j = 0; j < tempTrades.size(); ++j) {
									if (j != i) {
										newTradesArray.add(tempTrades.get(j));
									}
								}
								tempTablePlayerInfo.putArray("trades", newTradesArray);
							}
						}
					} else if (tempTradeFlag == 4) { // Close all
						JsonArray tempTrades = tempTablePlayerInfo.getArray("trades");
						for (int i = 0; i < tempTrades.size(); ++i) {
							JsonObject tempTrade = tempTrades.get(i);
							closeTrade(tempTrade, tempSessionArrayPosition, tempTablePlayerInfo);
						}
						tempTablePlayerInfo.putArray("trades", new JsonArray());
					}
					message.reply(new JsonObject().putNumber("freeVolume",
							tempTablePlayerInfo.getNumber("freeVolume").doubleValue()));

				} else
					message.reply(new JsonObject().putString("error", "SessionID does not exist in this game!")
							.putBoolean("stat", false));
			}
		};

		leaderBoardHandler = new Handler<Message<JsonObject>>() {
			public void handle(Message<JsonObject> message) {
				message.reply(leaderBoard());
			}
		};

		runningTradesHandler = new Handler<Message<JsonObject>>() {
			public void handle(Message<JsonObject> message) {
				// Expect: SessionID - Return All SessionID running Trades.
				JsonObject runningTradesUpdateRequest = message.body();
				int tempSessionArrayPosition = isSessionIDOnTable(runningTradesUpdateRequest);

				if (tempSessionArrayPosition >= 0) {
					JsonArray replyArray = new JsonArray();
					JsonObject tempTablePlayerInfo = playersFinance.get(tempSessionArrayPosition);
					double tempTotalPlayerVolume = tempTablePlayerInfo.getNumber("freeVolume").doubleValue();

					JsonArray tempTrades = tempTablePlayerInfo.getArray("trades");
					for (int i = 0; i < tempTrades.size(); ++i) {

						JsonObject tempTradeToAdd = new JsonObject();
						JsonObject tempTrade = tempTrades.get(i);

						int tempTradeFlag = tempTrade.getInteger("tradeTypeFlag");
						int buySellCoefficient;

						if (tempTradeFlag == 1)
							buySellCoefficient = 1;
						else
							buySellCoefficient = -1;

						String tempTradeCurrency = tempTrade.getString("tradeCurrency");

						double tempTradeVolume = tempTrade.getNumber("tradeVolume").doubleValue();
						double tempTradePrice = tempTrade.getNumber("tradePrice").doubleValue();
						double tempTradeClosingPrice = currencyMap.get(tempTradeCurrency);

						double tempTradePercentage = buySellCoefficient * (tempTradeClosingPrice - tempTradePrice)
								/ tempTradePrice;
						double tempTradeGain = tempTradePercentage * tempTradeVolume;
						double tempTradeTotal = tempTradeVolume + tempTradeGain;

						tempTradeToAdd.putNumber("tradeTypeFlag", tempTradeFlag);
						tempTradeToAdd.putString("tradeID", tempTrade.getString("tradeID"));
						tempTradeToAdd.putString("tradeCurrency", tempTradeCurrency);
						tempTradeToAdd.putNumber("tradeVolume", tempTradeVolume);
						tempTradeToAdd.putNumber("tradePercentage", tempTradePercentage);
						tempTradeToAdd.putNumber("tradeGain", tempTradeGain);

						tempTotalPlayerVolume += tempTradeTotal;
						replyArray.add(tempTradeToAdd);
					}

					tempTablePlayerInfo.putNumber("totalVolume", tempTotalPlayerVolume);
					message.reply(replyArray.add(new JsonObject().putNumber("freeVolume",
							tempTablePlayerInfo.getNumber("freeVolume").doubleValue())));

				} else
					message.reply(new JsonObject().putString("error", "SessionID does not exist in this game!"));
			}
		};

		gameTimerHandler = new Handler<Message<JsonObject>>() {
			public void handle(Message<JsonObject> message) {
				long elapsedTimeInMillis = System.currentTimeMillis() - startTime;
				message.reply(new JsonObject().putBoolean("stat", gameInProgress).putNumber("elapsedTimeInMillis",
						gameTimeInMillis - elapsedTimeInMillis));
			}
		};

		chatHandler = new Handler<Message<JsonObject>>() {
			public void handle(Message<JsonObject> message) {
			}
		};

		playerStatusHandler = new Handler<Message<JsonObject>>() {
			public void handle(Message<JsonObject> message) {
				String sessionID = message.body().getString("sessionID");
				JsonArray playerStatus = new JsonArray();

				for (int i = 0; i < tableInfo.getArray("playerInfo").size(); i++) {
					JsonObject playerInfo = tableInfo.getArray("playerInfo").get(i);
					JsonArray playerIDs = tableInfo.getArray("sessionIDs");
					JsonObject tempIDObject = playerIDs.get(i);
					String tempID = tempIDObject.getString("sessionID");

					if (tempID.equals(sessionID)) {
						// System.out.println(playerInfo.getString("userName") +
						// " ping");
						playerInfo.putNumber("lastPing", System.currentTimeMillis());
					} else {
						// System.out.println(playerInfo.getString("userName") +
						// " check");
						long lastPing = playerInfo.getNumber("lastPing").longValue();
						if (System.currentTimeMillis() - lastPing > 10000) {
							playerStatus.add(new JsonObject().putString("userName", playerInfo.getString("userName"))
									.putBoolean("online", false));
						} else {
							playerStatus.add(new JsonObject().putString("userName", playerInfo.getString("userName"))
									.putBoolean("online", true));
						}
					}
				}
				message.reply(playerStatus);
			}
		};

		long timerID = vertxInstance.setPeriodic(eliminationInterval, new Handler<Long>() {
			public void handle(Long timerID) {
				if (tableInfo.getArray("playerInfo").size() > 1) {
					System.out.println(System.currentTimeMillis() - startTime);
					JsonArray currentLeaderBoard = leaderBoard();
					JsonObject lastPlacePlayerObj = currentLeaderBoard.get(currentLeaderBoard.size() - 1);
					String lastPlacePlayerName = lastPlacePlayerObj.getString("userName");

					System.out.println(lastPlacePlayerName);

					System.out.println(gameEventsAddr);
					eb.publish(gameEventsAddr, lastPlacePlayerName);

					JsonArray playerInfo = tableInfo.getArray("playerInfo");
					JsonArray IDInfo = tableInfo.getArray("sessionIDs");
					JsonArray tempPlayerArray = new JsonArray();
					JsonArray tempIDArray = new JsonArray();
					JsonArray tempFinances = new JsonArray();

					for (int i = 0; i < playerInfo.size(); i++) {
						JsonObject currentPlayer = playerInfo.get(i);
						JsonObject currentID = IDInfo.get(i);
						if (!currentPlayer.getString("userName").equals(lastPlacePlayerName)) {
							tempPlayerArray.add(currentPlayer);
							tempIDArray.add(currentID);
							tempFinances.add(playersFinance.get(i));

						}
					}
					tableInfo.putArray("playerInfo", tempPlayerArray);
					tableInfo.putArray("sessionIDs", tempIDArray);
					playersFinance = tempFinances;

				} else {
					vertxInstance.cancelTimer(timerID);
					gameInProgress = false;
				}
			}
		});

		eb.registerHandler(tableInfo.getString("tableName") + ".NewTrade", tradeHandler);
		eb.registerHandler(tableInfo.getString("tableName") + ".LeaderBoard", leaderBoardHandler);
		eb.registerHandler(tableInfo.getString("tableName") + ".RunningTrades", runningTradesHandler);
		eb.registerHandler(tableInfo.getString("tableName") + ".PlayerStatus", playerStatusHandler);
		eb.registerHandler(tableInfo.getString("tableName") + ".GameTimer", gameTimerHandler);
		eb.registerHandler(tableInfo.getString("tableName") + ".Chat", chatHandler);

	}

	private void prepareTable() {
		JsonArray tempIDs = tableInfo.getArray("sessionIDs");
		int userAmountOfTrades = tableInfo.getNumber("tradeLimit").intValue();
		for (int i = 0; i < tempIDs.size(); ++i) {
			playersFinance
					.add(new JsonObject().putString("sessionIDs", ((JsonObject) tempIDs.get(i)).getString("sessionID"))
							.putNumber("freeVolume", 1000000).putNumber("totalVolume", 1000000)
							.putNumber("tradeLimit", userAmountOfTrades).putArray("trades", new JsonArray()));
		}
	}

	private int isSessionIDOnTable(JsonObject msg) {
		for (int i = 0; i < playersFinance.size(); ++i) {
			JsonObject tempObj = playersFinance.get(i);

			if (tempObj.getString("sessionIDs").equals(msg.getString("sessionID"))) {
				return i;
			}
		}
		return -1;
	}

	public void endGame() {
		System.out.println("ending game");

		System.out.println(tableInfo.getString("tableName") + ".NewTrade");

		// eb.unregisterHandler(tableInfo.getString("tableName") + ".NewTrade",
		// tradeHandler);
		// eb.unregisterHandler(tableInfo.getString("tableName") +
		// ".LeaderBoard", leaderBoardHandler);
		// eb.unregisterHandler(tableInfo.getString("tableName") +
		// ".RunningTrades", runningTradesHandler);
		// eb.unregisterHandler(tableInfo.getString("tableName") +
		// ".PlayerStatus", playerStatusHandler);
		// eb.unregisterHandler(tableInfo.getString("tableName") + ".GameTimer",
		// gameTimerHandler);
		// eb.unregisterHandler(tableInfo.getString("tableName") + ".Chat",
		// chatHandler);
		// eb.unregisterHandler("RealTimeTrades", realTimeTradesHandler);

		String tableName = tableInfo.getString("tableName");
		JsonObject table = new JsonObject().putString("tableName", tableName);
		eb.publish("EndGame", table);
	}

	private JsonArray leaderBoard() {

		List<JsonObject> toSort = new ArrayList<JsonObject>();
		JsonArray leaderBoard = new JsonArray();

		for (int i = 0; i < playersFinance.size(); i++) {

			JsonObject currentPlayerFinance = playersFinance.get(i);

			// change session ID to player name

			String name = ((JsonObject) tableInfo.getArray("playerInfo").get(i)).getString("userName");

			double potVol = currentPlayerFinance.getNumber("totalVolume").doubleValue();

			toSort.add(new JsonObject().putNumber("totalVolume", potVol).putString("userName", name));
		}

		Collections.sort(toSort, new Comparator<JsonObject>() {
			@Override
			public int compare(JsonObject o1, JsonObject o2) {
				return 0;
			}
		});

		for (int i = 0; i < toSort.size(); i++)
			leaderBoard.add(toSort.get(i));

		return leaderBoard;
	}

	private void getPlayerInfoWithID(String sessionID) {
		eb.send("GetPlayerInfo", sessionID, new Handler<Message<JsonObject>>() {
			public void handle(Message<JsonObject> message) {
				System.out.println("I received a reply " + message.body());
			}
		});
	}

	private void createActionLog() {
		for (int i = 0; i < tableInfo.getInteger("totalPlayers").intValue(); i++) {
			actionLog.add(new JsonArray());
		}

	}

	private void closeTrade(JsonObject tempTrade, int tempSessionArrayPosition, JsonObject tempTablePlayerInfo) {
		int tradeTypeFlag = tempTrade.getInteger("tradeTypeFlag").intValue();
		int buySellCoefficient;

		if (tradeTypeFlag == 1)
			buySellCoefficient = 1;
		else
			buySellCoefficient = -1;

		double tempInitialPrice = tempTrade.getNumber("tradePrice").doubleValue();
		String tempInitialCurrency = tempTrade.getString("tradeCurrency");
		double tempClosePrice = currencyMap.get(tempInitialCurrency);
		double tempTradeVolume = tempTrade.getNumber("tradeVolume").doubleValue();
		double tempTotalTradeValue = tempTradeVolume;
		double gain = (tempTradeVolume * (buySellCoefficient * (tempClosePrice - tempInitialPrice) / tempInitialPrice));
		tempTotalTradeValue += gain;
		double tempFreeVolume = tempTablePlayerInfo.getNumber("freeVolume").doubleValue();
		tempTablePlayerInfo.putNumber("freeVolume", tempFreeVolume + tempTotalTradeValue);

		logTrade(tempSessionArrayPosition, gain);

	}

	private void logTrade(int tempSessionArrayPosition, double gain) {
		JsonArray playerActionLog = actionLog.get(tempSessionArrayPosition);
		int numOfTradesClosed = playerActionLog.size();
		String tradeInfo = numOfTradesClosed + ": Closed a trade : " + gain;
		playerActionLog.addString(tradeInfo);

	}

	private boolean validateInstrument(String instrument) {
		for (int i = 0; i < instruments.size(); i++) {
			JsonObject tempInstrumentObj = instruments.get(i);
			String tempInstrument = tempInstrumentObj.getString("instrument");
			if (tempInstrument.equals(instrument)) {
				System.out.println(currencyMap);
				if (currencyMap.containsKey(instrument))
					return true;
			}
		}
		return false;
	}
}