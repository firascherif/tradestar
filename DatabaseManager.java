
import java.net.UnknownHostException;
import java.util.Arrays;

import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;
import com.mongodb.WriteResult;

/**
 * Created by Andrew on 2014-12-18.
 */
public class DatabaseManager {

	private DB database;
	private MongoCredential credentials;
	private MongoClient mongoClient;
	private String username;
	private String databaseName;
	private char[] password;
	private String host;
	private int port;

	private volatile static DatabaseManager dbManager;

	private static final JsonObject dbConfig = new JsonObject().putString("address", "DBManager")
			// .putString("host", "127.4.104.130")
			.putString("host", "localhost").putNumber("port", 27017).putString("username", "admin")
			.putString("password", "biZgsFiD8sQR")
			// .putString("db_name", "tradestar");
			.putString("db_name", "TradeStar");

	//// .putString("password", "Fnc1rrkiN1Hm") .putString("host",
	// "127.11.186.130")

	public static DatabaseManager getInstance() {

		DatabaseManager result = dbManager;
		if (result == null) {
			synchronized (DatabaseManager.class) {
				result = dbManager;
				if (dbManager == null) {
					dbManager = result = new DatabaseManager(dbConfig);
				}
			}
		}
		return result;
	}

	public DB getMongoDB() {
		return this.database;
	}

	private DatabaseManager() {
	}

	private DatabaseManager(JsonObject config) {
		System.out.println("DatabaseManager.DatabaseManager()");

		String portDB = System.getenv("OPENSHIFT_MONGODB_DB_PORT");
		if (portDB == null)
			portDB = "27017";
		String host = System.getenv("OPENSHIFT_MONGODB_DB_HOST");
		if (host == null)
			host = "localhost";

		username = config.getString("username");
		databaseName = config.getString("db_name");
		password = config.getString("password").toCharArray();
		// host = config.getString("host");
		// port = config.getNumber("port").intValue();
		mongoClient = null;

		credentials = getMongoCredentials(username, databaseName, password);

		try {
			mongoClient = new MongoClient("localhost", 27017);

			// mongoClient = getMongoClient(host, portDB, credentials);
		} catch (UnknownHostException e) {
			e.printStackTrace();
		}

		database = mongoClient.getDB(databaseName);
		// if(database.getCollection("users").find(new
		// BasicDBObject()).size()==0)
		// createDatabase();

	}

	public void createDatabase() {
		// { "_id" : ObjectId("55061560d4c6907e4f316ee8"), "userName" : "bob",
		// "emailId" : //"bob@gmail.com", "password" : "123", "level" : 0,
		// "flagUrl" : "Canada", "userImg" : //"", "balance" : 50000, "streak" :
		// 0 }
		// }
		String hash = null;
		try {
			hash = PasswordHash.createHash("123".toCharArray());
		} catch (Exception exc) {
			exc.printStackTrace();
		}

		BasicDBObject doc = new BasicDBObject("username", "bob").append("emailId", "bob@gmail.com")
				.append("password", hash).append("level", "0").append("flagUrl", "Canada").append("balance", "50000")
				.append("userImg", "").append("streak", "0");
		// [{usr},{}]

		database.getCollection("users").insert(doc);
	}

	public JsonObject save(JsonObject params) {

		// {"collection":"colectionName","document",{"key":"value,"key":"value}}

		if (!params.containsField("collection")) {
			return new JsonObject().putString("status", "error").putString("message",
					"Please specify the collection name!");
		}

		String collectionName = params.getString("collection");

		if (!params.containsField("document")) {
			return new JsonObject().putString("status", "error").putString("message", "Please specify a document");
		}

		DBCollection collection = database.getCollection(collectionName);

		BasicDBObject dbObjectToSave = new BasicDBObject(params.getObject("document").toMap());

		WriteResult writeResult = collection.insert(dbObjectToSave);

		if (writeResult.getError() == null)
			return new JsonObject().putString("status", "ok");
		else
			return new JsonObject().putString("status", "error").putString("message", writeResult.getError());
	}

	public JsonObject find(JsonObject params) {

		System.out.println("DatabaseManager find");

		// {"collection":"colectionName","matcher",{"key":"value,"key":"value},
		// "keys", {"key":1,"key:1}}
		// find all documents whose fields match the ones in the matcher object
		// Return the fields specified by the keys object

		if (!params.containsField("collection")) {
			return new JsonObject().putString("status", "error").putString("message",
					"Please specify the collection name!");
		}

		String collectionName = params.getString("collection");

		if (!params.containsField("matcher")) {
			return new JsonObject().putString("status", "error").putString("message",
					"Please specify a matcher for the database query");
		}

		JsonObject matcher = params.getObject("matcher");

		DBCollection collection = database.getCollection(collectionName);

		DBCursor cursor;

		if (params.containsField("keys")) {
			JsonObject keys = params.getObject("keys");
			cursor = collection.find(new BasicDBObject(matcher.toMap()), new BasicDBObject(keys.toMap()));

		} else
			cursor = collection.find(new BasicDBObject(matcher.toMap()));
			System.out.println("cursors");
			 
			 
			  System.out.println(cursor);

      

		JsonArray results = new JsonArray();
		while (cursor.hasNext()) {
			DBObject obj = cursor.next();
			obj.removeField("_id");
			JsonObject m = new JsonObject(obj.toMap());
			results.add(m);
		}
		cursor.close();
		return new JsonObject().putString("status", "ok").putArray("results", results);
	}

	public JsonObject update(JsonObject params) {

		// {"collection":"colectionName","criteria",{"key":"value,"key":"value},
		// "objNew", {"$set":fields}}
		// Criteria specifies the documents to modify
		// objNew specifies the fields and new values to update the document
		// with

		if (!params.containsField("collection")) {
			return new JsonObject().putString("status", "error").putString("message",
					"Please specify the collection name!");
		}

		String collectionName = params.getString("collection");

		if (!params.containsField("objNew")) {
			return new JsonObject().putString("status", "error").putString("message",
					"Please provide the update object!");
		}

		JsonObject objNewJson = params.getObject("objNew");

		if (!params.containsField("criteria")) {
			return new JsonObject().putString("status", "error").putString("message",
					"Please specify the criteria object!");
		}

		JsonObject criteriaJson = params.getObject("criteria");

		DBCollection collection = database.getCollection(collectionName);

		BasicDBObject newObj = new BasicDBObject(objNewJson.toMap());
		BasicDBObject criteria = new BasicDBObject(criteriaJson.toMap());

		WriteResult writeResult = collection.update(criteria, newObj);
		if (writeResult.getError() == null)
			return new JsonObject().putString("status", "ok");
		else
			return new JsonObject().putString("status", "error").putString("message", writeResult.getError());
	}

	private MongoClient getMongoClient(String host, int port, MongoCredential credentials) throws UnknownHostException {
		return new MongoClient(new ServerAddress(host, port), Arrays.asList(credentials));
	}

	private MongoCredential getMongoCredentials(String username, String database, char[] password) {
		return MongoCredential.createMongoCRCredential(username, database, password);
	}
}
