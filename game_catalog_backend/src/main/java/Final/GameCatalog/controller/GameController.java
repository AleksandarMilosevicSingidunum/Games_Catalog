package Final.GameCatalog.controller;

import Final.GameCatalog.exception.GameNotFoundException;
import Final.GameCatalog.model.Game;
import Final.GameCatalog.model.Platform;
import Final.GameCatalog.model.Developer;

import Final.GameCatalog.repository.GameRepository;
import Final.GameCatalog.repository.PlatformRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriUtils;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:3000")
public class GameController {
    public String Path = "src/main/java/Final/GameCatalog/images";
    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private PlatformRepository platformRepository;

    @PostMapping(value = "/game", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    Game newGame(@RequestParam("image") MultipartFile imageFile,
                 @RequestParam("title") String title,
                 @RequestParam("description") String description,
                 @RequestParam("releaseDate") String releaseDate,
                 @RequestParam("genre") String genre,
                 @RequestParam("developer") Long developerId,
                 @RequestParam("platforms") List<Long> platformIds) throws IOException {
        Game newGame = new Game(title, description, releaseDate, genre);
        if (!imageFile.isEmpty()) {
            String fileName = generateUniqueFileName(imageFile.getOriginalFilename());
            saveImageFile(imageFile, fileName);
            String imageUrl = generateImageUrl(fileName);
            newGame.setImageUrl(imageUrl);
        }

        // Set the developer using the provided ID
        Developer developer = new Developer();
        developer.setId(developerId);
        newGame.setDeveloper(developer);

        // Set the platforms using the provided IDs
        List<Platform> platforms = platformRepository.findAllById(platformIds);
        newGame.setPlatforms(platforms);

        return gameRepository.save(newGame);
    }

    private String generateUniqueFileName(String originalFilename) {
        return "game_image_"  + "_" + originalFilename;
    }


    @GetMapping("/images/{fileName:.+}")
    @ResponseBody
    public ResponseEntity<byte[]> getImage(@PathVariable String fileName) {
        try {
            Path imagePath = Paths.get(Path, fileName);
            byte[] imageBytes = Files.readAllBytes(imagePath);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_JPEG); // Adjust the content type based on your image type
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    private String getImageUrl(String fileName) {
        return "http://localhost:8080/" + fileName;
    }

    private void saveImageFile(MultipartFile imageFile, String fileName) throws IOException {
        String directoryPath = Path;
        File directory = new File(directoryPath);
        if (!directory.exists()) {
            directory.mkdirs();
        }
        File file = new File(directoryPath + File.separator + fileName);
        imageFile.transferTo(file);
    }

    private String generateImageUrl(String fileName) {

        return "images/" + fileName;
    }


    @GetMapping("/games")
    List<Game> getAllGames() {
        List<Game> games = gameRepository.findAll();
        games.forEach(game -> game.setImageUrl(getImageUrl(game.getImageUrl())));
        return games;
    }

    @GetMapping("/game/{id}")
    public Game getGameById(@PathVariable Long id) {
        Optional<Game> game = gameRepository.findById(id);
        if (game.isPresent()) {
            Game foundGame = game.get();
            foundGame.setImageUrl(getImageUrl(foundGame.getImageUrl()));
            return foundGame;
        } else {
            throw new GameNotFoundException(id);
        }
    }


    @PutMapping(value = "/game/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    Game updateGame(@PathVariable Long id,
                    @RequestParam(value = "image", required = false) MultipartFile imageFile,
                    @RequestParam("title") String title,
                    @RequestParam("description") String description,
                    @RequestParam("releaseDate") String releaseDate,
                    @RequestParam("genre") String genre,
                    @RequestParam("developer") Long developerId,
                    @RequestParam("platforms") List<Long> platformIds) throws IOException {
        Optional<Game> optionalGame = gameRepository.findById(id);
        if (optionalGame.isPresent()) {
            Game existingGame = optionalGame.get();
            existingGame.setTitle(title);
            existingGame.setDescription(description);
            existingGame.setReleaseDate(releaseDate);
            existingGame.setGenre(genre);

            if (imageFile != null && !imageFile.isEmpty()) {
                if (StringUtils.hasText(existingGame.getImageUrl())) {
                    deleteImageFile(existingGame.getImageUrl());
                }

                String fileName = generateUniqueFileName(imageFile.getOriginalFilename());
                saveImageFile(imageFile, fileName);
                String imageUrl = generateImageUrl(fileName);
                existingGame.setImageUrl(imageUrl);
            }

            // Set the developer using the provided ID
            Developer developer = new Developer();
            developer.setId(developerId);
            existingGame.setDeveloper(developer);

            // Set the platforms using the provided IDs
            List<Platform> platforms = platformRepository.findAllById(platformIds);
            existingGame.setPlatforms(platforms);

            return gameRepository.save(existingGame);
        } else {
            throw new GameNotFoundException(id);
        }
    }

    private void deleteImageFile(String imageUrl) {
        try {
            String decodedImageUrl = UriUtils.decode(imageUrl, StandardCharsets.UTF_8);
            String fileName = StringUtils.getFilename(decodedImageUrl);
            Path imagePath = Paths.get(Path, fileName);
            Files.deleteIfExists(imagePath);
        } catch (IOException e) {
            // Handle exception if the file deletion fails
            e.printStackTrace();
        }
    }



    @DeleteMapping("/game/{id}")
    void deleteGame(@PathVariable Long id) {
        gameRepository.deleteById(id);
    }
}
