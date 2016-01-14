
import org.vertx.java.core.AsyncResult;
import org.vertx.java.core.Handler;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.core.sockjs.EventBusBridgeHook;
import org.vertx.java.core.sockjs.SockJSSocket;

public class ServerHook implements EventBusBridgeHook {
    Logger logger;
    String UserMessage = null;

    public ServerHook(Logger logger) {
        this.logger = logger;
    }

    @Override
    public boolean handleSocketCreated(final SockJSSocket sock) {
        String origin = sock.headers().get("origin");
        //logger.info("Origin is " + origin);

        return true;
    }

    public void handleSocketClosed(SockJSSocket sock) {
        //logger.info("handleSocketClosed, sock = " + sock);
    }

    public boolean handleSendOrPub(SockJSSocket sock, boolean send, JsonObject msg, String address) { 
        //logger.info("handleSendOrPub, sock = " + sock + ", send = " + send + ", address = " + address);
        //logger.info(msg);
        return true;
    }

    public String MessageParser(){
        return UserMessage;
    }

    public boolean handlePreRegister(SockJSSocket sock, String address) {
        //logger.info("handlePreRegister, sock = " + sock + ", address = " + address);
        return true;
    }

    public void handlePostRegister(SockJSSocket sock, String address) {
        //logger.info("handlePostRegister, sock = " + sock + ", address = " + address);
    }

    public boolean handleUnregister(SockJSSocket sock, String address) {
        //logger.info("handleUnregister, sock = " + sock + ", address = " + address);
        return true;
    }

    @Override
    public boolean handleAuthorise(JsonObject message, String sessionID, Handler<AsyncResult<Boolean>> handler) {
        return false;
    }
}