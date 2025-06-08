#!/bin/bash

# Test script for VaktAI after modularization

echo "Running VaktAI modular structure test..."

# Check that all required components exist
echo "Checking component files..."

# Layout components
if [ -f "components/layout/Header.tsx" ] && [ -f "components/layout/Footer.tsx" ]; then
  echo "✅ Layout components found"
else
  echo "❌ Layout components missing"
fi

# Modal components
MODAL_FILES=("components/modals/SettingsModal.tsx" "components/modals/NotificationsModal.tsx" 
  "components/modals/AddStaffModal.tsx" "components/modals/AddTourModal.tsx" 
  "components/modals/StaffDetailsModal.tsx" "components/modals/ShiftModal.tsx" 
  "components/modals/ReplacementModal.tsx")

MODAL_OK=true
for file in "${MODAL_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    MODAL_OK=false
    echo "❌ Missing modal file: $file"
  fi
done

if [ "$MODAL_OK" = true ]; then
  echo "✅ Modal components found"
fi

# Chart components
CHART_FILES=("components/charts/BarChart.tsx" "components/charts/LineChart.tsx" "components/charts/DoughnutChart.tsx")

CHART_OK=true
for file in "${CHART_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    CHART_OK=false
    echo "❌ Missing chart file: $file"
  fi
done

if [ "$CHART_OK" = true ]; then
  echo "✅ Chart components found"
fi

# Common components
COMMON_FILES=("components/common/Toast.tsx" "components/common/LoadingSpinner.tsx" 
  "components/common/ErrorBoundary.tsx" "components/common/Icons.tsx")

COMMON_OK=true
for file in "${COMMON_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    COMMON_OK=false
    echo "❌ Missing common file: $file"
  fi
done

if [ "$COMMON_OK" = true ]; then
  echo "✅ Common components found"
fi

# View components
VIEW_FILES=("components/views/ScheduleView.tsx" "components/views/StaffView.tsx" 
  "components/views/ToursView.tsx" "components/views/AnalyticsView.tsx" "components/views/AIView.tsx")

VIEW_OK=true
for file in "${VIEW_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    VIEW_OK=false
    echo "❌ Missing view file: $file"
  fi
done

if [ "$VIEW_OK" = true ]; then
  echo "✅ View components found"
fi

# Special components
if [ -f "components/schedule/WeeklySchedule.tsx" ]; then
  echo "✅ Schedule components found"
else
  echo "❌ Schedule components missing"
fi

if [ -f "components/ai/AIChat.tsx" ]; then
  echo "✅ AI components found"
else
  echo "❌ AI components missing"
fi

# Check main page
if [ -f "pages/index.tsx" ]; then
  echo "✅ Main page found"
else
  echo "❌ Main page missing"
fi

# Check API hook
if [ -f "hooks/useApi.ts" ]; then
  echo "✅ API hook found"
else
  echo "❌ API hook missing"
fi

echo ""
echo "Test complete. Run 'npm run dev' to start the application."
