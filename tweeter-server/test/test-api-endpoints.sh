#!/bin/bash

# API Gateway Base URL
BASE_URL="https://syo9zl3582.execute-api.us-west-1.amazonaws.com/dev"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test results
TESTS_PASSED=0
TESTS_FAILED=0

# Function to test an endpoint
test_endpoint() {
    local test_name=$1
    local endpoint=$2
    local data_file=$3
    
    echo -e "${YELLOW}Testing: ${test_name}${NC}"
    echo "Endpoint: POST ${endpoint}"
    
    # Read the JSON data
    if [ ! -f "$data_file" ]; then
        echo -e "${RED}✗ FAILED: Data file not found: $data_file${NC}\n"
        ((TESTS_FAILED++))
        return
    fi
    
    # Make the request and capture response
    response=$(curl -s -X POST \
        "${BASE_URL}${endpoint}" \
        -H "Content-Type: application/json" \
        -d @"$data_file")
    
    # Check if response contains success or error
    if echo "$response" | grep -q '"success":true'; then
        echo -e "${GREEN}✓ PASSED${NC}"
        echo "Response: $(echo $response | jq '.' 2>/dev/null || echo $response)"
        ((TESTS_PASSED++))
    elif echo "$response" | grep -q '"success":false'; then
        echo -e "${YELLOW}⚠ Partial Response (API returned success:false)${NC}"
        echo "Response: $(echo $response | jq '.' 2>/dev/null || echo $response)"
        ((TESTS_FAILED++))
    else
        echo -e "${RED}✗ FAILED${NC}"
        echo "Response: $(echo $response | jq '.' 2>/dev/null || echo $response)"
        ((TESTS_FAILED++))
    fi
    echo ""
}

# Script directory (where the test data is)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DATA_DIR="${SCRIPT_DIR}/api-test-data"

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}API Gateway Endpoint Test Suite${NC}"
echo -e "${YELLOW}========================================${NC}\n"

# Auth Endpoints
echo -e "${YELLOW}=== AUTH ENDPOINTS ===${NC}\n"
test_endpoint "Login" "/auth/login" "${DATA_DIR}/login.json"
test_endpoint "Register" "/auth/register" "${DATA_DIR}/register.json"
test_endpoint "Logout" "/auth/logout" "${DATA_DIR}/logout.json"

# User Endpoints
echo -e "${YELLOW}=== USER ENDPOINTS ===${NC}\n"
test_endpoint "Get User" "/users/get-user" "${DATA_DIR}/get-user.json"
test_endpoint "Get Feed" "/users/get-feed" "${DATA_DIR}/get-feed.json"
test_endpoint "Get Story" "/users/get-story" "${DATA_DIR}/get-story.json"
test_endpoint "Post Status" "/users/post-status" "${DATA_DIR}/post-status.json"

# Follow Endpoints
echo -e "${YELLOW}=== FOLLOW ENDPOINTS ===${NC}\n"
test_endpoint "Get Followers" "/follow/get-followers" "${DATA_DIR}/get-followers.json"
test_endpoint "Get Followees" "/follow/get-followees" "${DATA_DIR}/get-followees.json"
test_endpoint "Get Follower Count" "/follow/get-follower-count" "${DATA_DIR}/get-follower-count.json"
test_endpoint "Get Followee Count" "/follow/get-followee-count" "${DATA_DIR}/get-followee-count.json"
test_endpoint "Follow" "/follow/follow" "${DATA_DIR}/follow.json"
test_endpoint "Unfollow" "/follow/unfollow" "${DATA_DIR}/unfollow.json"
test_endpoint "Is Follower Status" "/follow/is-follower-status" "${DATA_DIR}/is-follower-status.json"

# Summary
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Test Summary${NC}"
echo -e "${YELLOW}========================================${NC}"
echo -e "${GREEN}Passed: ${TESTS_PASSED}${NC}"
echo -e "${RED}Failed: ${TESTS_FAILED}${NC}"
echo -e "Total: $((TESTS_PASSED + TESTS_FAILED))"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}✓ All tests passed!${NC}\n"
    exit 0
else
    echo -e "\n${RED}✗ Some tests failed${NC}\n"
    exit 1
fi
