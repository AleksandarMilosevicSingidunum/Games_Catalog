package Final.GameCatalog.controller;

import Final.GameCatalog.exception.DeveloperNotFoundException;
import Final.GameCatalog.model.Developer;
import Final.GameCatalog.repository.DeveloperRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
public class DeveloperController {

    @Autowired
    private DeveloperRepository developerRepository;

    @PostMapping("/developer")
    Developer createDeveloper(@RequestBody Developer newDeveloper) {
        return developerRepository.save(newDeveloper);
    }

    @GetMapping("/developers")
    List<Developer> getAllDevelopers() {
        return developerRepository.findAll();
    }

    @GetMapping("/developer/{id}")
    Developer getDeveloperById(@PathVariable Long id) {
        return developerRepository.findById(id)
                .orElseThrow(() -> new DeveloperNotFoundException(id));
    }


    @PutMapping("/developer/{id}")
    Developer updateDeveloper(@RequestBody Developer updatedDeveloper, @PathVariable Long id) {
        return developerRepository.findById(id).map(developer -> {
            developer.setName(updatedDeveloper.getName());
            // Update other attributes as needed
            return developerRepository.save(developer);
        }).orElseThrow(() -> new DeveloperNotFoundException(id));
    }

    @DeleteMapping("/developer/{id}")
    void deleteDeveloper(@PathVariable Long id) {
        developerRepository.deleteById(id);
    }
}
