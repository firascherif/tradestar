
import org.vertx.java.platform.Verticle;

/**
 * @author dharani kumar p(dharani.kumar@gmail.com)
 *
 */
public class XPPointsCalculatorVerticle extends Verticle {

	@Override
	public void start() {
		container.logger().info("XPPointsCalculatorVerticle.start()");
		vertx.eventBus().registerHandler(XPEventHandlersAddress.CalculateXP.name(), new XPCalculatorHandler(this));
	}

	@Override
	public void stop() {
		container.logger().info("XPPointsCalculatorVerticle.stop()");
	}
}
