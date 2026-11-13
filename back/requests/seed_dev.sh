#!/usr/bin/env bash
# =============================================================================
# Developer Seed Script
# Sets up a realistic dev environment with:
#   - 1 admin user
#   - 20 basic users
#   - 4 categories
#   - 32 events (mix of mandatory & optional)
#   - Done events assigned to users with varied statuses
#
# Usage:
#   mise run seed          # (backend must be running: mise run dev)
#   ./back/requests/seed_dev.sh
#   BASE_URL=http://localhost:3001/api ./back/requests/seed_dev.sh
#
# Note: safe to run multiple times — duplicate records are silently ignored.
# =============================================================================
set -uo pipefail

BASE_URL="${BASE_URL:-http://localhost:8000/api}"

echo "=== Seeding dev environment ==="

# ---------------------------------------------------------------------------
# Wait for backend to be reachable
# --------------------------ƒ-------------------------------------------------
echo "--- Waiting for backend at $BASE_URL ---"
MAX_RETRIES=30
for i in $(seq 1 $MAX_RETRIES); do
  if curl -sf -o /dev/null "$BASE_URL/../api/categories" 2>/dev/null; then
    echo "  Backend is up!"
    break
  fi
  if [[ $i -eq $MAX_RETRIES ]]; then
    echo "ERROR: Backend not reachable at $BASE_URL after ${MAX_RETRIES}s."
    echo "       Start it first with: mise run dev"
    exit 1
  fi
  printf "  Waiting... (%d/%d)\r" "$i" "$MAX_RETRIES"
  sleep "$i" # linear backoff: 1s, 2s, 3s, ... up to 30s
done

# ---------------------------------------------------------------------------
# 1. Create admin user (ignore if already exists)
# ---------------------------------------------------------------------------
echo "--- Creating admin user ---"
ADMIN_RESPONSE=$(curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "ADMIN",
    "email": "phuxivator@tf.fi",
    "password": "123123",
    "firstName": "Phux",
    "lastName": "Ivator",
    "fieldOfStudy": "TF",
    "events": [],
    "capWithTF": false
  }')
echo "  Admin: done (may already exist)"

# ---------------------------------------------------------------------------
# 2. Login as admin to get JWT
# ---------------------------------------------------------------------------
echo "--- Logging in as admin ---"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "phuxivator@tf.fi",
    "password": "123123"
  }')
TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])" 2>/dev/null)
if [[ -z "$TOKEN" ]]; then
  echo "ERROR: Failed to login as admin. Response: $LOGIN_RESPONSE"
  exit 1
fi
AUTH="Authorization: bearer $TOKEN"
echo "  Got token: ${TOKEN:0:20}..."

# ---------------------------------------------------------------------------
# 3. Create 4 categories
# ---------------------------------------------------------------------------
echo "--- Creating categories ---"

curl -s -X POST "$BASE_URL/categories" \
  -H "Content-Type: application/json" \
  -H "$AUTH" \
  -d '{
    "name": "Obligatoriska",
    "description": "Obligatoriska poäng som alla phuxar måste samla."
  }' > /dev/null
echo "  Category 1: Obligatoriska"

curl -s -X POST "$BASE_URL/categories" \
  -H "Content-Type: application/json" \
  -H "$AUTH" \
  -d '{
    "name": "Fest",
    "description": "Festliga tillställningar och sitsit.",
    "minPoints": 80
  }' > /dev/null
echo "  Category 2: Fest"

curl -s -X POST "$BASE_URL/categories" \
  -H "Content-Type: application/json" \
  -H "$AUTH" \
  -d '{
    "name": "Kultur",
    "description": "Kulturella evenemang: teater, museum, film och mera.",
    "minPoints": 40
  }' > /dev/null
echo "  Category 3: Kultur"

curl -s -X POST "$BASE_URL/categories" \
  -H "Content-Type: application/json" \
  -H "$AUTH" \
  -d '{
    "name": "Sport & Motion",
    "description": "Sportevenemang och fysisk aktivitet.",
    "minPoints": 30
  }' > /dev/null
echo "  Category 4: Sport & Motion"

