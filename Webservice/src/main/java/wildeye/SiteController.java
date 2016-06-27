package wildeye;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by Frenos on 24.05.2016.
 */
@Controller
public class SiteController {

    @RequestMapping("/")
    public String mainSite(){
        return "index";
    }

    @RequestMapping("/joblist")
    public String joblistSite(){
        return "joblist";
    }

    @RequestMapping("/newjob")
    public String newJobSite(){
        return "newjob";
    }
}
