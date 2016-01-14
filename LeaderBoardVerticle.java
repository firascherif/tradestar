

import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.platform.Verticle;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

/**
 * This verticle will handle the leader board updates and publish to the
 * listeners
 * 
 * @author dharani kumar p(dharani.kumar@gmail.com)
 *
 */
public class LeaderBoardVerticle extends Verticle {

	public static final int LEADER_BOARD_SIZE = 100;

	@Override
	public void start() {
		container.logger().info("LeaderBoardVerticle.start()");
		final SortedSet<JsonObject> leaderBoardSet = getTopNPlayers();

		vertx.eventBus().registerHandler(EventbusAddress.PlayerUpdates.name(), new Handler<Message<JsonObject>>() {

			@Override
			public void handle(Message<JsonObject> message) {
				long startTime = System.currentTimeMillis();
				JsonObject body = message.body();
				container.logger().info("LeaderBoardVerticle.playerUpdates event handler " + body.encodePrettily());

				double balance = body.getNumber("balance").doubleValue();
				String username = body.getString("username");

				JsonObject userObjectFromSet = null;
				Set<JsonObject> tailSet = leaderBoardSet.tailSet(body);

				for (JsonObject jsonObject : tailSet) {
					if (jsonObject.getString("username").equals(username)) {
						userObjectFromSet = jsonObject;
						break;
					}
				}

				if (userObjectFromSet == null) {
					// Try the headSet now
					Set<JsonObject> headSet = leaderBoardSet.headSet(body);

					for (JsonObject jsonObject : headSet) {
						if (jsonObject.getString("username").equals(username)) {
							userObjectFromSet = jsonObject;
							break;
						}
					}
				}

				if (userObjectFromSet != null) {
					leaderBoardSet.remove(userObjectFromSet);
					userObjectFromSet.putNumber("balance", balance);
					leaderBoardSet.add(userObjectFromSet);
				} else {
					// TODO This is a bad assumption, need to fix this.
					body.putNumber("currentLevel", 0);
					leaderBoardSet.add(body);
				}

				if (leaderBoardSet.size() > LEADER_BOARD_SIZE) {
					JsonObject last = leaderBoardSet.last();
					leaderBoardSet.remove(last);
				}

				JsonArray arr = new JsonArray();
				for (JsonObject jsonObject : leaderBoardSet) {
					arr.add(jsonObject);
				}

				vertx.eventBus().publish(EventbusAddress.LeaderBoardUpdateJS.name(), arr);
				container.logger().info("Time taken " + (System.currentTimeMillis() - startTime) + "ms");
			}
		});

		vertx.eventBus().registerHandler(EventbusAddress.GetLeaderBoard.name(), new Handler<Message<JsonObject>>() {
			@Override
			public void handle(Message<JsonObject> message) {
				long startTime = System.currentTimeMillis();

				JsonObject body = message.body();
				container.logger().info("LeaderBoardVerticle.GetLeaderBoard event handler " + body.encodePrettily());

				JsonArray arr = new JsonArray();

				for (JsonObject jsonObject : leaderBoardSet) {
					arr.addObject(jsonObject);
				}

				message.reply(new JsonObject().putArray("leaderBoard", arr));
				container.logger().info("Time taken " + (System.currentTimeMillis() - startTime) + "ms");
			}
		});

		vertx.eventBus().registerHandler(EventbusAddress.LevelUp.name(), new Handler<Message<JsonObject>>() {
			@Override
			public void handle(Message<JsonObject> message) {
				long startTime = System.currentTimeMillis();

				// TODO - Later
				//JsonObject body = message.body();
				container.logger().info("Time taken " + (System.currentTimeMillis() - startTime) + "ms");
			}
		});

	}

	@Override
	public void stop() {
		container.logger().info("LeaderBoardVerticle.stop()");
	}

	private SortedSet<JsonObject> getTopNPlayers() {
		long startTime = System.currentTimeMillis();
		container.logger().info("LeaderBoardVerticle.loadTopNPlayersIntoMemory");
		DB mongoDB = DatabaseManager.getInstance().getMongoDB();
		DBCollection collectionUsers = mongoDB.getCollection(MongoDBCollections.users.name());

		DBObject fields = new BasicDBObject();
		fields.put("_id", 0);
		fields.put("username", 1);
		fields.put("balance", 1);
		fields.put("usrImg", 1);

		DBCursor cursor = collectionUsers.find(new BasicDBObject(), fields).sort(new BasicDBObject("balance", -1))
				.limit(LEADER_BOARD_SIZE);

		SortedSet<JsonObject> leaderBoardSet = new TreeSet<JsonObject>(new LeaderBoardComparator());
		Map<String, JsonObject> leaderBoardMap = new HashMap<String, JsonObject>();

		while (cursor.hasNext()) {
			DBObject obj = cursor.next();
			@SuppressWarnings("unchecked")
			JsonObject resultMap = new JsonObject(obj.toMap());
			leaderBoardMap.put(obj.get("username").toString(), resultMap);
		}
		cursor.close();

		DBObject xpFields = new BasicDBObject();
		xpFields.put("currentLevel", 1);
		xpFields.put("username", 1);
		xpFields.put("_id", 0);

		DBObject query = new BasicDBObject();
		query.put("username", new BasicDBObject("$in", leaderBoardMap.keySet()));

		DBCollection collectionXP = mongoDB.getCollection(MongoDBCollections.xp.name());
		container.logger().info("query " + query);
		DBCursor cursor1 = collectionXP.find(query, xpFields);

		while (cursor1.hasNext()) {
			DBObject obj = cursor1.next();
			String username = obj.get("username").toString();
			JsonObject jsonObj = leaderBoardMap.get(username);
			jsonObj.putNumber("currentLevel", Double.parseDouble(obj.get("currentLevel").toString()));
			leaderBoardSet.add(jsonObj);
		}
		cursor1.close();

		container.logger().info("leaderBoardMap : " + leaderBoardMap);
		container.logger().info("Time taken " + (System.currentTimeMillis() - startTime) + "ms");

		return leaderBoardSet;
	}

	private class LeaderBoardComparator implements Comparator<JsonObject> {

		@Override
		public int compare(JsonObject o1, JsonObject o2) {
			double balance1 = o1.getNumber("balance").doubleValue();
			double balance2 = o2.getNumber("balance").doubleValue();

			return (int) (balance2 - balance1);
		}
	}
}
