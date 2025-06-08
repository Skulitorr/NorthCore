# Test script for VaktAI after modularization

Write-Host "Running VaktAI modular structure test..." -ForegroundColor Cyan

# Check that all required components exist
Write-Host "Checking component files..." -ForegroundColor Cyan

# Layout components
if ((Test-Path "components/layout/Header.tsx") -and (Test-Path "components/layout/Footer.tsx")) {
  Write-Host "✅ Layout components found" -ForegroundColor Green
} else {
  Write-Host "❌ Layout components missing" -ForegroundColor Red
}

# Modal components
$MODAL_FILES = @(
  "components/modals/SettingsModal.tsx", 
  "components/modals/NotificationsModal.tsx", 
  "components/modals/AddStaffModal.tsx", 
  "components/modals/AddTourModal.tsx", 
  "components/modals/StaffDetailsModal.tsx", 
  "components/modals/ShiftModal.tsx", 
  "components/modals/ReplacementModal.tsx"
)

$MODAL_OK = $true
foreach ($file in $MODAL_FILES) {
  if (-not (Test-Path $file)) {
    $MODAL_OK = $false
    Write-Host "❌ Missing modal file: $file" -ForegroundColor Red
  }
}

if ($MODAL_OK) {
  Write-Host "✅ Modal components found" -ForegroundColor Green
}

# Chart components
$CHART_FILES = @(
  "components/charts/BarChart.tsx", 
  "components/charts/LineChart.tsx", 
  "components/charts/DoughnutChart.tsx"
)

$CHART_OK = $true
foreach ($file in $CHART_FILES) {
  if (-not (Test-Path $file)) {
    $CHART_OK = $false
    Write-Host "❌ Missing chart file: $file" -ForegroundColor Red
  }
}

if ($CHART_OK) {
  Write-Host "✅ Chart components found" -ForegroundColor Green
}

# Common components
$COMMON_FILES = @(
  "components/common/Toast.tsx", 
  "components/common/LoadingSpinner.tsx", 
  "components/common/ErrorBoundary.tsx", 
  "components/common/Icons.tsx"
)

$COMMON_OK = $true
foreach ($file in $COMMON_FILES) {
  if (-not (Test-Path $file)) {
    $COMMON_OK = $false
    Write-Host "❌ Missing common file: $file" -ForegroundColor Red
  }
}

if ($COMMON_OK) {
  Write-Host "✅ Common components found" -ForegroundColor Green
}

# View components
$VIEW_FILES = @(
  "components/views/ScheduleView.tsx", 
  "components/views/StaffView.tsx", 
  "components/views/ToursView.tsx", 
  "components/views/AnalyticsView.tsx", 
  "components/views/AIView.tsx"
)

$VIEW_OK = $true
foreach ($file in $VIEW_FILES) {
  if (-not (Test-Path $file)) {
    $VIEW_OK = $false
    Write-Host "❌ Missing view file: $file" -ForegroundColor Red
  }
}

if ($VIEW_OK) {
  Write-Host "✅ View components found" -ForegroundColor Green
}

# Special components
if (Test-Path "components/schedule/WeeklySchedule.tsx") {
  Write-Host "✅ Schedule components found" -ForegroundColor Green
} else {
  Write-Host "❌ Schedule components missing" -ForegroundColor Red
}

if (Test-Path "components/ai/AIChat.tsx") {
  Write-Host "✅ AI components found" -ForegroundColor Green
} else {
  Write-Host "❌ AI components missing" -ForegroundColor Red
}

# Check main page
if (Test-Path "pages/index.tsx") {
  Write-Host "✅ Main page found" -ForegroundColor Green
} else {
  Write-Host "❌ Main page missing" -ForegroundColor Red
}

# Check API hook
if (Test-Path "hooks/useApi.ts") {
  Write-Host "✅ API hook found" -ForegroundColor Green
} else {
  Write-Host "❌ API hook missing" -ForegroundColor Red
}

Write-Host ""
Write-Host "Test complete. Run 'npm run dev' to start the application." -ForegroundColor Cyan
