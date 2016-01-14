

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.Map;
import java.util.Set;

import javax.imageio.ImageIO;

import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.EventBus;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.file.FileSystemException;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.platform.Verticle;

import sun.misc.BASE64Decoder;

public class Authenticator extends Verticle {

	EventBus eb;
	JsonObject userAuthenticateResult;
	JsonObject userRegisterResult;
	JsonObject userUpdateResult;
	BASE64Decoder decoder;
	DatabaseManager dbManager;
	PasswordHash passwordHash;
	SessionManager sessionManager;
	Map<String, String> sessions;

	Object sync;

	boolean foundUsername;
	boolean foundEmail;

	public void start() {

		sessions = vertx.sharedData().getMap("sessions");

		dbManager = DatabaseManager.getInstance();

		sessionManager = new SessionManager(vertx);

		eb = vertx.eventBus();
		decoder = new BASE64Decoder();

		System.out.println("authenticator online");

		Handler<Message<JsonObject>> authenticator = new Handler<Message<JsonObject>>() {
			public void handle(Message<JsonObject> message) {
				JsonObject request = message.body();
				String action = request.getString("action");

				container.logger().info("Inside authenticator handler with " + request.encodePrettily());

				if (action.equals("authenticate")) {
					System.out.println("authenticator.handle with action authenticate");
					if (validAuthenticateUserRequest(request)) {
						try {
							message.reply(authenticate(request));
						} catch (InvalidKeySpecException e) {
							e.printStackTrace();
						} catch (NoSuchAlgorithmException e) {
							e.printStackTrace();
						}
					} else
						message.reply(new JsonObject().putString("status", "error").putString("message",
								"Invalid authenticate user request"));
				} else if (action.equals("register")) {
					if (validRegisterUserRequest(request)) {
						try {
							message.reply(register(request));
						} catch (InvalidKeySpecException e) {
							e.printStackTrace();
						} catch (NoSuchAlgorithmException e) {
							e.printStackTrace();
						}
					} else
						message.reply(new JsonObject().putString("status", "error").putString("message",
								"Invalid register user request"));
				} else if (action.equals("update")) {
					if (validUpdateUserRequest(request)) {
							message.reply(update(request));
							
					} else
						message.reply(new JsonObject().putString("status", "error").putString("message",
								"Invalid update user request"));
						

				}else if (action.equals("updateImage")) {
					if (validUpdateImageRequest(request)) {
							message.reply(updateImage(request));
							
					} else
						message.reply(new JsonObject().putString("status", "error").putString("message",
								"Invalid update user request"));
						

				}else if (action.equals("change_password")) {
					if (validChangePasswordRequest(request)) {
						try {
							message.reply(changePassword(request));
						} catch (InvalidKeySpecException e) {
							e.printStackTrace();
						} catch (NoSuchAlgorithmException e) {
							e.printStackTrace();
						}
					} else
						message.reply(new JsonObject().putString("status", "error").putString("message",
								"Invalid change password request"));
				} else if (action.equals("resume")) {
					if (validResumeSessionRequest(request)) {
						message.reply(resume(request));
					} else
						message.reply(new JsonObject().putString("status", "error").putString("message",
								"Invalid resume session request"));
				} else
					message.reply(new JsonObject().putString("status", "error").putString("message",
							"Invalid Authenticator action"));
			}
		};

		eb.registerHandler("Authenticator", authenticator);

		eb.send("HandlerRegistred",new JsonObject().putString("Verticle","Authenticator"));
	}

	public boolean validAuthenticateUserRequest(JsonObject authenticateUserRequest) {
		// More validation code in the future?
		if (authenticateUserRequest.containsField("username") && authenticateUserRequest.containsField("password")) {
			if (authenticateUserRequest.getString("username").trim().equals("")
					|| authenticateUserRequest.getString("password").trim().equals(""))
				return false;
			return true;
		} else
			return false;
	}

	public boolean authenticate2(String username, String password) throws InvalidKeySpecException, NoSuchAlgorithmException {

		

		JsonArray results = new JsonArray();
		JsonObject userAuthenticateRequest = new JsonObject();
		

		userAuthenticateRequest.putString("collection", "users")
				.putObject("keys", new JsonObject().putNumber("password", 1))
				.putObject("matcher", new JsonObject().putString("username", username));

		results = dbManager.find(userAuthenticateRequest).getArray("results");

		if (results.size() <= 0) {
			return false;
		}

		String hashedPassword = ((JsonObject) results.get(0)).getString("password");

		if (!passwordHash.validatePassword(password, hashedPassword)) {
			return false;

		} else {
			return true;
		}
	}

