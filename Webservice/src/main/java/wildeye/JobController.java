package wildeye;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Created by muhq on 28.04.16.
 */

@RestController
public class JobController {

    @Autowired
    JobRepository jobRepository;

    @Autowired
    CoordinateRepository coordinateRepository;

    @RequestMapping("/jobs")
    public List<Job> listJobs() {
        return jobRepository.findAll();
    }

    @RequestMapping(value = "/jobs", method = RequestMethod.POST)
    public ResponseEntity<?> add(@RequestBody Job inputJob)
    {
        Job newJob = new Job(inputJob.getName(), inputJob.getState());
        newJob.addCoordinates(inputJob.getCoordinates());
        Job result = jobRepository.save(newJob);


        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setLocation(
                ServletUriComponentsBuilder.fromCurrentRequest().path("/{jobId}")
                .buildAndExpand(result.getId()).toUri()
        );
        return new ResponseEntity<>(null, httpHeaders, HttpStatus.CREATED );
    }

    @RequestMapping(value = "/jobs/{jobId}", method = RequestMethod.GET)
    public ResponseEntity<Job> getJob(@PathVariable long jobId){
        Job job = this.jobRepository.findOne(jobId);

        HttpStatus statusCode = HttpStatus.OK;
        if (job == null)
        {
            statusCode = HttpStatus.NOT_FOUND;
        }

        return new ResponseEntity<Job>(job,null, statusCode);
    }

    @RequestMapping(value = "/jobs/{jobId}", method = RequestMethod.PUT)
    public ResponseEntity<Job> updateJob(@PathVariable long jobId, @RequestBody Job updateJob){
        Job currentJob = jobRepository.findOne(jobId);
        if(currentJob == null)
        {
            return new ResponseEntity<Job>(null,null,HttpStatus.NOT_FOUND);
        }
        currentJob.setName(updateJob.getName());
        currentJob.setState(updateJob.getState());
        currentJob.setCoordinates(updateJob.getCoordinates());

        jobRepository.save(currentJob);
        return new ResponseEntity<Job>(currentJob,HttpStatus.OK);
    }

    @RequestMapping(value = "/jobs/{jobId}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteJob(@PathVariable long jobId){
        Job deleteJob = this.jobRepository.findOne(jobId);
        if (deleteJob == null)
        {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        this.jobRepository.delete(deleteJob);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping("/jobs/createTestdata")
    public ResponseEntity<?> createTestdata(){
        Arrays.asList("first Job,second Job,third Job".split(","))
                .forEach(
                        j -> {
                            Job newJob = new Job(j, "new");
                            newJob.addCoordinate(new Coordinate(52.14326002286483,7.32712984085083));
                            newJob.addCoordinate(new Coordinate(52.14266744350718, 7.327977418899536));
                            newJob.addCoordinate(new Coordinate(3,3));
                            newJob.addCoordinate(new Coordinate(4,4));

                            jobRepository.save(newJob);
                        });
        return new ResponseEntity<>("{\"status\" : \"done\"}", null, HttpStatus.CREATED);
    }
}
