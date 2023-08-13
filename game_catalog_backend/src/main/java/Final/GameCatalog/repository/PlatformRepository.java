package Final.GameCatalog.repository;

import Final.GameCatalog.model.Platform;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlatformRepository extends JpaRepository<Platform, Long> {
    // You can add custom query methods here if needed
}
