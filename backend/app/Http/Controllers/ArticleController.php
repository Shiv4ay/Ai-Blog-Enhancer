<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Symfony\Component\DomCrawler\Crawler;
use Carbon\Carbon;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Article::query();

        if ($request->has('is_optimized')) {
            $query->where('is_optimized', filter_var($request->is_optimized, FILTER_VALIDATE_BOOLEAN));
        }

        return response()->json($query->orderBy('created_at', 'desc')->paginate(10));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'original_article_id' => 'nullable|exists:articles,id',
            'is_optimized' => 'boolean',
            'references' => 'nullable|array'
        ]);

        $article = Article::create($validated);

        return response()->json($article, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return response()->json(Article::findOrFail($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $article = Article::findOrFail($id);
        $article->update($request->all());

        return response()->json($article);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        Article::destroy($id);
        return response()->json(null, 204);
    }

    /**
     * Scrape and store articles from BeyondChats
     */
    public function scrapeAndStore()
    {
        $urls = [
            'https://beyondchats.com/blogs/introduction-to-chatbots/',
            'https://beyondchats.com/blogs/live-chatbot/',
            'https://beyondchats.com/blogs/virtual-assistant/',
            'https://beyondchats.com/blogs/lead-generation-chatbots/',
            'https://beyondchats.com/blogs/chatbots-for-small-business-growth/'
        ];

        $scrapedCount = 0;
        $errors = [];

        foreach ($urls as $url) {
            try {
                // Check if already exists
                if (Article::where('source_url', $url)->exists()) {
                    continue;
                }

                $response = Http::get($url);
                
                if (!$response->successful()) {
                    $errors[] = "Failed to fetch $url: " . $response->status();
                    continue;
                }

                $crawler = new Crawler($response->body());

                // Extract data based on BeyondChats structure (needs adjustment if selector changes)
                // Assuming standard WordPress structure: .entry-title, .entry-content
                $title = $crawler->filter('h1')->count() > 0 ? $crawler->filter('h1')->text() : 'Untitled';
                
                // Try to find content in common containers
                $content = '';
                if ($crawler->filter('.entry-content')->count() > 0) {
                    $content = $crawler->filter('.entry-content')->html();
                } elseif ($crawler->filter('article')->count() > 0) {
                    $content = $crawler->filter('article')->html();
                } else {
                    $content = $crawler->filter('body')->html(); // Fallback
                }

                // Clean up content (basic)
                $content = strip_tags($content, '<p><h2><h3><h4><ul><ol><li><strong><em><a><img><br>');

                Article::create([
                    'title' => $title,
                    'content' => $content,
                    'source_url' => $url,
                    'excerpt' => substr(strip_tags($content), 0, 150) . '...',
                    'published_at' => Carbon::now(), // We don't have easy access to real date without more parsing
                    'is_optimized' => false
                ]);

                $scrapedCount++;

            } catch (\Exception $e) {
                $errors[] = "Error processing $url: " . $e->getMessage();
            }
        }

        return response()->json([
            'message' => "Scraping completed. Imported $scrapedCount articles.",
            'errors' => $errors
        ]);
    }
}
