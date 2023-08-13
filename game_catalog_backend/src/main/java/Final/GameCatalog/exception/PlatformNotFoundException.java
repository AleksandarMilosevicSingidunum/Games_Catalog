package Final.GameCatalog.exception;

public class PlatformNotFoundException extends RuntimeException {
    public PlatformNotFoundException(Long id) {
        super("Could not find game "+ id);
    }

}