# ---------------------------------------------------------------------------
# 4. Create events
# ---------------------------------------------------------------------------
echo "--- Creating events ---"

create_event() {
  local name="$1" desc="$2" start="$3" end="$4" points="$5" limit="$6" catId="$7" mandatory="$8"
  curl -s -X POST "$BASE_URL/events" \
    -H "Content-Type: application/json" \
    -H "$AUTH" \
    -d "{
      \"name\": \"$name\",
      \"description\": \"$desc\",
      \"startTime\": \"$start\",
      \"endTime\": \"$end\",
      \"points\": \"$points\",
      \"userLimit\": $limit,
      \"categoryId\": $catId,
      \"mandatory\": $mandatory
    }" > /dev/null
  echo "  Event: $name (cat=$catId, mandatory=$mandatory, pts=$points)"
}

# -- Category 1: Obligatoriska (mandatory) --
create_event "NaMö 1"              "Nationsmöte 1 – Höstens första nationsmöte"            "09-15-2025" "09-15-2025" "10" 200 1 true
create_event "NaMö 2"              "Nationsmöte 2 – Höstens andra nationsmöte"             "10-20-2025" "10-20-2025" "10" 200 1 true
create_event "NaMö 3"              "Nationsmöte 3 – Vårens nationsmöte"                    "02-15-2026" "02-15-2026" "10" 200 1 true
create_event "ÅMö"                 "Årsmöte – TF:s stadgeenliga årsmöte"                   "03-20-2026" "03-20-2026" "15" 200 1 true
create_event "Phuxkursen"          "Introduktionskurs i TF:s verksamhet"                   "09-01-2025" "09-01-2025" "20" 300 1 true
create_event "Phuxgasque"          "Den stora phuxgasquen"                                 "11-15-2025" "11-15-2025" "20" 250 1 true
create_event "Gulnäbbslunch 1"     "Första lunchen med gulnäbbarna"                        "09-10-2025" "09-10-2025" "5"  100 1 true
create_event "Gulnäbbslunch 2"     "Andra lunchen med gulnäbbarna"                         "10-08-2025" "10-08-2025" "5"  100 1 true

# -- Category 2: Fest (optional) --
create_event "Fuksiaissitsit"      "Välkomstsitsit för nya phuxar"                         "09-05-2025" "09-05-2025" "15" 80  2 false
create_event "Årsfesten"           "TF:s stora årsfest"                                    "02-28-2026" "02-28-2026" "25" 200 2 false
create_event "Vappusitsit"         "Sitsit inför valborg"                                  "04-29-2026" "04-29-2026" "20" 100 2 false
create_event "Julphesten"          "Julfest med glögg och pepparkakor"                     "12-12-2025" "12-12-2025" "15" 150 2 false
create_event "Kräftskivan"         "Traditionell kräftskiva"                               "08-25-2025" "08-25-2025" "15" 60  2 false
create_event "Oktoberfest"         "Bayersk fest med bratwurst och öl"                     "10-10-2025" "10-10-2025" "10" 80  2 false
create_event "Gammaldans"          "Traditionell gammaldans på Urdsgjallar"                 "11-22-2025" "11-22-2025" "10" 120 2 false
create_event "Phuxphest"           "Fest specifikt för phuxar"                             "10-04-2025" "10-04-2025" "15" 100 2 false
create_event "TF-sitsit"           "Klassiska TF-sitsit"                                   "01-24-2026" "01-24-2026" "15" 80  2 false
create_event "Halloweenfest"       "Skrämmande maskeradsitsit"                             "10-31-2025" "10-31-2025" "10" 100 2 false

# -- Category 3: Kultur (optional) --
create_event "Teaterbesök"         "Besök till Svenska Teatern"                            "10-15-2025" "10-15-2025" "10" 40  3 false
create_event "Museibesök"          "Guidad tur på Ateneum"                                 "11-05-2025" "11-05-2025" "10" 30  3 false
create_event "Filmkväll"           "Filmvisning på TF"                                     "09-20-2025" "09-20-2025" "5"  50  3 false
create_event "Bokklubb"            "Diskussion av månadens bok"                            "10-25-2025" "10-25-2025" "5"  20  3 false
create_event "Konstutställning"    "Besök till Kiasma"                                     "01-18-2026" "01-18-2026" "10" 30  3 false
create_event "Körens konsert"      "TF:s körs höstkonsert"                                 "12-05-2025" "12-05-2025" "10" 200 3 false
create_event "Kulturquiz"          "Allmänbildningsquiz på Urdsgjallar"                     "11-12-2025" "11-12-2025" "5"  60  3 false