	public JsonObject authenticate(JsonObject user) throws InvalidKeySpecException, NoSuchAlgorithmException {
		System.out.println("Authenticator.authenticate() for user " + user.encodePrettily());

		JsonArray results = new JsonArray();
		JsonObject userAuthenticateRequest = new JsonObject();
		String username = user.getString("username").trim();
		String password = user.getString("password").trim();

		userAuthenticateRequest.putString("collection", "users")
				.putObject("keys", new JsonObject().putNumber("password", 1))
				.putObject("matcher", new JsonObject().putString("username", username));

		results = dbManager.find(userAuthenticateRequest).getArray("results");

		if (results.size() <= 0) {
			return new JsonObject().putString("status", "error").putString("message", "Invalid username or password");
		}

		String hashedPassword = ((JsonObject) results.get(0)).getString("password");

		if (!passwordHash.validatePassword(password, hashedPassword)) {
			return new JsonObject().putString("status", "error").putString("message", "Invalid username or password");

		} else {
			JsonObject newSession = sessionManager.startSession(username);
			System.out.println("newSession " + newSession);
			if (newSession.getString("status").equals("ok")) {

				JsonObject playerDataReq = new JsonObject().putString("collection", "users").putObject("matcher",
						new JsonObject().putString("username", username));

				JsonArray playerData = dbManager.find(playerDataReq).getArray("results");

				JsonObject playerDataAsJsonObject = playerData.get(0);
				System.out.println("DB RESULT: " + playerDataAsJsonObject.toString());

				eb.send("ConnectPlayer",
						playerDataAsJsonObject.putString("sessionID", newSession.getString("sessionID")));

				Map<String, Object> playerInfo = playerDataAsJsonObject.toMap();

				Set<String> playerInfoKeys = playerInfo.keySet();

				for (String string : playerInfoKeys) {
					newSession.putString(string, playerInfo.get(string).toString());
				}

				System.out.println(
						"newSession after populating the values from playerInfo " + newSession.encodePrettily());
				return newSession;
			} else {
				return new JsonObject().putString("status", "error");
			}

		}
	}

	public boolean validRegisterUserRequest(JsonObject registerUserRequest) {
		// More validation code in the future?
		if (registerUserRequest.containsField("username") && registerUserRequest.containsField("password")
				&& registerUserRequest.containsField("email") && registerUserRequest.containsField("imgData")) {
			if (registerUserRequest.getString("username").trim().equals("")
					|| registerUserRequest.getString("password").trim().equals("")
					|| registerUserRequest.getString("email").trim().equals("")
					|| registerUserRequest.getString("imgData").trim().equals(""))
				return false;
			return true;
		} else
			return false;
	}

    
    public boolean validUpdateImageRequest(JsonObject registerUserRequest) {
		
		if (registerUserRequest.containsField("dataImage"))
		{
			if (registerUserRequest.getString("dataImage").trim().equals(""))
				return false;
			return true;
		} else
			return false;
	}

	public boolean validChangePasswordRequest(JsonObject registerUserRequest) {
		// More validation code in the future?

		container.logger().info(" Method : validChangePasswordRequest ");
		container.logger().info("registerUserRequest " + registerUserRequest);
		if (registerUserRequest.containsField("oldpassword") && registerUserRequest.containsField("newpassword"))
		{
			if (registerUserRequest.getString("oldpassword").trim().equals("")
					|| registerUserRequest.getString("newpassword").trim().equals("")
			   )
				return false;
			return true;
		} else
			return false;
	}

