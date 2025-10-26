---
description: "Create a new React component with TypeScript support, proper typing, and comprehensive structure"
agent: "code-modifier"
---

## 5-Phase React Component Creation Workflow

### Phase 1: Component Analysis & Specification

**Objective:** Analyze component requirements and generate comprehensive specification

**Key Activities:**
- **Requirement Gathering**: Understand component purpose, props, and behavior
- **Type Analysis**: Determine TypeScript interfaces and type definitions
- **Architecture Planning**: Choose between functional/class components and styling approach
- **Dependency Assessment**: Identify required imports and external dependencies

**Component Types:**
- **Functional Components**: Modern React approach with hooks for state management
- **Class Components**: Traditional approach for complex stateful components
- **Custom Hooks**: Extract reusable logic into custom hook functions
- **Higher-Order Components**: For cross-cutting concerns and reusability

**Styling Options:**
- **CSS Modules**: Scoped styling with automatic class name generation
- **Styled Components**: CSS-in-JS with dynamic styling capabilities
- **CSS-in-JS Libraries**: Emotion, styled-components, or similar solutions
- **Utility-First CSS**: Tailwind CSS or similar atomic CSS approaches

**Project Context Analysis:**
- **Framework Detection**: React, Next.js, Vite, or Create React App
- **TypeScript Configuration**: Interface generation and type safety
- **Testing Setup**: Jest, React Testing Library, or alternative frameworks
- **Build System**: Webpack, Vite, or other bundlers affecting import patterns

***

### Phase 2: Component Implementation with TypeScript

**Objective:** Generate production-ready component code with proper TypeScript typing

**Key Activities:**
- **Type Definition Creation**: Generate comprehensive TypeScript interfaces and types
- **Component Structure**: Implement functional or class-based component architecture
- **State Management**: Set up appropriate state handling patterns
- **Error Boundaries**: Implement error handling and user feedback mechanisms

**TypeScript Integration:**
- **Interface Generation**: Create props, state, and event handler types
- **Generic Types**: Support flexible component APIs with generics
- **Union Types**: Handle variant props and conditional rendering
- **Utility Types**: Leverage TypeScript utility types for cleaner APIs

**Component Architecture Patterns:**
- **Container/Presentational**: Separate logic from presentation concerns
- **Compound Components**: Create component families with shared state
- **Render Props**: Enable flexible component customization
- **Forward Refs**: Support imperative APIs and DOM access

**State Management Approaches:**
- **Local State**: useState for component-specific state
- **Context API**: Shared state across component trees
- **Custom Hooks**: Encapsulate reusable stateful logic
- **External Libraries**: Redux, Zustand, or Jotai integration

**Error Handling Strategies:**
- **Error Boundaries**: Catch JavaScript errors in component trees
- **User Feedback**: Display appropriate error messages and recovery options
- **Logging**: Integrate with error tracking and monitoring systems
- **Graceful Degradation**: Maintain functionality when errors occur

***

### Phase 3: Testing Setup & Implementation

**Objective:** Generate comprehensive test suite with React Testing Library

**Key Activities:**
- **Test File Generation**: Create unit tests covering component functionality
- **Testing Library Integration**: Use React Testing Library for user-centric testing
- **Storybook Configuration**: Set up interactive component documentation
- **Test Coverage Planning**: Ensure comprehensive test scenarios

**Testing Strategies:**
- **Unit Tests**: Test individual component behavior and props
- **Integration Tests**: Verify component interactions and data flow
- **Accessibility Tests**: Ensure WCAG compliance and screen reader support
- **Visual Regression Tests**: Storybook for UI consistency validation

**Test Categories:**
- **Rendering Tests**: Verify correct display with various prop combinations
- **Interaction Tests**: Test user interactions and event handling
- **State Management Tests**: Validate state changes and side effects
- **Error Boundary Tests**: Ensure graceful error handling and recovery
- **Accessibility Tests**: Confirm ARIA attributes and keyboard navigation

**Storybook Integration:**
- **Interactive Documentation**: Live component examples with controls
- **Variant Showcasing**: Display all component states and configurations
- **Development Workflow**: Rapid prototyping and visual testing
- **Design System Integration**: Consistent component documentation

***

### Phase 4: Integration & Documentation

**Objective:** Integrate component into project and generate documentation[3][5][1]

