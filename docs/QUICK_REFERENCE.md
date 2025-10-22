# Quick Reference - New Components & Utilities

## Tooltips

### Basic Tooltip
```typescript
import { Tooltip } from './components/Tooltip';

<Tooltip content="This is helpful information">
  <button>Hover me</button>
</Tooltip>
```

### Help Icon
```typescript
import { HelpIcon } from './components/Tooltip';

<label>
  Campaign Name <HelpIcon tooltip="Must be unique and descriptive" />
</label>
```

### Positioning
```typescript
<Tooltip content="Info" position="top">...</Tooltip>
<Tooltip content="Info" position="bottom">...</Tooltip>
<Tooltip content="Info" position="left">...</Tooltip>
<Tooltip content="Info" position="right">...</Tooltip>
```

---

## Loading States

### Full Screen Loader
```typescript
import { LoadingSpinner } from './components/LoadingSpinner';

{isLoading && (
  <LoadingSpinner 
    fullScreen 
    message="Saving campaign..." 
    size="large" 
  />
)}
```

### Inline Loader
```typescript
<LoadingSpinner size="medium" message="Loading..." />
```

### Skeleton Loader
```typescript
import { SkeletonLoader } from './components/LoadingSpinner';

{isLoading ? (
  <SkeletonLoader count={5} height="60px" />
) : (
  <DataList />
)}
```

### Button Loader
```typescript
import { ButtonLoader } from './components/LoadingSpinner';

<button disabled={saving}>
  {saving && <ButtonLoader />}
  Save Campaign
</button>
```

---

## Keyboard Shortcuts

### Use a Shortcut
```typescript
import { useKeyboardShortcut, shortcuts } from './hooks/useKeyboardShortcuts';

function MyComponent() {
  useKeyboardShortcut(shortcuts.SAVE, handleSave);
  useKeyboardShortcut(shortcuts.EXPORT, handleExport);
  
  // Custom shortcut
  useKeyboardShortcut(
    { key: 'n', ctrl: true, shift: true },
    handleNewItem
  );
}
```

### Available Shortcuts
```typescript
shortcuts.DASHBOARD        // Ctrl+D
shortcuts.CAMPAIGNS        // Ctrl+C
shortcuts.AD_GROUPS        // Ctrl+A
shortcuts.KEYWORDS         // Ctrl+K
shortcuts.ASSETS           // Ctrl+P
shortcuts.GOALS            // Ctrl+G
shortcuts.BIDDING          // Ctrl+B
shortcuts.REPORTS          // Ctrl+R
shortcuts.HELP             // Ctrl+H
shortcuts.SAVE             // Ctrl+S
shortcuts.EXPORT           // Ctrl+E
shortcuts.SEARCH           // Ctrl+F
shortcuts.COMMAND_PALETTE  // Ctrl+K
```

### Display Shortcut
```typescript
import { getShortcutDisplay } from './hooks/useKeyboardShortcuts';

const display = getShortcutDisplay(shortcuts.SAVE); // "Ctrl+S" or "⌘+S"
```

---

## Command Palette

### Setup
```typescript
import { CommandPalette } from './components/CommandPalette';
import { useKeyboardShortcut } from './hooks/useKeyboardShortcuts';

function App() {
  const [showPalette, setShowPalette] = useState(false);
  
  useKeyboardShortcut(
    { key: 'k', ctrl: true },
    () => setShowPalette(true)
  );
  
  const commands = [
    {
      id: 'new-campaign',
      label: 'Create New Campaign',
      category: 'Campaigns',
      action: () => handleNewCampaign(),
      shortcut: 'Ctrl+N',
      keywords: ['add', 'create', 'new', 'campaign']
    },
    {
      id: 'export',
      label: 'Export Plan',
      category: 'Actions',
      action: () => handleExport(),
      shortcut: 'Ctrl+E'
    }
  ];
  
  return (
    <>
      <CommandPalette
        isOpen={showPalette}
        onClose={() => setShowPalette(false)}
        commands={commands}
      />
      {/* Your app */}
    </>
  );
}
```

---

## Validation

### Single Field
```typescript
import { validators } from './utils/validation';

function handleBudgetChange(value: number) {
  const result = validators.budget(value);
  if (!result.isValid) {
    setError(result.error);
    return;
  }
  setBudget(value);
}
```

