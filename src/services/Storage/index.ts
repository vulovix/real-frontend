// Create and export default instances
import { AuthStorage } from './AuthStorage';

/**
 * Storage services exports
 */

export { AuthStorage } from './AuthStorage';

export const authStorage = AuthStorage.getInstance();