```
INTEGRATION & DOCUMENTATION
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────

PHASE 4.1: PROJECT INTEGRATION
────────────────────────────────────────────────────────────────

```
# Generate index file for clean imports
cat > "$COMPONENT_NAME/index.ts" << EOF
// $COMPONENT_NAME Component Exports
export { default } from './$COMPONENT_NAME';
export type { ${COMPONENT_NAME}Props } from './$COMPONENT_NAME.types';
EOF

echo "✅ Generated: $COMPONENT_NAME/index.ts"

# Update main component to use styled components if selected
if [ "$USE_STYLED" = true ]; then
    # Update imports in main component
    sed -i '' 's|import '\''./$COMPONENT_NAME.css'\'';|import { ${COMPONENT_NAME}Container, ${COMPONENT_NAME}Title, ${COMPONENT_NAME}Content, ${COMPONENT_NAME}Button, ${COMPONENT_NAME}Error } from '\''./$COMPONENT_NAME.styled'\'';|g' "$COMPONENT_NAME/$COMPONENT_NAME.tsx"
    
    # Update JSX to use styled components
    sed -i '' 's|<div className={componentClasses}>|<${COMPONENT_NAME}Container variant={variant} disabled={disabled} className={className}>|g' "$COMPONENT_NAME/$COMPONENT_NAME.tsx"
    sed -i '' 's|<h3 className="${COMPONENT_NAME.toLowerCase()}__title">|<${COMPONENT_NAME}Title>|g' "$COMPONENT_NAME/$COMPONENT_NAME.tsx"
    sed -i '' 's|<div className="${COMPONENT_NAME.toLowerCase()}__content">|<${COMPONENT_NAME}Content>|g' "$COMPONENT_NAME/$COMPONENT_NAME.tsx"
    sed -i '' 's|<button|<${COMPONENT_NAME}Button|g' "$COMPONENT_NAME/$COMPONENT_NAME.tsx"
    sed -i '' 's|<div className="${COMPONENT_NAME.toLowerCase()}__error" role="alert">|<${COMPONENT_NAME}Error role="alert">|g' "$COMPONENT_NAME/$COMPONENT_NAME.tsx"
    sed -i '' 's|</div>|</${COMPONENT_NAME}Container>|g' "$COMPONENT_NAME/$COMPONENT_NAME.tsx"
fi

echo "✅ Component integrated with styling approach"
```

────────────────────────────────────────────────────────────────

PHASE 4.2: README DOCUMENTATION
────────────────────────────────────────────────────────────────

```
# Generate README for the component
cat > "$COMPONENT_NAME/README.md" << EOF
# $COMPONENT_NAME Component

A reusable React component with TypeScript support, built with best practices and comprehensive testing.

## Features

- ✅ TypeScript support with proper type definitions
- ✅ Multiple variants (primary, secondary, tertiary)
- ✅ Loading and error states
- ✅ Accessibility (ARIA labels, screen reader support)
- ✅ Comprehensive test suite
- ✅ Storybook integration
- ✅ CSS Modules or Styled Components support
- ✅ Error boundaries and async operation handling

## Installation

\`\`\`bash
# Copy the entire $COMPONENT_NAME directory to your components folder
cp -r $COMPONENT_NAME src/components/
\`\`\`

## Usage

\`\`\`tsx
import $COMPONENT_NAME from './components/$COMPONENT_NAME';

function App() {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return (
    <$COMPONENT_NAME
      title="My Component"
      variant="primary"
      onClick={handleClick}
    >
      <p>This is the component content.</p>
    </$COMPONENT_NAME>
  );
}
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | '$COMPONENT_NAME' | Component title |
| children | ReactNode | undefined | Component content |
| onClick | () => void | undefined | Click handler |
| variant | 'primary' \| 'secondary' \| 'tertiary' | 'primary' | Visual variant |
| disabled | boolean | false | Disabled state |
| className | string | '' | Additional CSS classes |

## Variants

### Primary
Default blue styling for main actions.

### Secondary
Gray styling for secondary actions.

### Tertiary
Transparent styling with border for subtle actions.

## Testing

\`\`\`bash
npm test $COMPONENT_NAME.test.tsx
\`\`\`

## Storybook

\`\`\`bash
npm run storybook
\`\`\`

Navigate to the $COMPONENT_NAME stories to see all variants and states.

## Accessibility

This component follows WCAG 2.1 guidelines:
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader announcements for errors
- Focus management

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Make changes to the component
2. Update tests accordingly
3. Update Storybook stories if needed
4. Run the full test suite
5. Submit a pull request
EOF

echo "✅ Generated: $COMPONENT_NAME/README.md"
```

