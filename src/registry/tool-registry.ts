import { CategoryTool } from '../types/common.js';
import { isToolEnabled } from '../config/feature-config.js';
import { validateLicense, LicenseLevel } from '../licensing/index.js';

/**
 * Tool Registry manages the registration and querying of all available tools.
 * It provides a central place to register, filter, and retrieve tools by various criteria.
 */
export class ToolRegistry {
  private tools: Map<string, CategoryTool> = new Map();
  private cachedEnabledTools: CategoryTool[] | null = null;
  private lastCacheTime = 0;
  private readonly CACHE_TTL = 60000; // 1 minute
  
  /**
   * Register a single tool in the registry
   */
  register(tool: CategoryTool): void {
    this.tools.set(tool.name, tool);
    // Invalidate cache when tools change
    this.cachedEnabledTools = null;
  }
  
  /**
   * Register multiple tools at once
   */
  registerMany(tools: CategoryTool[]): void {
    tools.forEach(tool => this.register(tool));
  }
  
  /**
   * Get a tool by its name
   */
  getByName(name: string): CategoryTool | undefined {
    return this.tools.get(name);
  }
  
  /**
   * Get all tools that belong to a specific category
   */
  getByCategory(category: string): CategoryTool[] {
    return Array.from(this.tools.values())
      .filter(tool => tool.category === category);
  }
  
  /**
   * Get all registered tools
   */
  getAllTools(): CategoryTool[] {
    return Array.from(this.tools.values());
  }
  
  /**
   * Get all tools that are enabled based on the license and configuration
   * This method now returns a subset based on the current license
   */
  async getEnabledToolsAsync(): Promise<CategoryTool[]> {
    const now = Date.now();
    
    // Use cache if available and not expired
    if (this.cachedEnabledTools && (now - this.lastCacheTime < this.CACHE_TTL)) {
      return this.cachedEnabledTools;
    }
    
    // Get license to check allowed categories
    const license = await validateLicense();
    
    // Filter tools based on license-allowed categories
    const enabledTools = this.getAllTools().filter(tool => 
      license.features.allowedCategories.includes(tool.category)
    );
    
    // Cache results
    this.cachedEnabledTools = enabledTools;
    this.lastCacheTime = now;
    
    return enabledTools;
  }
  
  /**
   * Get enabled tools (synchronous version, falls back to configuration)
   * This is used for backward compatibility
   */
  getEnabledTools(): CategoryTool[] {
    // If we have a cache, use it
    if (this.cachedEnabledTools) {
      return this.cachedEnabledTools;
    }
    
    // Otherwise fall back to config-based filtering
    // This uses the local configuration as a fallback
    return this.getAllTools().filter(tool => {
      try {
        return isToolEnabled(tool.name, tool.category);
      } catch (e) {
        // If async check fails, use default behavior
        return false;
      }
    });
  }
  
  /**
   * Check if a tool with the given name exists in the registry
   */
  hasToolWithName(name: string): boolean {
    return this.tools.has(name);
  }
  
  /**
   * Check if a tool belongs to the specified category
   */
  isToolInCategory(name: string, category: string): boolean {
    const tool = this.getByName(name);
    return !!tool && tool.category === category;
  }
}

// Create a singleton instance
export const toolRegistry = new ToolRegistry(); 