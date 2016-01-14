

import java.text.DecimalFormat;
import java.util.Random;
import java.text.FieldPosition;
import java.text.NumberFormat;
import java.util.Locale;

import org.vertx.java.core.json.JsonObject;

import com.evtech.tradestar.Authenticator;

/**
 * This class stores the information for rendering OHLC and Candlesticks
 * 
 * @author dharani kumar p(dharani.kumar@gmail.com)
 *
 */
public class OHLCData implements Comparable {

	private String currencyPair;
	private long timeStamp;

	private double bidFigure;
	private double bidPoints;
	private double offerFigure;
	private int offerPoints;

	private double open;
	private double high;
	private double low;
	private double close;

	public OHLCData(String currencyPair, long timeStamp, String bidFigure, String bidPoints, double offerFigure,
			int offerPoints, double high, double open, double low) {
		
		this.timeStamp = timeStamp;
		this.currencyPair = currencyPair;
		this.bidFigure = Double.parseDouble(bidFigure);
		this.bidPoints = Double.parseDouble(bidPoints);
		this.offerFigure = offerFigure;
		this.offerPoints = offerPoints;
		this.open = open;
		this.high = high;
		this.low = low;

		String str = "" + bidFigure + "" + bidPoints;
	//	System.out.println(str);
		Random r = new Random();
		double randomValue = 0.001 + (0.001 - 0.0001) * r.nextDouble();
		//DecimalFormat df = new DecimalFormat("##.#####"); 


		NumberFormat nf = NumberFormat.getNumberInstance(Locale.CANADA);

DecimalFormat df = (DecimalFormat)nf;
 df.setMaximumFractionDigits(5);
StringBuffer result = new StringBuffer();

//NumberFormat nf = NumberFormat.getInstance();
df.format((Double.parseDouble(str) + randomValue),result,new FieldPosition(NumberFormat.INTEGER_FIELD));
		this.close = Double.parseDouble( df.format(Double.parseDouble(str) + randomValue));
	//	this.close =  Double.parseDouble(str) + randomValue;

	}

	public long getTimeStamp() {
		return timeStamp;
	}

	public String getCurrencyPair() {
		return currencyPair;
	}

	public double getBidFigure() {
		return bidFigure;
	}

	public double getBidPoints() {
		return bidPoints;
	}

	public double getOfferFigure() {
		return offerFigure;
	}

	public int getOfferPoints() {
		return offerPoints;
	}

	public double getOpen() {
		return open;
	}

	public double getHigh() {
		return high;
	}

	public double getLow() {
		return low;
	}

	public double getClose() {
		return close;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("OHLCData [timeStamp=");
		builder.append(timeStamp);
		builder.append(", currencyPair=");
		builder.append(currencyPair);
		builder.append(", bidFigure=");
		builder.append(bidFigure);
		builder.append(", bidPoints=");
		builder.append(bidPoints);
		builder.append(", offerFigure=");
		builder.append(offerFigure);
		builder.append(", offerPoints=");
		builder.append(offerPoints);
		builder.append(", open=");
		builder.append(open);
		builder.append(", high=");
		builder.append(high);
		builder.append(", low=");
		builder.append(low);
		builder.append(", close=");
		builder.append(close);
		builder.append("]");
		return builder.toString();
	}

	public JsonObject toJson() {
		JsonObject obj = new JsonObject();

		obj.putString("currencyPair", getCurrencyPair());
		obj.putNumber("timeStamp", getTimeStamp());
		obj.putNumber("open", getOpen());
		obj.putNumber("high", getHigh());
		obj.putNumber("low", getLow());
		obj.putNumber("close", getClose());

		obj.putNumber("bigFigure", getBidFigure());
		obj.putNumber("bidPoints", getBidPoints());
		obj.putNumber("offerFigure", getOfferFigure());
		obj.putNumber("offerPOints", getOfferPoints());

		return obj;
	}

	/**
	 * Compares the objects based upon the timeStamp
	 * 
	 * @see java.lang.Comparable#compareTo(java.lang.Object)
	 */
	@Override
	public int compareTo(Object arg) {
		OHLCData other = (OHLCData) arg;
		return (int) (this.timeStamp - other.timeStamp);
	}
}
