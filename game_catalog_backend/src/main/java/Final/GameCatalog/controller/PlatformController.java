package Final.GameCatalog.controller;

import Final.GameCatalog.exception.PlatformNotFoundException;
import Final.GameCatalog.model.Platform;
import Final.GameCatalog.repository.PlatformRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
public class PlatformController {

    @Autowired
    private PlatformRepository platformRepository;

    @PostMapping("/platform")
    Platform createPlatform(@RequestBody Platform newPlatform) {
        return platformRepository.save(newPlatform);
    }

    @GetMapping("/platforms")
    List<Platform> getAllPlatforms() {
        return platformRepository.findAll();
    }

    @GetMapping("/platform/{id}")
    Platform getPlatformById(@PathVariable Long id) {
        return platformRepository.findById(id)
                .orElseThrow(() -> new PlatformNotFoundException(id));
    }

    @PutMapping("/platform/{id}")
    Platform updatePlatform(@RequestBody Platform updatedPlatform, @PathVariable Long id) {
        return platformRepository.findById(id).map(platform -> {
            platform.setName(updatedPlatform.getName());
            // Update other attributes as needed
            return platformRepository.save(platform);
        }).orElseThrow(() -> new PlatformNotFoundException(id));
    }

    @DeleteMapping("/platform/{id}")
    void deletePlatform(@PathVariable Long id) {
        platformRepository.deleteById(id);
    }
}
