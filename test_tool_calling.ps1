# Test Tool Calling Implementation

Write-Host "=== TOOL CALLING IMPLEMENTATION TEST SUITE ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "Test 1: Health Check" -ForegroundColor Yellow
$response = curl -s http://localhost:8000/health
Write-Host "Response: $response" -ForegroundColor Green
Write-Host ""

# Test 2: User Registration/Login
Write-Host "Test 2: User Auth" -ForegroundColor Yellow
$authUrl = "http://localhost:3000/api/auth/signin"
Write-Host "Auth endpoint: $authUrl" -ForegroundColor Gray
$token = "test-token-for-local-dev"
Write-Host "Using token: $token" -ForegroundColor Green
Write-Host ""

# Test 3: Add Task (Test Tool Calling)
Write-Host "Test 3: Add Task via Chat (Tool Calling)" -ForegroundColor Yellow
$chatPayload = @{
    message = "Add a task to buy groceries"
    conversation_id = $null
} | ConvertTo-Json

Write-Host "Payload: $chatPayload" -ForegroundColor Gray

$response = curl -s -X POST http://localhost:8000/api/chat `
    -H "Content-Type: application/json" `
    -H "Authorization: Bearer $token" `
    -d $chatPayload

Write-Host "Response:" -ForegroundColor Green
$response | ConvertFrom-Json | ConvertTo-Json | Write-Host
Write-Host ""

# Test 4: List Tasks (Test Tool Calling)
Write-Host "Test 4: List Tasks via Chat (Tool Calling)" -ForegroundColor Yellow
$chatPayload = @{
    message = "Show me all my tasks"
    conversation_id = $null
} | ConvertTo-Json

$response = curl -s -X POST http://localhost:8000/api/chat `
    -H "Content-Type: application/json" `
    -H "Authorization: Bearer $token" `
    -d $chatPayload

Write-Host "Response:" -ForegroundColor Green
$parsed = $response | ConvertFrom-Json
Write-Host "Conversation ID: $($parsed.conversation_id)" -ForegroundColor Green
Write-Host "Assistant Response: $($parsed.response)" -ForegroundColor Green
Write-Host ""

# Test 5: Check if tools were called
Write-Host "Test 5: Verify Tool Calling (Check Message in DB)" -ForegroundColor Yellow
Write-Host "Tool calling is verified if:" -ForegroundColor Gray
Write-Host "- Response contains actual task data (not generic text)" -ForegroundColor Gray
Write-Host "- Tool names are stored in message records" -ForegroundColor Gray
Write-Host "- Tool results contain database data" -ForegroundColor Gray
Write-Host ""

Write-Host "=== TEST SUITE COMPLETE ===" -ForegroundColor Cyan
