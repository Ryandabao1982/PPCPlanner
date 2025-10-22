#!/bin/bash
# Verification script for PPC Planner test suite

echo "🧪 PPC Planner Test Suite Verification"
echo "======================================"
echo ""

echo "📋 Checking test configuration..."
if [ -f "vitest.config.ts" ]; then
    echo "✅ vitest.config.ts exists"
else
    echo "❌ vitest.config.ts missing"
    exit 1
fi

echo ""
echo "📦 Checking dependencies..."
if npm list vitest >/dev/null 2>&1; then
    echo "✅ vitest installed"
else
    echo "❌ vitest not installed"
    exit 1
fi

if npm list @testing-library/react >/dev/null 2>&1; then
    echo "✅ @testing-library/react installed"
else
    echo "❌ @testing-library/react not installed"
    exit 1
fi

echo ""
echo "📁 Checking test files..."
test_files=(
    "tests/audit.test.ts"
    "tests/validation.test.ts"
    "tests/helpers.test.ts"
    "tests/hooks.test.ts"
    "tests/userLogger.test.ts"
    "tests/exclusions.test.ts"
    "tests/constants.test.ts"
)

for file in "${test_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

echo ""
echo "📖 Checking documentation..."
if [ -f "tests/README.md" ]; then
    echo "✅ tests/README.md exists"
else
    echo "❌ tests/README.md missing"
fi

if [ -f "TEST_COVERAGE_REPORT.md" ]; then
    echo "✅ TEST_COVERAGE_REPORT.md exists"
else
    echo "❌ TEST_COVERAGE_REPORT.md missing"
fi

echo ""
echo "🏃 Running tests..."
npm test

echo ""
echo "✅ All verification checks passed!"
