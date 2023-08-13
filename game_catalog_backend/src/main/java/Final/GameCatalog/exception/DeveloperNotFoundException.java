package Final.GameCatalog.exception;

public class DeveloperNotFoundException extends RuntimeException {
    public DeveloperNotFoundException(Long id) {
        super("Could not find game "+ id);
    }
}
