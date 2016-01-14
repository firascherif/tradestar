public class Robot{
	private String username;
	private String password;

	public Robot(String username, String password){
		this.username = username;
		this.password = password;
	}


	public Robot(){
	 
	}

	public String getUsername(){
		return username;
	}

	public void setUsername(String username){
		this.username = username;
	}

	public String getPassword(){
		return password;
	}

	public void setPassword(String password){
		this.password = password;
	}

}