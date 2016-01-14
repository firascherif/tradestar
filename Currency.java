public class Currency{

        
        private  float openingRate;
        private float presentRate;
        private String currencyPairName;
        
        public void setOpeningRate(float openingRate){
            this.openingRate = openingRate;
        }
        
        
        public void setPresentRate(float presentRate){
            this.presentRate = presentRate;
        }
        
        public float getOpeningRate(){
            return openingRate;
        
        }
        
         public float getPresentRate(){
            return presentRate;
        
        }
    
        public String getCurrencyName(){
            return currencyPairName;
            
        }
        
        public Currency(String currencyPairName, float openingRate, float presentRate ){
        
            this.currencyPairName = currencyPairName;
            this.openingRate = openingRate;
            this.presentRate = presentRate;
        }
        
        public Currency(String currencyPairName){
        
            this.currencyPairName = currencyPairName;
            
        }
        
        public float getPercentage(){
        
           float percentage = (presentRate - openingRate) / openingRate * 100;
            
             
            return percentage;
        
        }
        
        




}