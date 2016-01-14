
import java.util.Random;

public class CurrencyTypes {
	
    private float openingRate;
    private float currentRate;
    private float variance;
    private String currencyName;
    private boolean trendDirection;
    private int trendLimit;

    public CurrencyTypes (float openingRate, String currencyName, float variance) {
        this.openingRate = openingRate;
        this.currentRate = openingRate;
        this.currencyName = currencyName;
        this.variance = variance;
        this.trendDirection = new Random().nextBoolean();
        this.trendLimit = 500;
    }

    public float getOpeningRate() {
        return openingRate;
    }

    public float getCurrentRate() {
        return currentRate;
    }

    public String getName() {
        return currencyName;
    }

    public void updateCurrency () {
        float result = ((0-variance)*(float)Math.random()) + variance;
        boolean stall = generateRandomBoolean();
        boolean setBigTrendLimit = generateRandomBoolean();

        if(!stall) {
            if(trendDirection) currentRate += result;
            else currentRate -= result;
            
            trendLimit -= new Random().nextInt(750);	
        }

        if(trendLimit < 0) {
            trendDirection = !trendDirection;
            if(!setBigTrendLimit) trendLimit = 500;
            else trendLimit=1000;
        }	
    }

    private boolean generateRandomBoolean() {
        return new Random().nextBoolean();
    }
}