	private JsonObject register(JsonObject user) throws InvalidKeySpecException, NoSuchAlgorithmException {
		JsonArray results;
		String username = user.getString("username");
		String password = user.getString("password");
		password = passwordHash.createHash(password);
		String email = user.getString("email");
		String flagUrl = "";
		double level = 0;
		double balance = 50000;
		double streak = 0;
		String usrImg = "assets/images/users/" + username + "/profile_pic.png";
		String imgData = user.getString("imgData");

		JsonObject usernameQuery = new JsonObject().putString("collection", "users")
				.putObject("keys", new JsonObject().putNumber("username", 1))
				.putObject("matcher", new JsonObject().putString("username", username));

		results = dbManager.find(usernameQuery).getArray("results");

		if (results.size() > 0)
			return new JsonObject().putString("status", "error").putString("message",
					"An account was already registered with that username");

		JsonObject emailQuery = new JsonObject().putString("collection", "users")
				.putObject("keys", new JsonObject().putNumber("email", 1))
				.putObject("matcher", new JsonObject().putString("email", email));

		results = dbManager.find(emailQuery).getArray("results");

		if (results.size() > 0)
			return new JsonObject().putString("status", "error").putString("message",
					"An account was already registered with that email");

		JsonObject newUser = new JsonObject().putString("username", username).putString("password", password)
				.putString("email", email).putString("flagUrl", flagUrl).putString("usrImg", usrImg)
				.putNumber("balance", balance).putNumber("streak", streak).putNumber("numStars", 0)
				.putNumber("level", level).putNumber("chipRegenID", -1);

		JsonObject userRegisterRequest = new JsonObject().putString("collection", "users").putObject("document",
				newUser);

		JsonObject result = dbManager.save(userRegisterRequest);

		if (result.getString("status").equals("ok")) {
			createUserDirectory(username);
			saveUserImage(username, imgData);
			eb.send("NewPlayer", newUser);

			/*
			 * TODO: CHIP REGENERATION long chipRegenerator =
			 * vertx.setPeriodic(10000, new Handler<Long>() { public void
			 * handle(Long timerID) {
			 * 
			 * JsonObject getUsername = new JsonObject();
			 * 
			 * getUsername.putString("collection", "users") .putObject("keys",
			 * new JsonObject().putNumber("username", 1)) .putObject("matcher",
			 * new JsonObject().putNumber("chipRegenID", timerID));
			 * 
			 * JsonArray results =
			 * dbManager.find(getUsername).getArray("results");
			 * 
			 * String username =
			 * ((JsonObject)results.get(0)).getString("username");
			 * 
			 * System.out.println(username);
			 * 
			 * JsonObject getBalance = new JsonObject();
			 * 
			 * getBalance.putString("collection", "users") .putObject("keys",
			 * new JsonObject().putNumber("balance", 1)) .putObject("matcher",
			 * new JsonObject().putString("username", username));
			 * 
			 * results = dbManager.find(getBalance).getArray("results");
			 * 
			 * double balance =
			 * ((JsonObject)results.get(0)).getNumber("balance").doubleValue();
			 * 
			 * System.out.println(balance);
			 * 
			 * update(new JsonObject().putString("username",
			 * username).putObject("fields", new
			 * JsonObject().putNumber("balance", balance + 2000)));
			 * 
			 * 
			 * } });
			 * 
			 * update(new JsonObject().putString("username",
			 * username).putObject("fields", new
			 * JsonObject().putNumber("chipRegenID", chipRegenerator)));
			 */

			return new JsonObject().putString("status", "ok");
		} else
			return new JsonObject().putString("status", "error").putString("message", "Something went wrong");
	}

	public boolean validUpdateUserRequest(JsonObject updateUserRequest) {
		
		if (updateUserRequest.containsField("username") && updateUserRequest.containsField("email"))
		{
			if ((updateUserRequest.getString("username") == null || updateUserRequest.getString("username").trim().equals(""))
					&& (updateUserRequest.getString("email") == null || updateUserRequest.getString("email").trim().equals(""))
			   )
				return false;
			return true;
		} else
			return false;

	}

