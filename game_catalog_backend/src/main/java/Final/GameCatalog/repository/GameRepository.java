package Final.GameCatalog.repository;

import Final.GameCatalog.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    // You can add custom query methods here if needed
}