# -- Category 4: Sport & Motion (optional) --
create_event "Brännbollsturneringen" "Klassisk brännbollsturnering"                        "05-10-2026" "05-10-2026" "10" 100 4 false
create_event "Fotbollsmatchen"     "TF vs Prodeko fotbollsmatch"                           "09-25-2025" "09-25-2025" "10" 40  4 false
create_event "Innebandy"           "Innebandyturnering i Otahalli"                         "11-08-2025" "11-08-2025" "10" 30  4 false
create_event "Skidresa"            "Veckoslutsskidresa till Lappland"                      "02-08-2026" "02-09-2026" "15" 40  4 false
create_event "Olympiaderna"        "TF:s interna olympiader"                               "04-15-2026" "04-15-2026" "15" 80  4 false
create_event "Morgongymnastik"     "Morgongymnastik varje tisdag i oktober"                "10-01-2025" "10-31-2025" "5"  50  4 false
create_event "Simtävling"          "Simtävling i Otaniemi"                                 "03-12-2026" "03-12-2026" "10" 30  4 false

# ---------------------------------------------------------------------------
# 5. Create 20 basic users
# ---------------------------------------------------------------------------
echo "--- Creating 20 basic users ---"

FIELDS=("Raksa" "Kone" "Sähkö" "Auto" "Tite" "Kemi")

create_user() {
  local email="$1" first="$2" last="$3" field="$4" cap="$5"
  curl -s -X POST "$BASE_URL/users" \
    -H "Content-Type: application/json" \
    -d "{
      \"role\": \"BASIC\",
      \"email\": \"$email\",
      \"password\": \"test123\",
      \"firstName\": \"$first\",
      \"lastName\": \"$last\",
      \"fieldOfStudy\": \"$field\",
      \"events\": [],
      \"capWithTF\": $cap
    }" > /dev/null
  echo "  User: $first $last ($email)"
}

create_user "anna.andersson@aalto.fi"    "Anna"      "Andersson"    "Raksa"  true
create_user "bjorn.bergstrom@aalto.fi"   "Björn"     "Bergström"    "Kone"   false
create_user "clara.carlsson@aalto.fi"    "Clara"     "Carlsson"     "Sähkö"  true
create_user "david.danielsson@aalto.fi"  "David"     "Danielsson"   "Auto"   false
create_user "emma.eriksson@aalto.fi"     "Emma"      "Eriksson"     "Tite"   true
create_user "fredrik.forsberg@aalto.fi"  "Fredrik"   "Forsberg"     "Kemi"   false
create_user "greta.gustafsson@aalto.fi"  "Greta"     "Gustafsson"   "Raksa"  true
create_user "henrik.hakansson@aalto.fi"  "Henrik"    "Håkansson"    "Kone"   true
create_user "ida.isaksson@aalto.fi"      "Ida"       "Isaksson"     "Sähkö"  true
create_user "johan.johansson@aalto.fi"   "Johan"     "Johansson"    "Auto"   false
create_user "karin.karlsson@aalto.fi"    "Karin"     "Karlsson"     "Tite"   true
create_user "lars.larsson@aalto.fi"      "Lars"      "Larsson"      "Kemi"   false
create_user "maja.mattsson@aalto.fi"     "Maja"      "Mattsson"     "Raksa"  true
create_user "nils.nilsson@aalto.fi"      "Nils"      "Nilsson"      "Kone"   false
create_user "olivia.olsson@aalto.fi"     "Olivia"    "Olsson"       "Sähkö"  true
create_user "peter.pettersson@aalto.fi"  "Peter"     "Pettersson"   "Auto"   true
create_user "rebecka.rosenberg@aalto.fi" "Rebecka"   "Rosenberg"    "Tite"   false
create_user "samuel.svensson@aalto.fi"   "Samuel"    "Svensson"     "Kemi"   true
create_user "tina.tornqvist@aalto.fi"    "Tina"      "Törnqvist"    "Raksa"  false
create_user "ulf.ullman@aalto.fi"        "Ulf"       "Ullman"       "Kone"   true

