package wildeye;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

/**
 * Created by Frenos on 27.04.2016.
 */
@Entity
public class Coordinate {

    private double lat = 0;
    private double lng = 0;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name="job_fk")
    private Job job;

    @Id
    @GeneratedValue
    @JsonIgnore
    private long id;

    public Coordinate(double latitude, double longitude)
    {
        this.lat = latitude;
        this.lng = longitude;
    }

    public Coordinate(){}

    public double getLat() {
        return lat;
    }

    public double getLng() {
        return lng;
    }

    public long getId()
    {
        return id;
    }

}
