package wildeye;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;

/**
 * Created by Frenos on 27.04.2016.
 */
@Entity
public class Job {

    @Id
    @GeneratedValue
    private long id;

    private String name;
    private String state;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name="job_fk")
    private List<Coordinate> coordinates = new ArrayList<>(4);

    public Job() {}
    public Job(String name, String state) {
        this.name = name;
        this.state = state;
        this.coordinates = new ArrayList<>(5);
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public List<Coordinate> getCoordinates() {
        return coordinates;
    }

    public void addCoordinate (Coordinate newCoordinate)
    {
        this.coordinates.add(newCoordinate);
    }

    public void addCoordinates (List<Coordinate> newCoordinates)
    {
        this.coordinates.addAll(newCoordinates);
    }

    public void setCoordinates(List<Coordinate> coordinates)
    {
        this.coordinates = coordinates;
    }
}
