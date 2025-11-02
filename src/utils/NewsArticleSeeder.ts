/**
 * News Articles Seed Data
 * Utility to populate database with initial sample articles
 */

import { NewsCategory, UserNewsArticle } from '../features/News/types';
import { RepositoryFactory } from '../services/Repository';

export class NewsArticleSeeder {
  private static readonly SAMPLE_AUTHORS = [
    { id: 'author-1', name: 'John Smith' },
    { id: 'author-2', name: 'Sarah Johnson' },
    { id: 'author-3', name: 'Michael Chen' },
    { id: 'author-4', name: 'Emily Davis' },
    { id: 'author-5', name: 'David Wilson' },
  ];

  private static readonly SAMPLE_ARTICLES: Omit<
    UserNewsArticle,
    'id' | 'createdAt' | 'updatedAt' | 'readingTime'
  >[] = [
    {
      title: 'The Future of Artificial Intelligence in Healthcare',
      intro:
        'AI is revolutionizing medical diagnosis and treatment, promising more accurate and personalized healthcare solutions.',
      description: `
        <h3>Transforming Medical Diagnosis</h3>
        <p>Artificial Intelligence is making unprecedented strides in healthcare, particularly in medical diagnosis. Machine learning algorithms can now analyze medical images, detect patterns invisible to the human eye, and provide diagnostic suggestions with remarkable accuracy.</p>
        
        <h3>Personalized Treatment Plans</h3>
        <p>AI systems are enabling doctors to create highly personalized treatment plans based on individual patient data, genetic information, and medical history. This personalized approach is showing promising results in cancer treatment and chronic disease management.</p>
        
        <p>The integration of AI in healthcare represents a paradigm shift towards more efficient, accurate, and accessible medical care for patients worldwide.</p>
      `,
      imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop',
      authorId: 'author-1',
      authorName: 'John Smith',
      category: NewsCategory.TECHNOLOGY,
      isPublished: true,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
    {
      title: 'Climate Change: The Economic Impact on Global Markets',
      intro:
        'New research reveals how climate change is reshaping investment strategies and creating both risks and opportunities in global markets.',
      description: `
        <h3>Market Volatility and Climate Risks</h3>
        <p>Financial markets are increasingly factoring climate-related risks into investment decisions. Companies in fossil fuel industries are seeing decreased valuations, while renewable energy stocks continue to surge.</p>
        
        <h3>Green Investment Opportunities</h3>
        <p>The transition to sustainable energy has created a multi-trillion dollar investment opportunity. ESG (Environmental, Social, and Governance) funds are outperforming traditional investment vehicles.</p>
        
        <blockquote>"Climate change is not just an environmental issue anymore – it's fundamentally reshaping how we think about long-term economic stability." - Climate Economics Institute</blockquote>
        
        <p>Investors are advised to consider climate resilience as a key factor in portfolio diversification strategies.</p>
      `,
      imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=200&fit=crop',
      authorId: 'author-2',
      authorName: 'Sarah Johnson',
      category: NewsCategory.BUSINESS,
      isPublished: true,
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
    {
      title: 'Breakthrough in Quantum Computing: What It Means for Cybersecurity',
      intro:
        'Scientists achieve new milestone in quantum computing that could revolutionize data encryption and online security.',
      description: `
        <h3>Quantum Supremacy Achieved</h3>
        <p>Researchers at leading tech companies have demonstrated quantum computers capable of solving complex problems exponentially faster than classical computers. This breakthrough has significant implications for cybersecurity.</p>
        
        <h3>The Double-Edged Sword</h3>
        <p>While quantum computing promises enhanced security through quantum cryptography, it also threatens to break current encryption methods that protect our digital infrastructure.</p>
        
        <ul>
          <li>Current RSA encryption could become obsolete</li>
          <li>New quantum-resistant algorithms are being developed</li>
          <li>Financial institutions are preparing for the transition</li>
        </ul>
        
        <p>The race is on to develop quantum-safe security measures before quantum computers become widely accessible.</p>
      `,
      authorId: 'author-3',
      authorName: 'Michael Chen',
      category: NewsCategory.TECHNOLOGY,
      isPublished: true,
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    },
    {
      title: 'Mental Health Awareness: Breaking the Workplace Stigma',
      intro:
        'Companies worldwide are implementing new strategies to support employee mental health and create more inclusive work environments.',
      description: `
        <h3>The Hidden Crisis</h3>
        <p>Mental health issues in the workplace have reached critical levels, with studies showing that 1 in 4 employees experience mental health challenges. The COVID-19 pandemic has only exacerbated these concerns.</p>
        
        <h3>Corporate Response</h3>
        <p>Forward-thinking companies are implementing comprehensive mental health programs including:</p>
        <ul>
          <li>Employee assistance programs (EAPs)</li>
          <li>Mental health days and flexible work arrangements</li>
          <li>On-site counseling services</li>
          <li>Manager training on mental health awareness</li>
        </ul>
        
        <p>Creating psychologically safe workplaces is no longer optional – it's essential for employee retention and productivity.</p>
      `,
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=200&fit=crop',
      authorId: 'author-4',
      authorName: 'Emily Davis',
      category: NewsCategory.HEALTH,
      isPublished: true,
      publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    },
    {
      title: 'Space Tourism Takes Off: Commercial Flights Begin',
      intro:
        'The first commercial space tourism flights mark a new era in space exploration, making the cosmos accessible to civilian travelers.',
      description: `
        <h3>A New Frontier Opens</h3>
        <p>After decades of development, space tourism has transitioned from science fiction to reality. Multiple companies are now offering suborbital flights to paying customers, democratizing access to space.</p>
        
        <h3>The Economics of Space Travel</h3>
        <p>While currently expensive, costs are expected to decrease as technology improves and competition increases. Industry experts predict space tourism could become as common as international air travel within the next two decades.</p>
        
        <h3>Scientific Benefits</h3>
        <p>Beyond tourism, these developments are advancing our understanding of space technology and potentially paving the way for:</p>
        <ul>
          <li>Faster intercontinental travel</li>
          <li>Space-based manufacturing</li>
          <li>Lunar and Mars colonization efforts</li>
        </ul>
      `,
      imageUrl: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=200&fit=crop',
      authorId: 'author-5',
      authorName: 'David Wilson',
      category: NewsCategory.SCIENCE,
      isPublished: true,
      publishedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    },
    {
      title: 'The Rise of Plant-Based Diets: Health and Environmental Benefits',
      intro:
        'Growing scientific evidence supports the health and environmental advantages of plant-based nutrition.',
      description: `
        <h3>Health Benefits Confirmed</h3>
        <p>Recent studies confirm that well-planned plant-based diets can reduce the risk of chronic diseases including heart disease, diabetes, and certain cancers. The key is ensuring proper nutrition and vitamin supplementation.</p>
        
        <h3>Environmental Impact</h3>
        <p>Plant-based diets significantly reduce carbon footprint, water usage, and land requirements compared to traditional meat-heavy diets. This shift could be crucial in addressing climate change.</p>
        
        <p>The food industry is responding with innovative plant-based alternatives that closely mimic traditional animal products in taste and texture.</p>
      `,
      authorId: 'author-1',
      authorName: 'John Smith',
      category: NewsCategory.HEALTH,
      isPublished: true,
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    },
    {
      title: 'Remote Work Revolution: Permanent Changes in Corporate Culture',
      intro:
        'The pandemic-driven shift to remote work is becoming a permanent fixture, fundamentally changing how businesses operate.',
      description: `
        <h3>The Great Work Migration</h3>
        <p>Companies are embracing hybrid and fully remote work models as permanent solutions, not temporary measures. This shift is reshaping real estate markets, urban planning, and work-life balance expectations.</p>
        
        <h3>Productivity Insights</h3>
        <p>Contrary to initial concerns, many organizations report maintained or improved productivity with remote work arrangements. Key factors include:</p>
        <ul>
          <li>Reduced commute stress and time</li>
          <li>Flexible scheduling options</li>
          <li>Better work-life integration</li>
          <li>Access to global talent pools</li>
        </ul>
        
        <h3>Challenges and Solutions</h3>
        <p>While remote work offers many benefits, companies are addressing challenges like team cohesion, company culture, and employee development through innovative digital solutions and periodic in-person gatherings.</p>
      `,
      imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=200&fit=crop',
      authorId: 'author-2',
      authorName: 'Sarah Johnson',
      category: NewsCategory.BUSINESS,
      isPublished: true,
      publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    },
    {
      title: 'Electric Vehicle Adoption Accelerates Globally',
      intro:
        'EV sales surpass projections as governments and consumers embrace sustainable transportation solutions.',
      description: `
        <h3>Market Transformation</h3>
        <p>Electric vehicle adoption is accelerating beyond all predictions. Major automakers are committing to all-electric lineups, and charging infrastructure is expanding rapidly across developed nations.</p>
        
        <h3>Government Incentives Drive Change</h3>
        <p>Policy support including tax incentives, emission regulations, and infrastructure investment is creating a favorable environment for EV adoption. Several countries have announced plans to ban internal combustion engine sales within the next decade.</p>
        
        <p>The transition represents not just an environmental victory, but also a massive economic opportunity in manufacturing, battery technology, and energy storage systems.</p>
      `,
      authorId: 'author-3',
      authorName: 'Michael Chen',
      category: NewsCategory.TECHNOLOGY,
      isPublished: true,
      publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
    },
  ];

  /**
   * Seed the database with sample articles
   */
  static async seedArticles(): Promise<number> {
    try {
      const newsRepo = await RepositoryFactory.getNewsArticleRepository();

      // Check if articles already exist
      const existingArticles = await newsRepo.findAll();
      if (existingArticles.length > 0) {
        // Articles already exist, return current count
        return existingArticles.length;
      }

      let seededCount = 0;

      for (const articleTemplate of this.SAMPLE_ARTICLES) {
        const now = new Date().toISOString();
        const article: UserNewsArticle = {
          id: crypto.randomUUID(),
          ...articleTemplate,
          createdAt: articleTemplate.publishedAt || now,
          updatedAt: articleTemplate.publishedAt || now,
          readingTime: newsRepo.calculateReadingTime(articleTemplate.description),
        };

        await newsRepo.create(article);
        seededCount++;
      }

      return seededCount;
    } catch (error) {
      throw new Error(
        `Failed to seed articles: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Clear all articles (for development/testing)
   */
  static async clearArticles(): Promise<void> {
    try {
      const newsRepo = await RepositoryFactory.getNewsArticleRepository();
      await newsRepo.clear();
    } catch (error) {
      throw new Error(
        `Failed to clear articles: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get seed status
   */
  static async getSeedStatus(): Promise<{
    hasArticles: boolean;
    articleCount: number;
    sampleCount: number;
  }> {
    try {
      const newsRepo = await RepositoryFactory.getNewsArticleRepository();
      const articles = await newsRepo.findAll();

      return {
        hasArticles: articles.length > 0,
        articleCount: articles.length,
        sampleCount: this.SAMPLE_ARTICLES.length,
      };
    } catch (error) {
      // Return default values on error
      return {
        hasArticles: false,
        articleCount: 0,
        sampleCount: this.SAMPLE_ARTICLES.length,
      };
    }
  }
}

// Development utility - expose to window for easy access in browser console
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).NewsSeeder = NewsArticleSeeder;
}