	public JsonObject update(JsonObject updateUserRequest) {
		String username;
		String oldUser = updateUserRequest.getString("oldUser");
		String email; 
		String oldMail = updateUserRequest.getString("oldMail");
       
        JsonArray resultsUser = new JsonArray();
        JsonArray resultsMail = new JsonArray();
        if(resultsUser!=null) container.logger().info("pas nul");
         if(resultsMail!=null) container.logger().info("pas nul");
		JsonObject userAuthenticateUsernameRequest = new JsonObject();
		JsonObject userAuthenticateEmailRequest = new JsonObject();
        
      
        

        if(updateUserRequest.getString("username") == null || updateUserRequest.getString("username").trim().equals(""))
        {
        	username = oldUser;
        	 
        }
        else
        {
        	username = updateUserRequest.getString("username").trim();
        	userAuthenticateUsernameRequest.putString("collection", "users")
				.putObject("keys", new JsonObject().putNumber("username", 1))
				.putObject("matcher", new JsonObject().putString("username", username));

			resultsUser = dbManager.find(userAuthenticateUsernameRequest).getArray("results");
      
      

        }

        if(updateUserRequest.getString("email") == null || updateUserRequest.getString("email").trim().equals(""))
        {
        	email = oldMail;
        }else{

        	email = updateUserRequest.getString("email").trim();
        	userAuthenticateEmailRequest.putString("collection", "users")
				.putObject("keys", new JsonObject().putNumber("username", 1))
				.putObject("matcher", new JsonObject().putString("email", email));

			resultsMail = dbManager.find(userAuthenticateEmailRequest).getArray("results");
 
       

        }
        
       
	
        String usrImg = "assets/images/users/" + username + "/profile_pic.png";
        File dossierOldUser = new File("webroot/assets/images/users/" + oldUser);
        File dossierNewUser = new File("webroot/assets/images/users/" + username);
		JsonObject fields = new JsonObject().putString("username", username).putString("email", email).putString("usrImg",usrImg);
		 if(resultsUser!=null) 
		 	container.logger().info("pas nul");

		 else  container.logger().info("nul");
         if(resultsMail!=null)
          container.logger().info("pas nul");
          else     container.logger().info(" nul");
		
		
		if (resultsUser.size() <= 0 && resultsMail.size() <= 0) {
            
			JsonObject updateRequest = new JsonObject().putString("collection", "users")
				.putObject("criteria", new JsonObject().putString("username", oldUser))
				.putObject("objNew", new JsonObject().putObject("$set", fields));

		JsonObject result = dbManager.update(updateRequest);
            
            
            if (result.getString("status").equals("ok")) {
                dossierOldUser.renameTo(dossierNewUser);

               /* JsonObject playerDataReq = new JsonObject().putString("collection", "users").putObject("matcher",
                        new JsonObject().putString("username", username));

                JsonArray playerData = dbManager.find(playerDataReq).getArray("results");

                JsonObject playerDataAsJsonObject = playerData.get(0);*/
                JsonObject changedValuesPlayer  = new JsonObject();
                changedValuesPlayer.putString("oldUserName", oldUser).putString("newUserName", username).putString("newEmail", email);
             
                //eb.publish(EventbusAddress.PlayerUpdates.name(), playerDataAsJsonObject);
                eb.send("ChangePlayer", changedValuesPlayer);
                
               // container.logger().info("EventbusAddress.PlayerUpdates.name() " + EventbusAddress.PlayerUpdates.name());
               // return result;
                return new JsonObject().putString("status", "ok").putString("message","You have made your changes").putString("username",username).putString("email", email);


            }else{
                return new JsonObject().putString("status", "error").putString("message", "Something went wrong");

		    }
		}else{
            return new JsonObject().putString("status", "error").putString("message", "That username or email already exists");
        }
	}
    
    
    public JsonObject updateImage(JsonObject changeImageRequest)
    { 
        String username = changeImageRequest.getString("username").trim();
        String dataImage = changeImageRequest.getString("dataImage").trim();
        String sessionID = changeImageRequest.getString("sessionID").trim();
        
        JsonObject changeImg = new JsonObject();
        changeImg.putString("username", username).putString("dataImage", dataImage).putString("sessionID", sessionID);
        
         eb.send("ChangeImage", changeImg);
       
        if(saveUserImage(username, dataImage))
        {
             return new JsonObject().putString("status", "ok").putString("message","You have made your changes");
        }else{
             return new JsonObject().putString("status", "error").putString("message", "Something went wrong");
        }
           

    }

	public JsonObject changePassword(JsonObject changePasswordRequest)throws InvalidKeySpecException, NoSuchAlgorithmException{

		container.logger().info("changePasswordRequest " + changePasswordRequest.encodePrettily());
		
		String username = changePasswordRequest.getString("user").trim();
		String oldpassword = changePasswordRequest.getString("oldpassword").trim();
		String newpassword = changePasswordRequest.getString("newpassword").trim();
		newpassword = passwordHash.createHash(newpassword);
		

		boolean passwordExist = authenticate2(username, oldpassword);


		
		JsonObject fields = new JsonObject().putString("username", username).putString("password", newpassword);
		
	
		
			if (passwordExist){
				container.logger().info("password existe " + passwordExist);
			JsonObject updateRequest = new JsonObject().putString("collection", "users")
				.putObject("criteria", new JsonObject().putString("username", username))
				.putObject("objNew", new JsonObject().putObject("$set", fields));
			JsonObject result = dbManager.update(updateRequest);

			container.logger().info("result " + result.encodePrettily());

				if (result.getString("status").equals("ok")) {
	
					return new JsonObject().putString("status", "ok").putString("message","You have changed your password");
				} else
					return new JsonObject().putString("status", "error").putString("message", "Something went wrong");
			} else
				return new JsonObject().putString("status", "error").putString("message",
						"Check your old password");
		
	}
			