### Multiple Fields
```typescript
import { combineValidations, validators } from './utils/validation';

function validateForm(values) {
  const result = combineValidations(
    validators.required(values.name, 'Campaign name'),
    validators.campaignName(values.name),
    validators.budget(values.budget),
    validators.asin(values.asin)
  );
  
  if (!result.isValid) {
    showError(result.error);
    return false;
  }
  return true;
}
```

### Available Validators
```typescript
validators.required(value, fieldName)
validators.minLength(value, min, fieldName)
validators.maxLength(value, max, fieldName)
validators.numberRange(value, min, max, fieldName)
validators.positiveNumber(value, fieldName)
validators.asin(value)
validators.sku(value)
validators.campaignName(value)
validators.budget(value)
validators.bid(value)
validators.percentage(value, fieldName)
validators.acos(value)
validators.keyword(value)
validators.brandName(value)
```

---

## Bulk Operations

### Basic Setup
```typescript
import { BulkToolbar, BulkAction } from './components/BulkToolbar';

function KeywordList() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  const actions: BulkAction[] = [
    {
      id: 'delete',
      label: 'Delete Selected',
      icon: 'fa-solid fa-trash',
      onClick: handleBulkDelete,
      variant: 'danger',
      tooltip: 'Delete selected keywords permanently'
    },
    {
      id: 'update-intent',
      label: 'Update Intent',
      icon: 'fa-solid fa-edit',
      onClick: handleBulkUpdateIntent,
      variant: 'primary'
    }
  ];
  
  return (
    <BulkToolbar
      selectedCount={selectedIds.length}
      totalCount={keywords.length}
      onSelectAll={() => setSelectedIds(keywords.map(k => k.id))}
      onDeselectAll={() => setSelectedIds([])}
      actions={actions}
      disabled={isFrozen}
    />
  );
}
```

### With Confirmation Dialog
```typescript
import { BulkConfirmDialog } from './components/BulkToolbar';

function KeywordList() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const handleBulkDelete = () => {
    setShowDeleteDialog(true);
  };
  
  const confirmDelete = () => {
    // Delete logic here
    setShowDeleteDialog(false);
    setSelectedIds([]);
  };
  
  return (
    <>
      {/* BulkToolbar */}
      
      <BulkConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Keywords?"
        message={`This will permanently delete ${selectedIds.length} keywords. This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </>
  );
}
```

---

## Search & Filtering

### Complete Setup
```typescript
import { useTableFilter } from './hooks/useTableFilter';
import { SearchAndFilter } from './components/SearchAndFilter';

