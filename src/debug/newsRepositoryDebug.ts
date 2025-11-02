/**
 * Debug utility for testing news repository methods
 */

export async function debugNewsRepository() {
  try {
    console.log('=== News Repository Debug Test ===');

    // Import repository
    const { RepositoryFactory } = await import('../services/Repository');
    const newsRepo = await RepositoryFactory.getNewsArticleRepository();
    console.log('✓ Repository initialized');

    // Test findAll method
    console.log('\n--- Testing findAll() ---');
    const allArticles = await newsRepo.findAll();
    console.log(`Found ${allArticles.length} total articles:`, allArticles);

    // Test findPublishedArticles method
    console.log('\n--- Testing findPublishedArticles() ---');
    const publishedArticles = await newsRepo.findPublishedArticles();
    console.log(`Found ${publishedArticles.length} published articles:`, publishedArticles);

    // Test database connection
    console.log('\n--- Testing Database Connection ---');
    const { databaseConnection } = await import('../services/Database');
    const db = await databaseConnection.initialize();
    console.log('✓ Database connection:', db);

    // Check object stores
    console.log('\n--- Checking Object Stores ---');
    const storeNames = Array.from(db.objectStoreNames);
    console.log('Available stores:', storeNames);

    // Check if user_news_articles store exists
    if (storeNames.includes('user_news_articles')) {
      console.log('✓ user_news_articles store exists');

      // Try to access the store directly
      const transaction = db.transaction(['user_news_articles'], 'readonly');
      const store = transaction.objectStore('user_news_articles');

      console.log('\n--- Store Indexes ---');
      const indexNames = Array.from(store.indexNames);
      console.log('Available indexes:', indexNames);

      // Count records in store
      const countRequest = store.count();
      countRequest.onsuccess = () => {
        console.log(`Total records in store: ${countRequest.result}`);
      };
      countRequest.onerror = (error) => {
        console.error('Error counting records:', error);
      };
    } else {
      console.error('❌ user_news_articles store not found!');
    }

    return {
      success: true,
      totalArticles: allArticles.length,
      publishedArticles: publishedArticles.length,
    };
  } catch (error) {
    console.error('=== Debug Test Failed ===');
    console.error('Error:', error);

    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Make it available globally for browser console testing
(window as any).debugNewsRepository = debugNewsRepository;