# ---------------------------------------------------------------------------
# 6. Assign done events to users with varied statuses
# ---------------------------------------------------------------------------
echo "--- Assigning done events to users ---"

# User IDs: admin=1, users=2..21
# Event IDs: 1..32 (8 obligatoriska + 10 fest + 7 kultur + 7 sport)

add_done_event() {
  local userId="$1" eventId="$2"
  curl -s -X POST "$BASE_URL/users/$userId/done_events/$eventId" \
    -H "$AUTH" > /dev/null
}

update_done_event_status() {
  local userId="$1" eventId="$2" status="$3"
  # API expects uppercase status: PENDING, CONFIRMED, COMPLETED, CANCELLED
  local upperStatus
  upperStatus=$(echo "$status" | tr '[:lower:]' '[:upper:]')
  curl -s -X PUT "$BASE_URL/users/$userId/done_events/$eventId" \
    -H "Content-Type: application/json" \
    -H "$AUTH" \
    -d "{\"status\": \"$upperStatus\"}" > /dev/null
}

# Helper: sign up user for event, then optionally set status
assign() {
  local userId="$1" eventId="$2" status="${3:-}"
  add_done_event "$userId" "$eventId"
  if [[ -n "$status" ]]; then
    update_done_event_status "$userId" "$eventId" "$status"
  fi
}

# --- User 2 (Anna) - Very active, almost all mandatory done, many optional ---
echo "  Assigning events for Anna (user 2)..."
for eid in 1 2 5 6; do assign 2 $eid "completed"; done
assign 2 3 "confirmed"
assign 2 4 "confirmed"
assign 2 7 "completed"
assign 2 8                  # pending
assign 2 9 "completed"
assign 2 10 "confirmed"
assign 2 12 "completed"
assign 2 14                 # pending
assign 2 16 "cancelled"
assign 2 19 "completed"
assign 2 21 "confirmed"
assign 2 24                 # pending
assign 2 26 "completed"
assign 2 27 "confirmed"
assign 2 30                 # pending
assign 2 11 "confirmed"
assign 2 25                 # pending

# --- User 3 (Björn) - Moderate, some mandatory, few optional ---
echo "  Assigning events for Björn (user 3)..."
assign 3 1 "completed"
assign 3 2 "confirmed"
assign 3 5 "completed"
assign 3 6 "cancelled"
assign 3 7                  # pending
assign 3 3 "confirmed"
assign 3 9 "completed"
assign 3 12                 # pending
assign 3 14 "cancelled"
assign 3 20 "confirmed"
assign 3 27 "completed"

# --- User 4 (Clara) - All mandatory, cultural focus ---
echo "  Assigning events for Clara (user 4)..."
assign 4 1 "completed"
assign 4 2 "completed"
assign 4 3 "confirmed"
assign 4 4                  # pending
assign 4 5 "completed"
assign 4 6 "confirmed"
assign 4 7 "completed"
assign 4 8 "confirmed"
assign 4 19 "completed"
assign 4 20 "confirmed"
assign 4 21                 # pending
assign 4 22 "completed"
assign 4 23 "cancelled"
assign 4 24 "confirmed"
assign 4 25                 # pending
assign 4 9 "cancelled"
assign 4 15                 # pending

# --- User 5 (David) - Minimal participation ---
echo "  Assigning events for David (user 5)..."
assign 5 1 "completed"
assign 5 5                  # pending
assign 5 7 "confirmed"
assign 5 2 "confirmed"
assign 5 9 "cancelled"

# --- User 6 (Emma) - Active in sports ---
echo "  Assigning events for Emma (user 6)..."
assign 6 1 "completed"
assign 6 2 "confirmed"
assign 6 3 "completed"
assign 6 5 "completed"
assign 6 6                  # pending
assign 6 7 "confirmed"
assign 6 4 "confirmed"
assign 6 9 "completed"
assign 6 26 "completed"
assign 6 27 "confirmed"
assign 6 28                 # pending
assign 6 29 "cancelled"
assign 6 30 "completed"
assign 6 31 "confirmed"
assign 6 32                 # pending