function KeywordList({ keywords }) {
  const {
    filteredData,
    searchQuery,
    setSearchQuery,
    filters,
    addFilter,
    removeFilter,
    clearFilters,
    toggleSort,
    resultCount,
    totalCount
  } = useTableFilter(keywords);
  
  const availableFilters = [
    {
      field: 'intent',
      label: 'Intent',
      type: 'select' as const,
      options: [
        { value: 'Branded', label: 'Branded' },
        { value: 'Generic', label: 'Generic' },
        { value: 'Competitor', label: 'Competitor' }
      ]
    },
    {
      field: 'text',
      label: 'Keyword Text',
      type: 'text' as const
    }
  ];
  
  return (
    <>
      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onAddFilter={addFilter}
        onRemoveFilter={removeFilter}
        onClearFilters={clearFilters}
        availableFilters={availableFilters}
        placeholder="Search keywords..."
        resultCount={resultCount}
        totalCount={totalCount}
      />
      
      <table>
        <thead>
          <tr>
            <th onClick={() => toggleSort('text')}>Keyword</th>
            <th onClick={() => toggleSort('intent')}>Intent</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map(keyword => (
            <tr key={keyword.id}>
              <td>{keyword.text}</td>
              <td>{keyword.intent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
```

### Filter Types
```typescript
// Text filter (contains)
{
  field: 'name',
  label: 'Name',
  type: 'text'
}

// Select filter
{
  field: 'status',
  label: 'Status',
  type: 'select',
  options: [
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' }
  ]
}

// Number filter
{
  field: 'bid',
  label: 'Bid Amount',
  type: 'number'
}
```

### Programmatic Filters
```typescript
// Add filter programmatically
addFilter({
  field: 'intent',
  value: 'Branded',
  operator: 'equals'
});

// Remove filter
removeFilter('intent');

// Clear all
clearFilters();
```

---

## Styling Classes

### Validation States
```css
/* Error state */
<input className="input-error" />
<div className="error-message">
  <i className="fa-solid fa-circle-exclamation"></i>
  Error message here
</div>

/* Success state */
<input className="input-success" />
<div className="success-message">
  <i className="fa-solid fa-circle-check"></i>
  Success message
</div>

/* Warning state */
<input className="input-warning" />
<div className="warning-message">
  <i className="fa-solid fa-triangle-exclamation"></i>
  Warning message
</div>
```

### Required Fields
```html
<label className="field-required">Campaign Name</label>
<!-- Automatically adds red asterisk (*) -->
```

---

## Best Practices

### Tooltips
- ✅ Use for explaining features
- ✅ Keep text concise (1-2 sentences)
- ✅ Add HelpIcon next to labels
- ❌ Don't use for critical information
- ❌ Don't repeat visible text

### Loading States
- ✅ Show immediately for operations >200ms
- ✅ Use skeleton loaders for content
- ✅ Use full-screen for blocking operations
- ❌ Don't use for very quick operations
- ❌ Don't stack multiple loaders

### Keyboard Shortcuts
- ✅ Document in UI (help modal)
- ✅ Use standard conventions
- ✅ Don't override browser shortcuts
- ❌ Don't use too many modifiers
- ❌ Don't make critical actions keyboard-only

### Validation
- ✅ Validate on blur for best UX
- ✅ Show specific, actionable errors
- ✅ Prevent form submission if invalid
- ❌ Don't validate on every keystroke
- ❌ Don't use technical jargon

### Bulk Operations
- ✅ Always confirm destructive actions
- ✅ Show count of affected items
- ✅ Provide undo when possible
- ❌ Don't allow bulk delete without confirmation
- ❌ Don't hide important actions

### Filtering
- ✅ Save filter state when possible
- ✅ Show active filters clearly
- ✅ Make it easy to clear filters
- ❌ Don't auto-apply too many filters
- ❌ Don't hide the clear button

---

## Common Patterns

### Form with Validation
```typescript
function CampaignForm() {
  const [errors, setErrors] = useState({});
  
  const handleBlur = (field: string, value: any) => {
    const result = validators[field](value);
    setErrors(prev => ({
      ...prev,
      [field]: result.isValid ? null : result.error
    }));
  };
  
  return (
    <form>
      <div>
        <label className="field-required">
          Campaign Name
          <HelpIcon tooltip="Must be unique within workspace" />
        </label>
        <input
          name="name"
          onBlur={(e) => handleBlur('campaignName', e.target.value)}
          className={errors.name ? 'input-error' : ''}
        />
        {errors.name && (
          <div className="error-message">
            <i className="fa-solid fa-circle-exclamation"></i>
            {errors.name}
          </div>
        )}
      </div>
    </form>
  );
}
```

### List with All Features
```typescript
function EnhancedList() {
  const [selectedIds, setSelectedIds] = useState([]);
  const { filteredData, ...filterProps } = useTableFilter(data);
  
  const bulkActions = [
    { id: 'delete', label: 'Delete', icon: 'fa-trash', 
      onClick: handleDelete, variant: 'danger' }
  ];
  
  return (
    <>
      <SearchAndFilter {...filterProps} />
      <BulkToolbar
        selectedCount={selectedIds.length}
        totalCount={filteredData.length}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        actions={bulkActions}
      />
      {/* Your list */}
    </>
  );
}
```

---

## Troubleshooting

### Tooltips not showing?
- Check z-index conflicts
- Ensure parent has `position: relative`
- Verify tooltip content is not empty

### Loading spinner stuck?
- Check loading state is being set to false
- Verify async operations complete
- Add error handling

### Keyboard shortcuts not working?
- Check for input focus (shortcuts disabled in inputs)
- Verify no browser shortcut conflicts
- Check disabled prop

### Filters not applying?
- Verify filter field names match data keys
- Check filter operators
- Ensure data is passed to useTableFilter

### Validation not showing?
- Check validators are imported correctly
- Verify error state is being set
- Check className is applied

---

## Support

For detailed documentation, see:
- [UX_UI_REVIEW.md](./UX_UI_REVIEW.md)
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
- [IMPROVEMENTS_SUMMARY.md](./IMPROVEMENTS_SUMMARY.md)
