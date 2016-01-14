set CLASSPATH=.
set CLASSPATH=%CLASSPATH%;lib/mongo-java-driver-2.11.4.jar;lib/gson-2.2.4.jar; lib/jsoup-1.6.2.jar; lib/log4j-1.2.17.jar; lib/slf4j-api-1.7.12.jar;lib/stripe-java-1.34.0.jar


vertx run Main.java -cp CLASSPATH

pause