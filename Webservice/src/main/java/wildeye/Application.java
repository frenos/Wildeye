package wildeye;

/**
 * Created by Frenos on 27.04.2016.
 */

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Arrays;

@SpringBootApplication
public class Application {

    /*@Bean
    CommandLineRunner init(JobRepository jobRepository, CoordinateRepository coordinateRepository){
        return (evt) ->
    }*/

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}