# --- User 7 (Fredrik) - Party person ---
echo "  Assigning events for Fredrik (user 7)..."
assign 7 1 "completed"
assign 7 2 "confirmed"
assign 7 5                  # pending
assign 7 7 "completed"
assign 7 3 "confirmed"
assign 7 9 "completed"
assign 7 10 "confirmed"
assign 7 11                 # pending
assign 7 12 "completed"
assign 7 13 "cancelled"
assign 7 14 "confirmed"
assign 7 15                 # pending
assign 7 16 "completed"
assign 7 17 "cancelled"
assign 7 18 "confirmed"

# --- User 8 (Greta) - Well-rounded ---
echo "  Assigning events for Greta (user 8)..."
assign 8 1 "completed"
assign 8 2 "completed"
assign 8 3 "confirmed"
assign 8 4                  # pending
assign 8 5 "completed"
assign 8 6 "confirmed"
assign 8 7 "completed"
assign 8 8                  # pending
assign 8 9 "cancelled"
assign 8 12 "confirmed"
assign 8 16                 # pending
assign 8 19 "completed"
assign 8 22 "confirmed"
assign 8 24 "cancelled"
assign 8 26                 # pending
assign 8 28 "completed"

# --- User 9 (Henrik) - Early bird, lots of confirmed/pending ---
echo "  Assigning events for Henrik (user 9)..."
assign 9 1 "completed"
assign 9 2 "confirmed"
assign 9 3                  # pending
assign 9 5 "completed"
assign 9 6 "confirmed"
assign 9 4                  # pending
assign 9 7 "confirmed"
assign 9 10                 # pending
assign 9 11 "confirmed"
assign 9 15 "confirmed"
assign 9 29                 # pending

# --- User 10 (Ida) - Almost done with everything ---
echo "  Assigning events for Ida (user 10)..."
assign 10 1 "completed"
assign 10 2 "completed"
assign 10 3 "completed"
assign 10 4 "confirmed"
assign 10 5 "completed"
assign 10 6 "completed"
assign 10 7 "confirmed"
assign 10 8                 # pending
assign 10 9 "completed"
assign 10 10 "confirmed"
assign 10 12 "cancelled"
assign 10 14 "completed"
assign 10 16                # pending
assign 10 18 "confirmed"
assign 10 19 "completed"
assign 10 20 "cancelled"
assign 10 21 "confirmed"
assign 10 24                # pending
assign 10 26 "completed"
assign 10 27                # pending
assign 10 30 "confirmed"

# --- User 11 (Johan) - Cancelled several events ---
echo "  Assigning events for Johan (user 11)..."
assign 11 1 "completed"
assign 11 2 "confirmed"
assign 11 5                 # pending
assign 11 3 "cancelled"
assign 11 6 "cancelled"
assign 11 9 "cancelled"
assign 11 12 "completed"
assign 11 14 "cancelled"
assign 11 27 "confirmed"
assign 11 19               # pending

# --- User 12 (Karin) - Moderate participation ---
echo "  Assigning events for Karin (user 12)..."
assign 12 1 "completed"
assign 12 2 "confirmed"
assign 12 3                 # pending
assign 12 5 "completed"
assign 12 6 "cancelled"
assign 12 7 "confirmed"
assign 12 9 "completed"
assign 12 13                # pending
assign 12 16 "confirmed"
assign 12 21 "completed"
assign 12 24 "cancelled"
assign 12 28                # pending

# --- User 13 (Lars) - Just started ---
echo "  Assigning events for Lars (user 13)..."
assign 13 1 "completed"
assign 13 5 "confirmed"
assign 13 7                 # pending
assign 13 9                 # pending