	public boolean validResumeSessionRequest(JsonObject resumeSessionRequest) {
		// More validation code in the future?
		if (resumeSessionRequest.containsField("sessionID")) {
			return true;
		} else
			return false;
	}

	public JsonObject resume(JsonObject updateUserRequest) {

		String sessionID = updateUserRequest.getString("sessionID");
		if (sessions.get(sessionID) != null) {
			container.logger().info("user details for the session id " + sessions.get(sessionID));
			JsonObject json = new JsonObject(sessions.get(sessionID));

			return json.putString("status", "ok");
		}
		return new JsonObject().putString("status", "error").putString("message", "Not a valid session id");
	}

	public boolean saveUserImage(String username, String imgData) {
		String path = "./webroot/assets/images/users/" + username;
		// String path = "/webroot/assets/images/users/" + username;

		String cadena = System.getProperty("user.dir");
		System.out.println("\r\n*************Dosier d'utilisateur:" + cadena + "\r\n");
		// String path = cadena+"/webroot/assets/images/users/" + username;
		
		try {
			byte[] imageByte = new byte[65530];
			int posVirgule, posChaine;// On asume le format suivant:
										// "data:img/AAA;base64,DDDD"
			int posPointVirgule; // au AAA est le type de fichier er DDDD les
									// données.
			String chaine = "data:image/";
			String typeDeFichier;
			posVirgule = imgData.indexOf(',');
			posPointVirgule = imgData.indexOf(';');
			posChaine = imgData.indexOf(chaine);
			String extentionDeFichier = new String("png");
			if (posVirgule < 0 || posPointVirgule < 0 || posChaine < 0 || posChaine > posVirgule
					|| posPointVirgule > posVirgule) {
				System.out.println("---SYSTEM: boutisse manquant. On assume type PNG.\r\n");
				System.out.println(">>> " + imgData.subSequence(0, 50) + " <<<\r\n");
				typeDeFichier = new String("png");
				extentionDeFichier = new String("png");
				imageByte = decoder.decodeBuffer(imgData);
			} else {
				typeDeFichier = imgData.substring(posChaine + chaine.length(), posPointVirgule);
				extentionDeFichier = new String(typeDeFichier);
				if (extentionDeFichier.compareToIgnoreCase("png") == 0 && extentionDeFichier.compareTo("png") != 0)
					extentionDeFichier = new String("png");
				System.out.println("+-+-SYSTEM: image reçu (Deplacement aprés de la boutisse): "
						+ imgData.substring(posVirgule + 1));
				imageByte = decoder.decodeBuffer(imgData.substring(posVirgule + 1));
			}
			FileOutputStream file = new FileOutputStream(path + "/profile_pic." + extentionDeFichier);
			file.write(imageByte);
			file.close();
			if (typeDeFichier.compareToIgnoreCase("png") == 0) {

			} else {
				File file2 = new File(path + "/profile_pic." + extentionDeFichier);
				File file3 = new File(path + "/profile_pic.png");
				BufferedImage bufImage = ImageIO.read(file2);
				ImageIO.write(bufImage, extentionDeFichier, file3);
			}
			System.out.println("+++SYSTEM: Creation satisfactoire de image de utilisateur : " + path + "\r\n");
			return true;
		} catch (Exception e) {
			System.out.println(
					"***SYSTEM: Pas possible Creer image de utilizateur: " + path + "\r\n" + e.getMessage() + "\r\n");
			return false;
		}
	}

	public boolean createUserDirectory(String userName) {
		boolean success = false;
		try {
				success = (new File("webroot/assets/images/users/" + userName)).mkdirs();
			
		} catch (FileSystemException e) {
			System.out.println("error: " + e.getMessage());
			
		}
		return success;
	}
}
