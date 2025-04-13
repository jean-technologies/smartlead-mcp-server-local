import { CategoryTool } from '../types/common.js';
import { isToolEnabled } from '../config/feature-config.js';

/**
 * Tool Registry manages the registration and querying of all available tools.
 * It provides a central place to register, filter, and retrieve tools by various criteria.
 */
export class ToolRegistry {
  private tools: Map<string, CategoryTool> = new Map();
  
  /**
   * Register a single tool in the registry
   */
  register(tool: CategoryTool): void {
    this.tools.set(tool.name, tool);
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
   * Get all tools that are enabled based on the configuration
   */
  getEnabledTools(): CategoryTool[] {
    return this.getAllTools().filter(tool => isToolEnabled(tool.name, tool.category));
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