# --- User 14 (Maja) - Cultural enthusiast ---
echo "  Assigning events for Maja (user 14)..."
assign 14 1 "completed"
assign 14 2 "confirmed"
assign 14 3                 # pending
assign 14 5 "completed"
assign 14 6 "confirmed"
assign 14 7 "completed"
assign 14 8                 # pending
assign 14 4 "confirmed"
assign 14 9 "cancelled"
assign 14 19 "completed"
assign 14 20 "confirmed"
assign 14 21                # pending
assign 14 22 "completed"
assign 14 23 "cancelled"
assign 14 24 "confirmed"
assign 14 25                # pending

# --- User 15 (Nils) - Sporty ---
echo "  Assigning events for Nils (user 15)..."
assign 15 1 "completed"
assign 15 2 "confirmed"
assign 15 5 "completed"
assign 15 6                 # pending
assign 15 7 "confirmed"
assign 15 3                 # pending
assign 15 12 "cancelled"
assign 15 26 "completed"
assign 15 27 "confirmed"
assign 15 28                # pending
assign 15 29 "completed"
assign 15 30 "cancelled"
assign 15 31 "confirmed"
assign 15 32                # pending

# --- User 16 (Olivia) - Active, mix of everything ---
echo "  Assigning events for Olivia (user 16)..."
assign 16 1 "completed"
assign 16 2 "completed"
assign 16 3 "confirmed"
assign 16 4                 # pending
assign 16 5 "completed"
assign 16 6 "confirmed"
assign 16 7 "completed"
assign 16 8 "cancelled"
assign 16 9 "confirmed"
assign 16 10                # pending
assign 16 14 "completed"
assign 16 19 "cancelled"
assign 16 22 "confirmed"
assign 16 26                # pending
assign 16 30 "completed"

# --- User 17 (Peter) - Moderate ---
echo "  Assigning events for Peter (user 17)..."
assign 17 1 "completed"
assign 17 2 "confirmed"
assign 17 3                 # pending
assign 17 5 "completed"
assign 17 7 "cancelled"
assign 17 4 "confirmed"
assign 17 9                 # pending
assign 17 12 "completed"
assign 17 16 "confirmed"
assign 17 27                # pending

# --- User 18 (Rebecka) - Behind on mandatory ---
echo "  Assigning events for Rebecka (user 18)..."
assign 18 1 "completed"
assign 18 5                 # pending
assign 18 2 "confirmed"
assign 18 9 "completed"
assign 18 14 "cancelled"
assign 18 20 "confirmed"

# --- User 19 (Samuel) - Very active, party + culture ---
echo "  Assigning events for Samuel (user 19)..."
assign 19 1 "completed"
assign 19 2 "completed"
assign 19 3 "confirmed"
assign 19 4                 # pending
assign 19 5 "completed"
assign 19 6 "confirmed"
assign 19 7 "completed"
assign 19 8                 # pending
assign 19 9 "completed"
assign 19 10 "confirmed"
assign 19 12                # pending
assign 19 13 "cancelled"
assign 19 14 "completed"
assign 19 15 "confirmed"
assign 19 16                # pending
assign 19 17 "cancelled"
assign 19 19 "completed"
assign 19 20 "confirmed"
assign 19 21                # pending
assign 19 24 "completed"

# --- User 20 (Tina) - Barely started ---
echo "  Assigning events for Tina (user 20)..."
assign 20 1 "completed"
assign 20 5 "confirmed"
assign 20 7                 # pending
assign 20 9                 # pending

# --- User 21 (Ulf) - Solid progress ---
echo "  Assigning events for Ulf (user 21)..."
assign 21 1 "completed"
assign 21 2 "confirmed"
assign 21 3                 # pending
assign 21 5 "completed"
assign 21 6 "cancelled"
assign 21 7 "confirmed"
assign 21 8 "completed"
assign 21 4                 # pending
assign 21 9 "completed"
assign 21 10 "confirmed"
assign 21 14                # pending
assign 21 16 "cancelled"
assign 21 22 "confirmed"
assign 21 24                # pending
assign 21 27 "completed"
assign 21 30 "confirmed"

echo ""
echo "=== Seed complete! ==="
echo "  Admin: phuxivator@tf.fi / 123123"
echo "  Users: test password is 'test123' for all"
echo "  Categories: 4 (Obligatoriska, Fest, Kultur, Sport & Motion)"
echo "  Events: 32 total"
echo "  Users: 20 basic + 1 admin"
