# Project Restructuring Plan - Shopify-like CMS

## Current Issues:
- Content management is fragmented across multiple admin sections
- No unified content editing experience
- Homepage is treated separately from other pages
- Complex navigation structure

## Proposed Solution: Unified Content Management System

### 1. Database Schema Changes

```prisma
// Add to existing Page model
model Page {
  // ... existing fields ...
  isHomepage Boolean @default(false)
  order      Int     @default(0)
  template   String? // For different page layouts
  metadata   Json?   // For SEO and additional settings
}

// Remove separate homepage settings and integrate into Page model
```

### 2. Unified Admin Structure

Create a single content management area at `/admin/content` with:

**Main Content Dashboard:**
- List all pages (including homepage)
- Create/edit pages with template selection
- Drag-and-drop page ordering
- Bulk actions

**Header/Footer Management:**
- Integrated into content management
- Visual editor for navigation
- Component-based editing

### 3. New Admin Routes Structure

```
/admin/content
  /pages           - List all pages (homepage marked as special)
  /pages/[id]      - Edit individual page
  /pages/create    - Create new page
  /navigation      - Header/footer navigation management
  /components      - Reusable content components
  /templates       - Page templates management
```

### 4. Homepage Integration

- Treat homepage as a regular page with `isHomepage: true` flag
- Allow homepage to use special templates
- Maintain backward compatibility with current API

### 5. Implementation Steps

1. **Database Migration**: Add new fields to Page model
2. **API Consolidation**: Merge header/footer/homepage APIs into pages API
3. **Admin UI Redesign**: Create unified content management interface
4. **Frontend Updates**: Update components to use new structure
5. **Backward Compatibility**: Maintain old API routes during transition

### 6. Benefits

- **Single Source of Truth**: All content in one place
- **Better UX**: Shopify-like content management experience
- **Flexibility**: Support for multiple page types and templates
- **Scalability**: Easier to add new content types
- **Maintenance**: Reduced complexity in codebase

### 7. Migration Strategy

1. Phase 1: Add new fields and APIs while keeping old ones
2. Phase 2: Update admin UI to use new unified system
3. Phase 3: Migrate existing content to new structure
4. Phase 4: Deprecate old APIs and admin routes

### 8. Technical Considerations

- Use React Hook Form for better form management
- Implement drag-and-drop for page ordering
- Add rich text editor with component support
- Create template system for different page layouts
- Implement versioning and revision history

This restructuring will create a more intuitive, Shopify-like content management experience while maintaining all existing functionality.
