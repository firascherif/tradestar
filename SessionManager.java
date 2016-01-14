
import org.vertx.java.core.Handler;
import org.vertx.java.core.Vertx;
import org.vertx.java.core.json.JsonObject;

import javax.xml.bind.util.JAXBSource;
import java.util.Map;
import java.util.UUID;

/**
 * Created by Andrew on 2014-12-19.
 */
public class SessionManager {

	Map<String, String> sessions;
	Vertx vertxInstance;
	int timeout;

	public SessionManager(Vertx vertx) {
		System.out.println("SessionManager.SessionManager()");
		vertxInstance = vertx;
		sessions = vertx.sharedData().getMap("sessions");
	timeout = 4000 * 60 * 1000;

	//log out after 32hr//
	}

	public JsonObject startSession(String username) {
		System.out.println("SessionManager.startSession()");
		String sessionID = getSessionIDwithUsername(username);
		String newID;
		if (sessionID != null) {
			newID = extendSession(sessionID);
			return new JsonObject().putString("status", "ok").putString("sessionID", newID);
		} else {
			newID = createSession(username);
			return new JsonObject().putString("status", "ok").putString("sessionID", newID);
		}
	}

	public void destroySession(String sessionID) {
		System.out.println("SessionManager.destroySession()");
		JsonObject session = new JsonObject(sessions.get(sessionID));
		vertxInstance.cancelTimer(session.getLong("timerID"));
		System.out.println("Destroying session");
		sessions.remove(sessionID);
		printSessions();
	}

	private String createSession(String username) {

		String sessionID = generateSessionID();

		long timerID = vertxInstance.setTimer(timeout, new Handler<Long>() {
			public void handle(Long timerID) {
				String sID = getSessionTimerID(timerID);
				sessions.remove(sID);
			}
		});

		JsonObject session = new JsonObject().putString("username", username).putNumber("timerID", timerID);
		sessions.put(sessionID, session.toString());

		printSessions();

		return sessionID;
	}

	public String extendSession(String sessionID) {
		JsonObject session = new JsonObject(sessions.get(sessionID));
		destroySession(sessionID);
		return createSession(session.getString("username"));
	}

	public void heartBeat(String sessionID) {
		JsonObject session = new JsonObject(sessions.get(sessionID));
		vertxInstance.cancelTimer(session.getLong("timerID"));
		session.removeField("timerID");

		long timerID = vertxInstance.setTimer(timeout, new Handler<Long>() {
			public void handle(Long timerID) {
				String sID = getSessionTimerID(timerID);
				sessions.remove(sID);
			}
		});

		session.putNumber("timerID", timerID);
		sessions.put(sessionID, session.toString());

	}

	private String getSessionIDwithUsername(String username) {
		for (String key : sessions.keySet()) {
			JsonObject sessionAsJson = new JsonObject(sessions.get(key));
			if (sessionAsJson.getString("username").equals(username)) {
				return key;
			}
		}
		return null;
	}

	private String getSessionTimerID(long timerID) {
		for (String key : sessions.keySet()) {
			JsonObject sessionAsJson = new JsonObject(sessions.get(key));
			if (sessionAsJson.getLong("timerID") == timerID) {
				return key;
			}
		}
		return null;
	}

	private String generateSessionID() {
		return UUID.randomUUID().toString();
	}

	private void printSessions() {
		for (String key : sessions.keySet()) {
			System.out.println(key + ": " + sessions.get(key));
		}
	}

}