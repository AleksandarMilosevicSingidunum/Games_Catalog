package Final.GameCatalog.service;

import Final.GameCatalog.repository.PlatformRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PlatformService {

    private final PlatformRepository platformRepository;

    @Autowired
    public PlatformService(PlatformRepository platformRepository) {
        this.platformRepository = platformRepository;
    }

}