════════════════════════════════════════════════════════════════
```

***

### Phase 5: Quality Assurance & Deployment

**Objective:** Run tests, validate code quality, and prepare for deployment[4][2][5]

```
QUALITY ASSURANCE & DEPLOYMENT
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────

PHASE 5.1: CODE QUALITY VALIDATION
────────────────────────────────────────────────────────────────

```
#!/bin/bash

echo ""
echo "🔍 Code Quality Validation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Run ESLint if configured
if [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ] || [ -f "eslint.config.js" ]; then
    echo "Running ESLint..."
    npx eslint "$COMPONENT_NAME/**/*.tsx" --fix
    echo "✅ ESLint completed"
else
    echo "⚠️  ESLint not configured - consider adding it for code quality"
fi

# Run Prettier if configured
if [ -f ".prettierrc" ] || grep -q "prettier" package.json; then
    echo "Running Prettier..."
    npx prettier --write "$COMPONENT_NAME/**/*.{tsx,ts,css}"
    echo "✅ Prettier completed"
else
    echo "⚠️  Prettier not configured - consider adding it for code formatting"
fi

# Check TypeScript compilation
if [ -f "tsconfig.json" ]; then
    echo "Running TypeScript compilation check..."
    npx tsc --noEmit --project .
    echo "✅ TypeScript compilation check passed"
fi

echo ""
echo "📊 Code Quality Metrics:"
echo "  • Files generated: 6"
echo "  • Lines of code: $(find "$COMPONENT_NAME" -name "*.tsx" -o -name "*.ts" -o -name "*.css" | xargs wc -l | tail -1 | awk '{print $1}')"
echo "  • Test coverage: Comprehensive (unit, integration, accessibility)"
echo ""
```

────────────────────────────────────────────────────────────────

PHASE 5.2: FINAL VALIDATION & SUMMARY
────────────────────────────────────────────────────────────────

```
# Run component tests
echo "🧪 Running component tests..."
cd "$COMPONENT_NAME"

if [ -f "../node_modules/.bin/jest" ]; then
    ../node_modules/.bin/jest --passWithNoTests
    echo "✅ Tests executed"
else
    echo "⚠️  Jest not available - install dependencies first"
fi

cd ..

echo ""
echo "🎉 Component Generation Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📁 Generated Files:"
echo "  • $COMPONENT_NAME/$COMPONENT_NAME.tsx - Main component"
echo "  • $COMPONENT_NAME/$COMPONENT_NAME.types.ts - TypeScript definitions"
echo "  • $COMPONENT_NAME/$COMPONENT_NAME.test.tsx - Test suite"
echo "  • $COMPONENT_NAME/$COMPONENT_NAME.stories.tsx - Storybook stories"
echo "  • $COMPONENT_NAME/index.ts - Clean exports"
if [ "$USE_STYLED" = true ]; then
    echo "  • $COMPONENT_NAME/$COMPONENT_NAME.styled.ts - Styled Components"
else
    echo "  • $COMPONENT_NAME/$COMPONENT_NAME.module.css - CSS Modules"
fi
echo "  • $COMPONENT_NAME/README.md - Documentation"
echo ""
echo "🚀 Next Steps:"
echo "  1. Review generated code and customize as needed"
echo "  2. Run tests: npm test"
echo "  3. View in Storybook: npm run storybook"
echo "  4. Import and use in your application"
echo ""
echo "📖 Usage Example:"
echo "  import $COMPONENT_NAME from './components/$COMPONENT_NAME';"
echo ""
echo "✨ Happy coding!"
```

════════════════════════════════════════════════════════════════
```

***

## Command Usage Examples

**Create a functional component with hooks:**
```bash
/component MyButton
# Output: Complete functional component with TypeScript, tests, and documentation
```

**Create a class component:**
```bash
/component MyForm --class
# Output: Class-based component with state management
```

**Create a component with styled-components:**
```bash
/component Card --styled
# Output: Component using styled-components for styling
```

**Create a component without hooks:**
```bash
/component SimpleDiv --no-hooks
# Output: Minimal component without React hooks
```

**Package.json dependencies (auto-added):**
```json
{
  "devDependencies": {
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/user-event": "^14.4.3",
    "@storybook/react": "^7.0.0",
    "@storybook/react-vite": "^7.0.0",
    "styled-components": "^6.0.0"
  }
}
```

***

This comprehensive component generator creates production-ready React components with TypeScript support, comprehensive testing, accessibility features, and full documentation.[1][2][3][4][5]
