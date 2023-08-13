package Final.GameCatalog.service;

import Final.GameCatalog.exception.DeveloperNotFoundException;
import Final.GameCatalog.exception.GameNotFoundException;
import Final.GameCatalog.exception.PlatformNotFoundException;
import Final.GameCatalog.model.Game;
import Final.GameCatalog.model.Developer;
import Final.GameCatalog.model.Platform;
import Final.GameCatalog.repository.GameRepository;
import Final.GameCatalog.repository.DeveloperRepository;
import Final.GameCatalog.repository.PlatformRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class GameService {

    private final GameRepository gameRepository;
    private final DeveloperRepository developerRepository;
    private final PlatformRepository platformRepository;

    public GameService(GameRepository gameRepository, DeveloperRepository developerRepository, PlatformRepository platformRepository) {
        this.gameRepository = gameRepository;
        this.developerRepository = developerRepository;
        this.platformRepository = platformRepository;
    }

    public Game createGame(Game game, Long developerId, List<Long> platformIds) {
        try {
            Developer developer = developerRepository.findById(developerId)
                    .orElseThrow(() -> new DeveloperNotFoundException(developerId));

            List<Platform> platforms = platformRepository.findAllById(platformIds);
            if (platforms.isEmpty()) {
                throw new PlatformNotFoundException(developerId);
            }

            game.setDeveloper(developer);
            game.setPlatforms(platforms);

            return gameRepository.save(game);
        } catch (DeveloperNotFoundException | PlatformNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while creating the game.");
        }
    }

    public List<Game> getAllGames() {
        try {
            return gameRepository.findAll();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while retrieving games.");
        }
    }

    public Game getGameById(Long id) {
        try {
            return gameRepository.findById(id)
                    .orElseThrow(() -> new GameNotFoundException(id));
        } catch (GameNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while retrieving the game.");
        }
    }

    public Game updateGame(Long id, Game updatedGame, Long developerId, List<Long> platformIds) {
        try {
            Game game = gameRepository.findById(id)
                    .orElseThrow(() -> new GameNotFoundException(id));

            Developer developer = developerRepository.findById(developerId)
                    .orElseThrow(() -> new DeveloperNotFoundException(developerId));

            List<Platform> platforms = platformRepository.findAllById(platformIds);
            if (platforms.isEmpty()) {
                throw new PlatformNotFoundException(developerId);
            }

            game.setTitle(updatedGame.getTitle());
            game.setDescription(updatedGame.getDescription());
            game.setReleaseDate(updatedGame.getReleaseDate());
            game.setGenre(updatedGame.getGenre());
            game.setDeveloper(developer);
            game.setPlatforms(platforms);

            return gameRepository.save(game);
        } catch (GameNotFoundException | DeveloperNotFoundException | PlatformNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while updating the game.");
        }
    }

    public void deleteGame(Long id) {
        try {
            gameRepository.findById(id)
                    .orElseThrow(() -> new GameNotFoundException(id));

            gameRepository.deleteById(id);
        } catch (GameNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while deleting the game.");
        }
    }
}