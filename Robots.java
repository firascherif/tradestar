import java.util.List;
import java.util.ArrayList;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Map;
import java.util.Random;
import java.util.Scanner;
import org.vertx.java.core.json.JsonObject;

public class Robots {

List<Robot> robots = new ArrayList<Robot>();



Robot robot;
int index = 0;



public void populateRobotList() throws FileNotFoundException {
		String filePath = this.getClass().getClassLoader().getResource("Robot.txt").getPath();
		Scanner fileScanner = new Scanner(new File(filePath));
		while (fileScanner.hasNextLine()) {

			

			if(index % 2 == 0)
			{
			robot = new Robot();
				robot.setUsername(fileScanner.nextLine());
			}else{
				robot.setPassword(fileScanner.nextLine());
				robots.add(robot);
			}

			index++;
			
		}

		for(Robot robot : robots){
			//System.out.println("username : " +robot.getUsername() + "\n" + "password : " + robot.getPassword() );
		}

		fileScanner.close();
	}
public List<Robot> getRobots(){
    return robots;
}



}