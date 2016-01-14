
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.platform.Verticle;

/**
 * This verticle handles experience points and levels of a player.
 * 
 * @author dharani kumar p (dharani.kumar@gmail.com)
 *
 */
public class XPVerticle extends Verticle {

	@Override
	public void start() {
		container.logger().info("XPVerticle.start()");

		// vertx.sharedData().getMap("xpConfig").put("xpConfig",
		// config.toJson());

		EventBus eb = vertx.eventBus();

		eb.registerHandler(XPEventHandlersAddress.GetPlayerXP.name(), new GetPlayerXPHandler(this));
		eb.registerHandler(XPEventHandlersAddress.CreatePlayerXP.name(), new XPCreatePlayerHandler(this));
		eb.registerHandler(XPEventHandlersAddress.GameCompleted.name(), new XPGameCompleteHandler(this));
		eb.registerHandler(XPEventHandlersAddress.UpdateXPDB.name(), new XPDBUpdateHandler(this));
	}

	@Override
	public void stop() {
		container.logger().info("XPVerticle.stop()");
	}
}
