#!/bin/bash
# Libby Live - Complete Automated Startup
# One command to get everything running

set -e

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATA_DIR="${DATA_DIR:-$REPO_DIR/data}"
PORT="${PORT:-3000}"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🚀 Libby Live - Automated Startup${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Check if data directory exists
if [ ! -d "$DATA_DIR" ]; then
    echo -e "${BLUE}📁 Creating data directory structure...${NC}"
    mkdir -p "$DATA_DIR/demo_patient/ledgers"

    # Create demo patient files
    cat > "$DATA_DIR/demo_patient/profile.md" << 'EOF'
# Patient Zero Profile - Demo Patient

## Core Information
- **Name**: Demo Patient
- **Status**: Test Case
- **Updated**: 2026-04-22

## Diagnoses
- Demonstration Case (managed)
- Testing System Components

## Current Priorities
1. System validation
2. Evidence tracking
3. Chat integration testing
EOF

    cat > "$DATA_DIR/demo_patient/timeline.md" << 'EOF'
# Timeline - Demo Patient

## 2026-04-22
- Libby Live system initialized
- All components ready for testing
- Demo data loaded successfully
EOF

    cat > "$DATA_DIR/demo_patient/evidence_ledger.csv" << 'EOF'
date,document_type,title,source,confidence_level,agent_domain,summary,action_required
2026-04-22,test,System Initialization,Libby Live,confirmed,Demo-Agent,Demo data loaded successfully,Verify endpoints working
EOF

    cat > "$DATA_DIR/demo_patient/ledgers/contacts_master.csv" << 'EOF'
name,title,organization,specialty,contact_method,phone,email,last_contact,relationship_status,notes
Demo Provider,MD,Demo Hospital,General Medicine,email,555-0100,demo@hospital.ca,2026-04-22,primary_provider,Demo contact for testing
EOF

    cat > "$DATA_DIR/demo_patient/ledgers/correspondence.csv" << 'EOF'
date,document_type,from,to,subject,status,summary
2026-04-22,test,System,Demo Patient,System Ready,confirmed,All endpoints initialized
EOF

    cat > "$DATA_DIR/demo_patient/ledgers/appointments_transportation.csv" << 'EOF'
date,appointment_type,provider_name,location,city,phone,notes,transport_mode,estimated_distance_km,confirmation_status,accessibility_notes
2026-05-01,System Check,Demo Provider,Demo Hospital,Toronto,555-0100,Demo appointment for testing,Self,5.0,confirmed,Demo
EOF

    echo -e "${GREEN}✅ Data directory created with demo patient${NC}"
else
    echo -e "${GREEN}✅ Data directory already exists${NC}"
fi

echo ""
echo -e "${BLUE}🔍 Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js v16+${NC}"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js ${NODE_VERSION}${NC}"

# Check if Ollama is running (optional)
if curl -s http://localhost:11434 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Ollama is running on localhost:11434 (free LLM mode)${NC}"
    OLLAMA_AVAILABLE=true
else
    echo -e "${BLUE}ℹ️  Ollama not detected. Chat will use OpenRouter fallback.${NC}"
    echo -e "${BLUE}   To enable free local chat, install Ollama: https://ollama.ai${NC}"
    OLLAMA_AVAILABLE=false
fi

echo ""
echo -e "${BLUE}🎯 Starting Libby Live Server...${NC}"
echo -e "${BLUE}───────────────────────────────────────────────────────────${NC}"

# Export environment
export DATA_ROOT="$DATA_DIR"
export NODE_ENV="${NODE_ENV:-development}"

# Start server
cd "$REPO_DIR"
exec node libby-local-server.js
