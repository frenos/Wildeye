package wildeye;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by muhq on 28.04.16.
 */
@Repository
public interface CoordinateRepository extends JpaRepository<Coordinate, Long> {
}
